from backend import create_app
from backend.insert_sup import __insert_sup
from backend.db import db

# from backend import create_app
# from .backend.config import config_dict

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        __insert_sup()
        app.run()