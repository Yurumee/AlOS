# realizando importações necessárias
from config import db
from flask import Blueprint, jsonify

# criando uma blueprint
view_client = Blueprint('view_client', __name__, url_prefix='/cliente')

@view_client.route('/', methods=['GET'])
def all_clients():
    return jsonify({
                    'message':'ok',
                    'status':'200'
                    })