#!/bin/zsh
pwd > ~/.dotfiles_location

link() {
  rm -rf $HOME/.$1
  ln -s $(pwd)/$1 $HOME/.$1
}

link2() {
  rm -rf $HOME/$1
  ln -s $(pwd)/$2 $HOME/$1
}

link ackrc
link gitconfig
link gitignore
link ctags
link tmux.conf
link vimrc
link janus
link gemrc
link railsrc
link slate.js
link zlogin
link zlogout
link zpreztorc
link zprofile
link zshenv
link zshrc
link tarsnaprc

link2 .config/ghostty/config ghostty
link2 .config/fish fish

echo "Installed dotfiles!"
