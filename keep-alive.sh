#!/bin/bash
# Keep-alive: restart next dev if it exits, so the preview stays up.
cd /home/z/my-project
while true; do
  ./node_modules/.bin/next dev -p 3000 > dev.log 2>&1
  echo "[keep-alive] next dev exited at $(date '+%H:%M:%S'); restarting in 2s" >> dev.log
  sleep 2
done
