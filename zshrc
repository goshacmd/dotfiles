ZSH=$HOME/.oh-my-zsh
ZSH_THEME="sammy"

DISABLE_AUTO_TITLE="true"

plugins=(git brew gem github osx pow powder rails3 ruby heroku rbenv zsh-syntax-highlighting)

source $ZSH/oh-my-zsh.sh

# Disable fucking autocorrect
unsetopt correct_all

# Aliases
alias o="open"
alias br="brew"
alias b="bundle"
alias be="bundle exec"
alias bu="bundle update"
alias ci="git commit -am"
alias g="git"
alias gi="gem install"
alias r="rails"
alias vi="vim"
alias e="vim"
alias c="clear"
alias lu="lunchy"
alias f="foreman"
alias fs="foreman start"
alias fr="foreman run"
alias tm="tmux"
alias tma="tmux attach"
alias tmn="tmux new"
alias tml="tmux ls"

if which hub > /dev/null; then alias git="hub"; fi

# Env vars
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8

export EDITOR="vim -f"
export VISUAL=$EDITOR

# Local settings
if [[ -e $HOME/.zshrc.local ]]; then source $HOME/.zshrc.local; fi

#   ___________________________
#  < fortune | cowsay | lolcat >
#   ---------------------------
#          \   ^__^
#           \  (oo)\_______
#              (__)\       )\/\
#                  ||----w |
#                  ||     ||
[[ -e $(which fortune) ]] && fortune | (cowsay || cat) 2&> /dev/null | (lolcat || cat) 2&>/dev/null
