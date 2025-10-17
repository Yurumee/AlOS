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


 
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run()