if status is-interactive
    # Commands to run in interactive sessions can go here
    fish_config theme choose Dracula
end

function fish_prompt
    set -l last_status $status
    set -l stat
    if test $last_status -ne 0
        set stat (set_color red)"[$last_status]"(set_color normal)
    end

    string join '' -- (set_color purple) (prompt_pwd) (set_color normal) $stat '$ '
end

set __fish_git_prompt_showdirtystate true
set __fish_git_prompt_showuntrackedfiles true
set __fish_git_prompt_showstashstate true
set __fish_git_prompt_showupstream true
set __fish_git_prompt_showcolorhints true
set __fish_git_prompt_show_informative_status true
set __fish_git_prompt_color grey
set __fish_git_prompt_color_branch yellow
set __fish_git_prompt_color_upstream_ahead green
set __fish_git_prompt_color_upstream_behind red
set __fish_git_prompt_char_dirtystate '✚'
set __fish_git_prompt_char_invalidstate '✖'
set __fish_git_prompt_char_stagedstate '●'
set __fish_git_prompt_char_stashstate '⚑'
function fish_right_prompt
    string join '' -- (fish_git_prompt)
end

set -U fish_greeting

fish_add_path -a -P /opt/X11/bin
fish_add_path -a -P /usr/local/MacGPG2/bin
fish_add_path -a -P /usr/texbin
fish_add_path -p -P /opt/local/bin /opt/local/sbin
source ~/.orbstack/shell/init.fish
fish_add_path -p -P ~/Projects/dotfiles/bin
fish_add_path -a -P '/Applications/Visual Studio Code.app/Contents/Resources/app/bin'
fish_add_path -a -P ~/.cargo/bin

if test (uname) = Darwin
    set -gx BROWSER open
end

set -gx EDITOR 'vim -f'
set -gx VISUAL 'vim -f'
set -gx PAGER less
set -gx LESS '-F -g -i -M -R -S -w -X -z-4'

set -gx SSH_AUTH_SOCK ~/Library/Group\ Containers/2BUA8C4S2C.com.1password/t/agent.sock

eval "$(/opt/homebrew/bin/brew shellenv)"
eval "$(rbenv init - fish)"

if test -d (brew --prefix)"/share/fish/completions"
    set -p fish_complete_path (brew --prefix)/share/fish/completions
end

if test -d (brew --prefix)"/share/fish/vendor_completions.d"
    set -p fish_complete_path (brew --prefix)/share/fish/vendor_completions.d
end

fish_add_path -p -P (brew --prefix openssl@3)"/bin"
fish_add_path -p -P (brew --prefix node@22)"/bin"

set -gx LDFLAGS "-L"(brew --prefix node@22)"/lib"
set -gx CPPFLAGS "-I"(brew --prefix node@22)"/include"
set -gx PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
set -gx PUPPETEER_EXECUTABLE_PATH `which chromium`
set -gx LIBRARY_PATH $LIBRARY_PATH (brew --prefix openssl)"/lib/"

fish_add_path -p -P "$HOME/.yarn/bin" "$HOME/.config/yarn/global/node_modules/.bin"
fish_add_path -a -P /opt/homebrew/opt/llvm/bin
fish_add_path -a -P "/opt/homebrew/opt/dart@2.19/bin"

jj util completion fish | source

set -gx PNPM_HOME /Users/goshacmd/Library/pnpm
fish_add_path -p -P $PNPM_HOME
