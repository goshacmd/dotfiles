# Setting vars
export EDITOR="mvim -f"
export VISUAL=$EDITOR
export PROJECTSDIR=$HOME/Projects
export CODEDIR=$PROJECTSDIR

if [[ -e $HOME/.dotfiles_location ]]; then
  export DOTFILES=$(cat $HOME/.dotfiles_location)
else
  export DOTFILES=$CODEDIR/dotfiles
  echo "~/.dotfiles_location not found, reinstall dotfiles"
fi

# Aliases
alias b="bundle"
alias be="bundle exec"
alias ci="git commit -m"
alias g="git"
alias gi="gem install"
alias r="rails"
alias vi="vim"
alias e="vim"

ZSH=$HOME/.oh-my-zsh
ZSH_THEME="sammy"

# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Comment this out to disable weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

plugins=(git brew bundler gem github osx pow powder rails3 ruby heroku rbenv)

source $ZSH/oh-my-zsh.sh

# Disable fucking autocorrect
unsetopt correct_all

update_terminal_cwd() {
  printf '\e]7;%s\a' "file://$HOST$(pwd | sed -e 's/ /%20/g')"
}

precmd() {
  update_terminal_cwd
  return 0;
}

export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/X11/bin

# Rbenv
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"


if [[ -e $HOME/.zshrc.local ]]; then
  source $HOME/.zshrc.local
fi
