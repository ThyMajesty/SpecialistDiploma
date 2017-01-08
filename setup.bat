pip install -r requirements.txt
python manage.py clean_pyc
python manage.py migrate
python manage.py loaddata initial_data.json
python manage.py shell < neo_test_data.py