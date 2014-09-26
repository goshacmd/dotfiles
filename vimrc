set nocompatible
filetype off

set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

" # Bundles

" Vundle for Vundle
Bundle 'gmarik/vundle'

" Custom bundles
Bundle 'mileszs/ack.vim'
Bundle 'kien/ctrlp.vim'
Bundle 'scrooloose/nerdtree'
Bundle 'scrooloose/nerdcommenter'
Bundle 'scrooloose/syntastic'
Bundle 'tpope/vim-fugitive'
Bundle 'bronson/vim-trailing-whitespace'
Bundle 'tpope/vim-fireplace'
Bundle 'tpope/vim-tbone'
Bundle 'tpope/vim-endwise'
"Bundle 'Valloric/YouCompleteMe'
Bundle 'mbbill/undotree'
Bundle 'sheerun/vim-polyglot'

" Visuals
Bundle 'chriskempson/base16-vim'
Bundle 'bling/vim-airline'

filetype plugin indent on

let mapleader=","
let maplocalleader="\\"

let base16colorspace=256
let g:airline_theme = 'simple'
let g:airline_powerline_fonts = 1

" # Settings

set background=dark
colorscheme base16-default

set nocompatible
set number
set ruler
syntax enable
set encoding=utf-8

set nowrap
set tabstop=2
set shiftwidth=2
set expandtab
set list
set backspace=indent,eol,start

set listchars=""
set listchars=tab:\ \
set listchars+=trail:.
set listchars+=extends:>
set listchars+=precedes:<

set hlsearch
set incsearch
set ignorecase
set smartcase

set wildignore+=*.o,*.out,*.obj,.git,*.rbc,*.rbo,*.class,.svn,*.gem
set wildignore+=*.zip,*.tar.gz,*.tar.bz2,*.rar,*.tar.xz
set wildignore+=*/vendor/gems/*,*/vendor/cache/*,*/.bundle/*,*/.sass-cache/*
set wildignore+=*/tmp/librarian/*,*/.vagrant/*,*/.kitchen/*,*/vendor/cookbooks/*
set wildignore+=*/tmp/cache/assets/*/sprockets/*,*/tmp/cache/assets/*/sass/*
set wildignore+=*.swp,*~,._*

set noswapfile backup
set backupdir^=~/.vim/_backup//

set history=5000
set mouse=a

set autoread
set laststatus=2

" Automatic formatting
autocmd BufWritePre *.rb :%s/\s\+$//e
autocmd BufWritePre *.html :%s/\s\+$//e
au BufNewFile * set noeol
au BufNewFile,BufRead *.es6 set filetype=javascript

" Don't show the command
autocmd VimEnter * set nosc

" # Mappings

" Buffer fast save
nmap <leader>w :w!<cr>

" Tab management
map <leader>tn :tabnew<cr>
map <leader>to :tabonly<cr>
map <leader>tc :tabclose<cr>
map <leader>tm :tabmove

" New tab with current buffer's file
map <leader>te :tabedit <c-r>=expand("%:p:h")<cr>/

" Yank & paste via OS X clipboard
map <leader>p "*p
map <leader>y "*y

" Move around splits with <c-hjkl>
nnoremap <c-j> <c-w>j
nnoremap <c-k> <c-w>k
nnoremap <c-h> <c-w>h
nnoremap <c-l> <c-w>l

" Resizing splits
nnoremap <silent> <leader>+ :exe "resize " . (winheight(0) * 3/2)<cr>
nnoremap <silent> <leader>- :exe "resize " . (winheight(0) * 2/3)<cr>
nnoremap <silent> <leader>> :exe "vertical resize " . (winwidth(0) * 2/3)<cr>
nnoremap <silent> <leader>< :exe "vertical resize " . (winwidth(0) * 3/2)<cr>

" No arrow keys
map <left> <nop>
map <right> <nop>
map <up> <nop>
map <down> <nop>

" Format the entire file
nmap <leader>fef ggVG=

" # Plugin customizations

" NERDTree
let NERDTreeHijackNetrw = 0

autocmd vimenter * if !argc() | NERDTree | endif
map <leader>n :NERDTreeToggle<cr> :NERDTreeMirror<cr>

augroup AuNERDTreeCmd
autocmd AuNERDTreeCmd VimEnter * call s:CdIfDirectory(expand("<amatch>"))
autocmd AuNERDTreeCmd FocusGained * call s:UpdateNERDTree()

" If the parameter is a directory, cd into it
function s:CdIfDirectory(directory)
  let explicitDirectory = isdirectory(a:directory)
  let directory = explicitDirectory || empty(a:directory)

  if explicitDirectory
    exe "cd " . fnameescape(a:directory)
  endif

  " Allows reading from stdin
  " ex: git diff | mvim -R -
  if strlen(a:directory) == 0
    return
  endif

  if directory
    NERDTree
    wincmd p
    bd
  endif

  if explicitDirectory
    wincmd p
  endif
endfunction

" NERDTree utility function
function s:UpdateNERDTree(...)
  let stay = 0

  if(exists("a:1"))
    let stay = a:1
  end

  if exists("t:NERDTreeBufName")
    let nr = bufwinnr(t:NERDTreeBufName)
    if nr != -1
      exe nr . "wincmd w"
      exe substitute(mapcheck("R"), "<CR>", "", "")
      if !stay
        wincmd p
      end
    endif
  endif
endfunction

" NERDCommenter
map <leader>/ :call NERDComment(0, "toggle")<cr>
