#!/bin/zsh
pwd > ~/.dotfiles_location

link() {
  rm -rf $HOME/.$1
  ln -s $(pwd)/$1 $HOME/.$1
}

link zshrc
link gitconfig
link gitignore
link ctags
link vimrc.before
link vimrc.after
link gvimrc.after
link janus
link gemrc

echo "Installed dotfiles!"
