import unittest
from .. import create_app
from ..config import config_dict
from ..db import db
from flask_jwt_extended import create_access_token
from ..insert_sup import insert_sup


class TestClient(unittest.TestCase):
    def setUp(self):
        self.mock_cli_1 = {
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
        
        self.mock_cli_2 = {
                        'cpf_cnpj_cliente': '12345678900004',
                        'flag_cnpj': True,
                        'nome_cliente':'cliente 02',
                        'empresa_cliente':'Empresa de Tecnologia',
                        'endereco_cliente': 'Rua Bem Bonita, n 789',
                        'bairro_cliente': 'Centro',
                        'cidade_cliente': 'Campos Neutrais',
                        'cep_cliente': '12345000',
                        'telefone_cliente': '915935748',
                        'limite_credito': '1200.00',
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

    def test_client_new(self):
        '''
        DADO um CLIENTE
        QUANDO cadastrado
        TESTE SE os dados são inseridos corretamente
        '''

        response_1 = self.client.post('/cliente/novo', json=self.mock_cli_1, headers=self.headers)
        response_2 = self.client.post('/cliente/novo', json=self.mock_cli_2, headers=self.headers)
        
        assert response_1.status_code == 201
        assert response_2.status_code == 201

    def test_client_edit(self):
        '''
        DADO um CLIENTE
        QUANDO editado
        TESTE SE os dados são modificados corretamente
        '''
        from ..models.cliente import Cliente
        
        data_edit_cpf = {
            'nome_cliente': 'Fulano da Silva',
            'endereco_cliente': 'Rua Nova, n° 741',
            'bairro_cliente': 'Bairro Velho',
            'cidade_cliente': 'Atlântida',
            'cep_cliente': '12378009',
            'telefone_cliente': '940028922',
            'limite_credito': 499.99,
        }

        data_edit_cnpj = {
            'nome_cliente': 'Beltrano da Silva',
            'empresa_cliente': 'Pear Inc.',
            'endereco_cliente': 'Rua do Comércio, n° 852',
            'bairro_cliente': 'Bairro Grande',
            'cidade_cliente': 'Camelot',
            'cep_cliente': '78956001',
            'telefone_cliente': '968457101',
            'limite_credito': 1999.89,
        }

        # inserindo cliente
        self.client.post('/cliente/novo', json=self.mock_cli_1, headers=self.headers)
        self.client.post('/cliente/novo', json=self.mock_cli_2, headers=self.headers)
        
        # editando
        response_1 = self.client.post('/cliente/editar/1', json=data_edit_cpf, headers=self.headers)
        response_2 = self.client.post('/cliente/editar/2', json=data_edit_cnpj, headers=self.headers)
        
        assert response_1.status_code == 200
        assert response_2.status_code == 200
        
        # checando
        client_1 = db.session.query(Cliente).filter_by(cliente_id=1).one_or_none()
        client_2 = db.session.query(Cliente).filter_by(cliente_id=2).one_or_none()
        
        assert client_1.nome_completo == data_edit_cpf['nome_cliente']
        assert client_1.endereco == data_edit_cpf['endereco_cliente']
        assert client_1.bairro == data_edit_cpf['bairro_cliente']
        assert client_1.cidade == data_edit_cpf['cidade_cliente']
        assert client_1.cep == data_edit_cpf['cep_cliente']
        assert client_1.telefone == data_edit_cpf['telefone_cliente']
        assert float(client_1.limite_credito) == data_edit_cpf['limite_credito']
        
        assert client_2.nome_completo == data_edit_cnpj['nome_cliente']
        assert client_2.nome_fantasia == data_edit_cnpj['empresa_cliente']
        assert client_2.endereco == data_edit_cnpj['endereco_cliente']
        assert client_2.bairro == data_edit_cnpj['bairro_cliente']
        assert client_2.cidade == data_edit_cnpj['cidade_cliente']
        assert client_2.cep == data_edit_cnpj['cep_cliente']
        assert client_2.telefone == data_edit_cnpj['telefone_cliente']
        assert float(client_2.limite_credito) == data_edit_cnpj['limite_credito']
        
    def test_client_delete(self):
        '''
        DADO um CLIENTE EXISTENTE
        QUANDO deletado
        TESTE SE os dados são excluídos corretamente
        '''

        # inserindo
        self.client.post('/cliente/novo', json=self.mock_cli_1, headers=self.headers)

        # excluindo
        response = self.client.post('/cliente/excluir/1', headers=self.headers)
        
        assert response.status_code == 200

    def test_client_search(self):
        '''
        DADO um CLIENTE EXISTENTE
        QUANDO pesquisado
        TESTE SE os dados são retornados corretamente
        '''

        # inserindo
        # self.client.post('/cliente/novo', json=self.mock_cli_1, headers=self.headers)
        self.client.post('/cliente/novo', json=self.mock_cli_2, headers=self.headers)

        # pesquisando
        response = self.client.get('/cliente/pesquisar/1', headers=self.headers)
        data = response.json

        assert response.status_code == 302
        assert data == {
                        '1': {
                            'id':1,
                            'cpf_cnpj': '12345678900004',
                            'nome_completo': 'cliente 02',
                            'nome_fantasia': 'Empresa de Tecnologia',
                            'endereco': 'Rua Bem Bonita, n 789',
                            'bairro': 'Centro',
                            'cidade': 'Campos Neutrais',
                            'cep': '12345000',
                            'telefone': '915935748',
                            'limite_credito': '1200.00',
                            'pessoa_juridica': True
                        }
                       }
    
    def test_client_all(self):
        '''
        DADO um CLIENTE
        QUANDO pesquisado
        TESTE SE todos os clientes são retornados corretamente
        '''

        # inserindo
        self.client.post('/cliente/novo', json=self.mock_cli_1, headers=self.headers)
        self.client.post('/cliente/novo', json=self.mock_cli_2, headers=self.headers)

        response = self.client.get('/cliente/', headers=self.headers)
        data = response.json

        assert response.status_code == 200
        assert data == {
                        '1': {
                            'id':1,
                            'cpf_cnpj': '12345678903',
                            'nome_completo': 'cliente 01',
                            'nome_fantasia': '',
                            'endereco': 'Rua Formosa, n 456',
                            'bairro': 'Centro',
                            'cidade': 'Campos Neutrais',
                            'cep': '12345000',
                            'telefone': '9123789465',
                            'limite_credito': '300.50',
                            'pessoa_juridica': False
                        },
                        
                        '2': {
                            'id':2,
                            'cpf_cnpj': '12345678900004',
                            'nome_completo': 'cliente 02',
                            'nome_fantasia': 'Empresa de Tecnologia',
                            'endereco': 'Rua Bem Bonita, n 789',
                            'bairro': 'Centro',
                            'cidade': 'Campos Neutrais',
                            'cep': '12345000',
                            'telefone': '915935748',
                            'limite_credito': '1200.00',
                            'pessoa_juridica': True
                        }
                       }