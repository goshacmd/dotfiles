#
# Executes commands at login pre-zshrc.
#
# Authors:
#   Sorin Ionescu <sorin.ionescu@gmail.com>
#

# eval `/usr/libexec/path_helper -s`
PATH=$PATH:/opt/X11/bin
PATH=$PATH:/usr/local/MacGPG2/bin
PATH=$PATH:/usr/texbin
# PATH=$PATH:$HOME/.cabal/bin
PATH=/usr/local/opt/llvm/bin:$PATH


##
# Your previous /Users/goshacmd/.zprofile file was backed up as /Users/goshacmd/.zprofile.macports-saved_2023-07-28_at_14:44:11
##

# MacPorts Installer addition on 2023-07-28_at_14:44:11: adding an appropriate PATH variable for use with MacPorts.
export PATH="/opt/local/bin:/opt/local/sbin:$PATH"
# Finished adapting your PATH environment variable for use with MacPorts.


# Added by OrbStack: command-line tools and integration
source ~/.orbstack/shell/init.zsh 2>/dev/null || :
