import unittest
from .. import create_app
from ..config import config_dict
from ..db import db
from flask_jwt_extended import create_access_token
from ..insert_sup import insert_sup


class TestCategory(unittest.TestCase):
    def setUp(self):
        self.mock_cat_1 = {
                        'nome_categoria': 'Formatacao',
                        'tipo_categoria': 'Servico',
                        'descricao_categoria':'Formatações em geral',
                    }
        
        self.mock_cat_2 = {
                        'nome_categoria': 'SSD',
                        'tipo_categoria': 'Estoque',
                        'descricao_categoria':'SSDs de tamanhos variados',
                    }
        
        self.mock_cat_3 = {
                        'nome_categoria': 'Sucatas',
                        'tipo_categoria': 'Geral',
                        'descricao_categoria':'Partes de placas em geral',
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

    def test_category_new(self):
        '''
        DADA uma CATEGORIA
        QUANDO cadastrada
        TESTE SE os dados são inseridos corretamente
        '''

        response_1 = self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        response_2 = self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        response_3 = self.client.post('/categoria/novo', json=self.mock_cat_3, headers=self.headers)
        
        assert response_1.status_code == 201
        assert response_2.status_code == 201
        assert response_3.status_code == 201

    def test_category_edit(self):
        '''
        DADA uma CATEGORIA
        QUANDO editada
        TESTE SE os dados são modificados corretamente
        '''
        from ..models.categoria import Categoria
        
        data_edit = {
                        'nome_categoria': 'SSDs',
                        'tipo_categoria': 'Geral',
                        'descricao_categoria':'SSDs em tamanhos variados'
                    }

        # inserindo cliente e produto
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        
        # editando
        response_1 = self.client.post('/categoria/editar/1', json=data_edit, headers=self.headers)
        
        assert response_1.status_code == 200
        
        # checando
        category = db.session.query(Categoria).filter_by(categoria_id=1).one_or_none()
        
        assert category.titulo == data_edit['nome_categoria']
        assert category.tipo == data_edit['tipo_categoria']
        assert category.descricao == data_edit['descricao_categoria']

        
    def test_category_delete(self):
        '''
        DADA uma CATEGORIA EXISTENTE
        QUANDO deletada
        TESTE SE os dados são excluídos corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        # self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)

        # excluindo
        response = self.client.post('/categoria/excluir/1', headers=self.headers)
        
        assert response.status_code == 200

    def test_category_search(self):
        '''
        DADA uma CATEGORIA EXISTENTE
        QUANDO pesquisada
        TESTE SE os dados são retornados corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_3, headers=self.headers)

        # pesquisando
        response = self.client.get('/categoria/pesquisar/1', headers=self.headers)
        data = response.json

        assert response.status_code == 302
        assert data == {
                        'id':1,
                        'titulo': 'Formatacao',
                        'tipo': 'Servico',
                        'descricao':'Formatações em geral',
                    }
    
    def test_category_all(self):
        '''
        DADA uma CATEGORIA
        QUANDO pesquisada
        TESTE SE todas as categorias são retornados corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_3, headers=self.headers)

        response = self.client.get('/categoria/', headers=self.headers)
        data = response.json

        assert response.status_code == 200
        assert data == {
                        '1': {
                                'id':1,
                                'titulo': 'Formatacao',
                                'tipo': 'Servico',
                                'descricao':'Formatações em geral',
                            },
                        
                        '2': {
                                'id':2,
                                'titulo': 'SSD',
                                'tipo': 'Estoque',
                                'descricao':'SSDs de tamanhos variados',
                            },

                        '3': {
                                'id':3,
                                'titulo': 'Sucatas',
                                'tipo': 'Geral',
                                'descricao':'Partes de placas em geral',
                            }
                       }
        
    def test_category_search_by_type(self):
        '''
        DADA uma CATEGORIA
        QUANDO pesquisada pelo tipo
        TESTE SE todos os dados são retornados corretamente
        '''

        # inserindo
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_3, headers=self.headers)

        response_1 = self.client.get('/categoria/busca/servico', headers=self.headers)
        response_2 = self.client.get('/categoria/busca/estoque', headers=self.headers)
        response_3 = self.client.get('/categoria/busca/geral', headers=self.headers)

        data_1 = response_1.json
        data_2 = response_2.json
        data_3 = response_3.json

        assert response_1.status_code == 200
        assert response_2.status_code == 200
        assert response_3.status_code == 200

        assert data_1 == {
                        '1': {
                                'id':1,
                                'titulo': 'Formatacao',
                            }
                       }
        
        assert data_2 == {
                        '2': {
                                'id':2,
                                'titulo': 'SSD',
                            },
                       }
        
        assert data_3 == {
                        '3': {
                                'id':3,
                                'titulo': 'Sucatas',
                            }
                       }