#!/bin/sh
#!/bin/bash

echo "[DB] Running DB update..."
python manage.py makemigrations --settings=coffProject.settings.local
python manage.py migrate --settings=coffProject.settings.local
python manage.py loaddata data.json --settings=coffProject.settings.local

echo "[Test] Running Test code..."
python manage.py test --settings=coffProject.settings.local

echo "[DB] Apply changes to Service DB..."
python manage.py makemigrations --settings=coffProject.settings.prod
python manage.py migrate --settings=coffProject.settings.prod
python manage.py loaddata data.json --settings=coffProject.settings.prod
