# importando configuracoes
from config import app, db
# importando os modelos
from models.os_estoque import Os_estoque
from models.os_servico import Os_servico

from models.cliente import Cliente
from models.estoque import Estoque
from models.ordemServico import OrdemServico
from models.produto import Produto
from models.servico import Servico
from models.tecnico import Tecnico
from models.categoria import Categoria
from models.anexo import Anexo

# importando blueprints
from routes.client import view_client
from routes.product import view_product
from routes.home import view_home
from routes.technician import view_technician
from routes.storage import view_storage
from routes.category import view_category
from routes.service import view_service
from routes.os import view_os
from routes.attachment import view_attachment

# registrando blueprints
app.register_blueprint(view_client)
app.register_blueprint(view_product)
app.register_blueprint(view_home)
app.register_blueprint(view_technician)
app.register_blueprint(view_storage)
app.register_blueprint(view_category)
app.register_blueprint(view_service)
app.register_blueprint(view_os)
app.register_blueprint(view_attachment)

if __name__ == '__main__':
    with app.app_context():
        from insert_sup import __insert_sup

        db.create_all()
        __insert_sup()

        
    app.run()