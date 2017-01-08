import json
import requests
import time

response = requests.post('http://localhost:8000/api/token-auth/', data=json.dumps({'username':'admin','password':'rootpass'}))
token = 'jwt ' + response.json()['token']
print token

headers = {'Authorzation': token}
response = requests.get('http://localhost:8000/api/me/', headers=headers)
print 'before',response.text

response = requests.post('http://localhost:8000/api/me/', headers=headers, data=json.dumps({'value':{'name':'kotic'}}))
print 'after',response.text

for i in range(20):
    for j in range(10):
        time.sleep(3)
    print 'try', i
    response = requests.get('http://localhost:8000/api/me/', headers=headers)
    print 'check',response.text
