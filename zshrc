#
# Executes commands at the start of an interactive session.
#
# Authors:
#   Sorin Ionescu <sorin.ionescu@gmail.com>
#

# Source Prezto.
if [[ -s "${ZDOTDIR:-$HOME}/.zprezto/init.zsh" ]]; then
  source "${ZDOTDIR:-$HOME}/.zprezto/init.zsh"
fi

# Customize to your needs...

fpath=("$HOME/Projects/dotfiles/terminal" $fpath)
autoload -Uz promptinit && promptinit
prompt 'goshakkk'

export DOCKER_HOST=tcp://172.16.42.43:4243

alias gsu='git submodule foreach git pull'

# Fix 256 colors
source $HOME/Projects/dotfiles/terminal/base16-default.dark.sh

# Local settings
if [[ -e $HOME/.zshrc.local ]]; then source $HOME/.zshrc.local; fi
