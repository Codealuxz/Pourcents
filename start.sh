#!/bin/sh
set -e

# Lance le WS server en background
cd /app/server
node index.js &
NODE_PID=$!
cd /

# Si node meurt, tuer nginx aussi
trap "kill $NODE_PID 2>/dev/null; exit 0" TERM INT

# Lance nginx en foreground
nginx -g "daemon off;"
