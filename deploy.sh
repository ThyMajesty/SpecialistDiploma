cd ~/erd

git stash
git pull

chmod 777 *

source /var/virtualenv/erd/bin/activate

pip freeze | xargs pip uninstall -y
pip install -r requirements.txt

export DJANGO_SETTINGS_MODULE=project.prod

./manage.py clean_pyc
./manage.py migrate
./manage.py collectstatic
./manage.py loaddata initial_data.json
./manage.py shell < neo_test_data.py

# https://github.com/nginx/nginx/blob/master/conf/uwsgi_params
uwsgi --ini erd_uwsgi.ini

sudo /etc/init.d/nginx restart
sudo ln -s erd_nginx.conf /etc/nginx/sites-enabled/


sudo service neo4j-service restart
sudo /etc/init.d/postgresql restart

curl -H "Content-Type: application/json" -X POST -d '{"password":"******"}' -u neo4j:neo4j http://localhost:7474/user/neo4j/password

sudo nano /etc/rc.local