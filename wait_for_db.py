import os
import time
from django.db import connections
from django.db.utils import OperationalError


print('Waiting for database...')
db_conn = None
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
while not db_conn:
    try:
        db_conn = connections['default']
    except OperationalError:
        print('Database unavailable, waiting 1 second...')
        time.sleep(1)

print('Database available!')