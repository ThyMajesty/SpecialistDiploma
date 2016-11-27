pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata initial_data.json
python manage.py clean_pyc
python manage.py runserver 0.0.0.0:80