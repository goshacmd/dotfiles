#
# Executes commands at login post-zshrc.
#
# Authors:
#   Sorin Ionescu <sorin.ionescu@gmail.com>
#

# Execute code that does not affect the current session in the background.
{
  # Compile the completion dump to increase startup speed.
  zcompdump="${ZDOTDIR:-$HOME}/.zcompdump"
  if [[ -s "$zcompdump" && (! -s "${zcompdump}.zwc" || "$zcompdump" -nt "${zcompdump}.zwc") ]]; then
    zcompile "$zcompdump"
  fi
} &!

#   ___________________________
#  < fortune | cowsay | lolcat >
#   ---------------------------
#          \   ^__^
#           \  (oo)\_______
#              (__)\       )\/\
#                  ||----w |
#                  ||     ||
[[ -e $(which fortune) ]] && fortune | (cowsay || cat) 2&> /dev/null | (lolcat || cat) 2&>/dev/null
