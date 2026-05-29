import unittest
from .. import create_app
from ..config import config_dict
from ..db import db
from flask_jwt_extended import create_access_token
from ..insert_sup import insert_sup


class TestService(unittest.TestCase):
    def setUp(self):
        self.mock_serv_1 = {
                        'nome_servico': 'Formatação Simples',
                        'categoria_servico': 1,
                        'descricao_servico':'Formatação sem chaves de ativação',
                        'custo_servico': '60.00',
                    }
        
        self.mock_serv_2 = {
                        'nome_servico': 'Pacote Office',
                        'categoria_servico': 2,
                        'descricao_servico':'Compra de chave e instalação do pacote Office',
                        'custo_servico': '80.00',
                    }
        
        self.mock_cat_1 = {
                        'nome_categoria': 'Formatação',
                        'tipo_categoria': 'Servico',
                        'descricao_categoria':'Formatações de computadores',
                    }

        self.mock_cat_2 = {
                        'nome_categoria': 'Compra de chaves',
                        'tipo_categoria': 'Geral',
                        'descricao_categoria':'Chaves de ativação',
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

    def test_service_new(self):
        '''
        DADO um SERVICO
        QUANDO cadastrado
        TESTE SE os dados são inseridos corretamente
        '''

        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        response_1 = self.client.post('/servico/novo', json=self.mock_serv_1, headers=self.headers)
        
        assert response_1.status_code == 201

    def test_service_edit(self):
        '''
        DADO um SERVICO
        QUANDO editado
        TESTE SE os dados são modificados corretamente
        '''
        from ..models.servico import Servico
        
        data_edit = {
                        'nome_servico': 'Formatação Completa',
                        'categoria_servico': 2,
                        'descricao_servico':'Formatação com compra de chaves de ativação',
                        'valor_servico': '100.00',
                    }

        # inserindo cliente e produto
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        self.client.post('/servico/novo', json=self.mock_serv_1, headers=self.headers)
        
        # editando
        response_1 = self.client.post('/servico/editar/1', json=data_edit, headers=self.headers)
        
        assert response_1.status_code == 200
        
        # checando
        servico = db.session.query(Servico).filter_by(servico_id=1).one_or_none()
        
        assert servico.nome_servico == data_edit['nome_servico']
        assert servico.descricao_servico == data_edit['descricao_servico']
        assert float(servico.custo) == float(data_edit['valor_servico'])
        assert servico.categoria_id == data_edit['categoria_servico']
        
        
    def test_service_delete(self):
        '''
        DADO um SERVICO EXISTENTE
        QUANDO deletado
        TESTE SE os dados são excluídos corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/servico/novo', json=self.mock_serv_1, headers=self.headers)

        # excluindo
        response = self.client.post('/servico/excluir/1', headers=self.headers)
        
        assert response.status_code == 200

    def test_service_search(self):
        '''
        DADO um SERVICO EXISTENTE
        QUANDO pesquisado
        TESTE SE os dados são retornados corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/servico/novo', json=self.mock_serv_1, headers=self.headers)

        # pesquisando
        response = self.client.get('/servico/pesquisar/1', headers=self.headers)
        data = response.json

        assert response.status_code == 302
        assert data == {
                        'id': 1,
                        'nome_servico': 'Formatação Simples',
                        'descricao':'Formatação sem chaves de ativação',
                        'valor': '60.00',
                        'categoria': 1,
                    }
    
    def test_service_search_category(self):
        '''
        DADO um SERVICO EXISTENTE
        QUANDO pesquisado
        TESTE SE os dados são retornados corretamente de acordo com a categoria desejada
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        self.client.post('/servico/novo', json=self.mock_serv_1, headers=self.headers)
        self.client.post('/servico/novo', json=self.mock_serv_2, headers=self.headers)

        # pesquisando
        response = self.client.get('/servico/busca/2', headers=self.headers)
        data = response.json

        assert response.status_code == 302
        assert data == {
                        '2': {
                                'id_servico': 2,
                                'categoria': 2,
                                'nome_servico': 'Pacote Office',
                                'descricao':'Compra de chave e instalação do pacote Office',
                                'custo': '80.00',
                                'tipo': 'servico'
                            } 
                    } 
    

    def test_service_all(self):
        '''
        DADO um SERVICO
        QUANDO pesquisado
        TESTE SE todos os servicos são retornados corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        self.client.post('/servico/novo', json=self.mock_serv_1, headers=self.headers)
        self.client.post('/servico/novo', json=self.mock_serv_2, headers=self.headers)

        response = self.client.get('/servico/', headers=self.headers)
        data = response.json

        assert response.status_code == 200
        assert data == {
                        '1': {
                                'id': 1,
                                'categoria': 'Formatação',
                                'nome_servico': 'Formatação Simples',
                                'descricao':'Formatação sem chaves de ativação',
                                'valor': '60.00',
                            },

                        '2': {
                                'id': 2,
                                'categoria': 'Compra de chaves',
                                'nome_servico': 'Pacote Office',
                                'descricao':'Compra de chave e instalação do pacote Office',
                                'valor': '80.00',
                            }
                       }