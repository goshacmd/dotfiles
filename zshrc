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

# export DOCKER_TLS_VERIFY="1"
# export DOCKER_HOST="tcp://192.168.99.100:2376"
# export DOCKER_CERT_PATH="/Users/goshakkk/.docker/machine/machines/default"
# export DOCKER_MACHINE_NAME="default"
# Run this command to configure your shell:
# # eval "$(/usr/local/bin/docker-machine env default)"

alias be='bundle exec'

alias gsu='git submodule foreach git pull'

alias fuck='sudo $(history -p \!\!)'

# Fix 256 colors
source $HOME/Projects/dotfiles/terminal/base16-default.dark.sh

# Local settings
if [[ -e $HOME/.zshrc.local ]]; then source $HOME/.zshrc.local; fi

# OPAM configuration
# . /Users/goshakkk/.opam/opam-init/init.zsh > /dev/null 2> /dev/null || true

export PATH="$(brew --prefix node@16)/bin:$PATH"

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
