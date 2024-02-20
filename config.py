import os

MONGO_DBNAME = 'demo2'

MONGO_URL = os.get('MONGO_URL')
if not MONGO_URL:
    MONGO_URL = 'mongodb+srv://grupoDinamita:GrupoDinamita3@lab03.sutnr1c.mongodb.net/demo2'

MONGO_URI = MONGO_URL