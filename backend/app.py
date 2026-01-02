# importando configuracoes
from config import app, db
# importando os modelos
from models.cliente import Cliente
from models.estoque import Estoque
from models.ordemServico import OrdemServico
from models.produto import Produto
from models.servico import Servico
from models.tecnico import Tecnico
from models.os_servicos import OSServicos
from models.os_itens import OSItens
from models.categoria import Categoria
from models.anexo import Anexo

# importando blueprints
from routes.client import view_client
from routes.product import view_product
from routes.home import view_home
from routes.technician import view_technician

# registrando blueprints
app.register_blueprint(view_client)
app.register_blueprint(view_product)
app.register_blueprint(view_home)
app.register_blueprint(view_technician)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
    app.run()