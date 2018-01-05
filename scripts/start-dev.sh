#!/bin/bash

set -e

if [[ "$TMUX" == "" ]]; then
    echo 'Run this script in tmux window' 2>&1
    exit 1
fi
if [ "$(tmux -list-panes | wc -l)" -gt 1 ]; then
    echo 'Only one pane is allowed in tmux window before running this script' 2>&1
    exit 2
fi

cols="$(tput cols)"
lines="$(tput lines)"

if (( lines * 3 > cols )); then
    tmux split-window -v -c "#{pane_current_path}"
    tmux select-pane -U
    tmux split-window -h -c "#{pane_current_path}"

    tmux send-keys -t 0 'npm run watch-bundle' Enter
    tmux send-keys -t 1 'npm run http-server' Enter
    tmux send-keys -t 2 'npm run watch-ts' Enter
else
    tmux split-window -h -c "#{pane_current_path}"
    tmux split-window -v -c "#{pane_current_path}"

    tmux send-keys -t 0 'npm run watch-ts' Enter
    tmux send-keys -t 1 'npm run watch-bundle' Enter
    tmux send-keys -t 2 'npm run http-server' Enter
fi


# Wait for HTTP server starting
sleep 3

case $OSTYPE in
    darwin*)
        open http://localhost:1234
    ;;
    linux*)
        xdg-open http://localhost:1234
    ;;
    *)
        # Do nothing
    ;;
esac
