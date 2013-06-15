#!/bin/zsh
pwd > ~/.dotfiles_location

link() {
  rm -rf $HOME/.$1
  ln -s $(pwd)/$1 $HOME/.$1
}

link ackrc
link gitconfig
link gitignore
link ctags
link tmux.conf
link vimrc.before
link vimrc.after
link janus
link gemrc
link slate.js
link zlogin
link zlogout
link zpreztorc
link zprofile
link zshenv
link zshrc

echo "Installed dotfiles!"
