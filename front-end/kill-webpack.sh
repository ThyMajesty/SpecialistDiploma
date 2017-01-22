kill $(pgrep webpack)

killall -v webpack

pkill webpack

kill `ps -ef | grep webpack | grep -v grep | awk ‘{print $2}’`