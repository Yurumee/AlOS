from flask import Blueprint

# criando blueprint home
view_home = Blueprint('view_home', __name__, url_prefix='/')

# criando rota home
@view_home.route('/', methods=['GET'])
def home():
    return 'tela principal da aplicacao'

