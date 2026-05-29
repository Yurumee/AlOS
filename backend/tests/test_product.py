import unittest
from .. import create_app
from ..config import config_dict
from ..db import db
from flask_jwt_extended import create_access_token
from ..insert_sup import insert_sup


class TestProduct(unittest.TestCase):
    def setUp(self):
        self.mock_cli = {
                        'cpf_cnpj_cliente': '12345678903',
                        'flag_cnpj': False,
                        'nome_cliente':'cliente 01',
                        'empresa_cliente':'',
                        'endereco_cliente': 'Rua Formosa, n 456',
                        'bairro_cliente': 'Centro',
                        'cidade_cliente': 'Campos Neutrais',
                        'cep_cliente': '12345000',
                        'telefone_cliente': '9123789465',
                        'limite_credito': '300.50',
                    }
        
        self.mock_prod = {
                        'cliente_id': 1,
                        'modelo': 'M0D3L0',
                        'num_serie':'A1B2C3',
                        'cor':'Cinza',
                        'sis_operacional': 'Windows 10',
                        'avaria': True,
                        'liga': True,
                        'carrega': False,
                        'backup': True,
                        'acessorios': 'Bolsa azul listrada e carregador',
                        'obs': 'Dobradiça esquerda quebrada',
                    }


        self.app = create_app(config=config_dict['test'])
        
        self.appContext = self.app.app_context()

        self.appContext.push()

        self.client = self.app.test_client()
 
        db.create_all()
        insert_sup()

        self.access_token = create_access_token(identity='1')
        self.headers = {
                    "Authorization": f"Bearer {self.access_token}"
                  }

    def tearDown(self):
        db.drop_all()

        self.appContext.pop()

        self.app = None

        self.client = None

    def test_product_new(self):
        '''
        DADO um PRODUTO
        QUANDO cadastrado
        TESTE SE os dados são inseridos corretamente
        '''

        self.client.post('/cliente/novo', json=self.mock_cli, headers=self.headers)
        response_1 = self.client.post('/produto/novo', json=self.mock_prod, headers=self.headers)
        
        assert response_1.status_code == 201

    def test_product_edit(self):
        '''
        DADO um PRODUTO
        QUANDO editado
        TESTE SE os dados são modificados corretamente
        '''
        from ..models.produto import Produto
        
        data_edit = {
            'modelo_dispositivo': 'M0D3L0N0T3B00K',
            'cor_dispositivo':'Azul',
            'sistema_dispositivo': 'Windows 11',
            'avaria': True,
            'liga': True,
            'carrega': False,
            'backup_dispositivo': False,
            'acessorio_dispositivo': 'Bolsa verde listrada e carregador',
            'obs_dispositivo': 'Dobradiça direita quebrada',
        }

        # inserindo cliente e produto
        self.client.post('/cliente/novo', json=self.mock_cli, headers=self.headers)
        self.client.post('/produto/novo', json=self.mock_prod, headers=self.headers)
        
        # editando
        response_1 = self.client.post('/produto/editar/1', json=data_edit, headers=self.headers)
        
        assert response_1.status_code == 200
        
        # checando
        product = db.session.query(Produto).filter_by(produto_id=1).one_or_none()
        
        assert product.modelo == data_edit['modelo_dispositivo']
        assert product.cor == data_edit['cor_dispositivo']
        assert product.sis_operacional == data_edit['sistema_dispositivo']
        assert product.avaria == data_edit['avaria']
        assert product.liga == data_edit['liga']
        assert product.carrega == data_edit['carrega']
        assert product.backup == data_edit['backup_dispositivo']
        assert product.acessorios == data_edit['acessorio_dispositivo']
        assert product.observacoes == data_edit['obs_dispositivo']
        
        
    def test_product_delete(self):
        '''
        DADO um PRODUTO EXISTENTE
        QUANDO deletado
        TESTE SE os dados são excluídos corretamente
        '''

        # inserindo
        self.client.post('/cliente/novo', json=self.mock_cli, headers=self.headers)
        self.client.post('/produto/novo', json=self.mock_prod, headers=self.headers)

        # excluindo
        response = self.client.post('/produto/excluir/1', headers=self.headers)
        
        assert response.status_code == 200

    def test_product_search(self):
        '''
        DADO um PRODUTO EXISTENTE
        QUANDO pesquisado
        TESTE SE os dados são retornados corretamente
        '''

        # inserindo
        self.client.post('/cliente/novo', json=self.mock_cli, headers=self.headers)
        self.client.post('/produto/novo', json=self.mock_prod, headers=self.headers)

        # pesquisando
        response = self.client.get('/produto/pesquisar/1', headers=self.headers)
        data = response.json

        assert response.status_code == 302
        assert data == {
                        'id':1,
                        'cliente_nome': 'cliente 01',
                        'modelo': 'M0D3L0',
                        'num_serie':'A1B2C3',
                        'cor':'Cinza',
                        'sis_operacional': 'Windows 10',
                        'avaria': True,
                        'liga': True,
                        'carrega': False,
                        'backup': True,
                        'acessorios': 'Bolsa azul listrada e carregador',
                        'obs': 'Dobradiça esquerda quebrada',
                    }
    
    def test_product_all(self):
        '''
        DADO um PRODUTO
        QUANDO pesquisado
        TESTE SE todos os produtos são retornados corretamente
        '''

        # inserindo
        self.client.post('/cliente/novo', json=self.mock_cli, headers=self.headers)
        self.client.post('/produto/novo', json=self.mock_prod, headers=self.headers)

        response = self.client.get('/produto/', headers=self.headers)
        data = response.json

        assert response.status_code == 200
        assert data == {
                        '1': {
                            'id':1,
                            'cliente_nome': 'cliente 01',
                            'modelo': 'M0D3L0',
                            'num_serie':'A1B2C3',
                            'cor':'Cinza',
                            'sis_operacional': 'Windows 10',
                            'avaria': 'Sim',
                            'liga': 'Sim',
                            'carrega': 'Não',
                            'backup': 'Sim',
                            'acessorios': 'Bolsa azul listrada e carregador',
                            'obs': 'Dobradiça esquerda quebrada',
                        }
                       }