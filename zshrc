export PROJECTSDIR=$HOME/Projects
export PROJDIR=$PROJECTSDIR
export CODEDIR=$PROJECTSDIR

if [[ -e $HOME/.dotfiles_location ]]; then
  export DOTFILES=$(cat $HOME/.dotfiles_location)
else
  export DOTFILES=$CODEDIR/dotfiles
  echo "~/.dotfiles_location not found, reinstall dotfiles"
fi

ZSH=$HOME/.oh-my-zsh
ZSH_THEME="sammy"

DISABLE_AUTO_TITLE="true"

plugins=(git brew bundler gem github osx pow powder rails3 ruby heroku rbenv zsh-syntax-highlighting)

source $ZSH/oh-my-zsh.sh

# Disable fucking autocorrect
unsetopt correct_all

# Aliases
alias b="bundle"
alias be="bundle exec"
alias ci="git commit -am"
alias g="git"
alias gi="gem install"
alias r="rails"
alias vi="vim"
alias e="vim"
alias c="clear"

if which hub > /dev/null; then alias git="hub"; fi

# Env vars
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8

export EDITOR="vim -f"
export VISUAL=$EDITOR

export PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin:/usr/X11/bin
export PATH=$DOTFILES/bin:$PATH

if [[ -e $HOME/.cljr/bin ]]; then
  export PATH=$HOME/.cljr/bin:$PATH
fi

if [[ -e /usr/local/Cellar/clojure-contrib/1.2.0/clojure-contrib.jar ]]; then
  export CLASSPATH=$CLASSPATH:/usr/local/Cellar/clojure-contrib/1.2.0/clojure-contrib.jar
fi

# Rbenv
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

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
