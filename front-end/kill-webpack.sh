kill $(pgrep irssi)

killall -v irssi

pkill irssi

kill `ps -ef | grep irssi | grep -v grep | awk ‘{print $2}’`