import unittest
from .. import create_app
from ..config import config_dict
from ..db import db
from flask_jwt_extended import create_access_token
from ..insert_sup import insert_sup
import locale
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

class TestAttachment(unittest.TestCase):
    def setUp(self):
        self.mock_user = {
                        'cpf_tecnico': '12345678902',
                        'user': 'Fulano',
                        'senha_tecnico':'123456',
                        'senha_confirma':'123456',
                        'nome_tecnico': 'Fulano',
                        'contato_tecnico': '912345678',
                        'endereco_tecnico': 'Rua Bonita, n 123',
                        'admin': True
                    }

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

        self.mock_cat_1 = {
                        'nome_categoria': 'Peças Notebook',
                        'tipo_categoria': 'estoque',
                        'descricao_categoria':'Peças de reposição para notebook',
                    }
        self.mock_cat_2 = {
                        'nome_categoria': 'Formatação',
                        'tipo_categoria': 'servico',
                        'descricao_categoria':'Serviço de formatação realizado',
                    }

        self.mock_serv = {
                        'nome_servico': 'Formatação completa',
                        'categoria_servico': 2,
                        'descricao_servico': 'formatação + serial windows original',
                        'custo_servico': '100',
                    }

        self.mock_item_1 = {
                        'nome_item': 'Teclado Samsung',
                        'categoria_item': 1,
                        'descricao_item':'teclado samsung original',
                        'quantidade': 3,
                        'valor_un': '42.56',
                        'codigo_barras': 963852741456,
                    }

        self.mock_item_2 = {
                        'nome_item': 'SSD 240GB',
                        'categoria_item': 1,
                        'descricao_item':'SSD 240GB marca X',
                        'quantidade': 5,
                        'valor_un': '329.99',
                        'codigo_barras': 1472583690123,
                    }


        self.mock_prod = {
                        'cliente_id': 1,
                        'modelo': 'DELL',
                        'num_serie':'73573-A1',
                        'cor':'Preto',
                        'sis_operacional': 'Windows 10',
                        'avaria': False,
                        'liga': True,
                        'carrega': True,
                        'backup': True,
                        'acessorios': 'Com carregador',
                        'obs': '',
                        }

        self.mock_os = {
                        'cliente_id': 1,
                        'produto_id': 1,
                        'tipo_os':'Preventiva',
                        'prognostico':'Tela quebrada',
                        'diagnostico': 'Troca de tela; conserto da dobradiça esquerda',
                        'estado': 'Criada',
                        'emitir': True,
                        'hora_emissao': '2026-05-11T20:31',
                        'hora_fechamento': '2026-05-31T20:31',
                        'data_validade': '2026-06-09T20:31',
                        'orcamento': [
                                        {'cod_barra_item': '1472583690123', 'quantidade':1, 'nome': 'SSD 240GB', 'preco': '329.99', 'tipo': 'estoque'}, 

                                        {'cod_barra_item': '963852741456', 'quantidade':2, 'nome': 'Teclado Samsung', 'preco': '42.56', 'tipo': 'estoque'},

                                        {'id_item': 1, 'quantidade':1, 'nome': 'Formatação completa', 'preco': '100', 'tipo': 'servico'}
                                     ],
                    }

        self.mock_attachment = {
                        'solucao': 'Formatação realizada. Chave Windows original. Conserto de dobradiça',
                        'garantia': '2026-06-15T23:59',
                        'observacoes':'Serial Win10: AAAAA-BBBBB-CCCCC-DDDDD-EEEEE',
                        'emitido': False,
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
        
        # realizando login
        self.client.post('/tecnico/login', json={'usuario': 'admin', 'senha': 'admin001'})

        # criando novo tecnico
        self.client.post('/tecnico/novo', json=self.mock_user, headers=self.headers)

        # cadastrando cliente
        self.client.post('/cliente/novo', json=self.mock_cli, headers=self.headers)

        # cadastrando produto do cliente
        self.client.post('/produto/novo', json=self.mock_prod, headers=self.headers)
        
        # cadastrando categorias
        self.client.post('/categoria/novo', json=self.mock_cat_1, headers=self.headers)
        self.client.post('/categoria/novo', json=self.mock_cat_2, headers=self.headers)
        
        # cadastrando produtos de estoque
        self.client.post('/estoque/novo', json=self.mock_item_1, headers=self.headers)
        self.client.post('/estoque/novo', json=self.mock_item_2, headers=self.headers)

        # cadastrando servicos
        self.client.post('/servico/novo', json=self.mock_serv, headers=self.headers)

        # cadastrando os
        self.client.post('/os/novo', json=self.mock_os, headers=self.headers)


    def tearDown(self):
        self.client.post('/tecnico/logout', headers=self.headers)

        db.drop_all()

        self.appContext.pop()

        self.app = None

        self.client = None

    def test_attachment_new(self):
        '''
        DADO um ANEXO
        QUANDO cadastrado
        TESTE SE os dados são inseridos corretamente
        '''

        response_1 = self.client.post('/anexo/criar/1', json=self.mock_attachment, headers=self.headers)
        
        assert response_1.status_code == 201

    def test_attachment_edit(self):
        '''
        DADO um ANEXO
        QUANDO editado
        TESTE SE os dados são modificados corretamente
        '''
        from ..models.anexo import Anexo
        
        data_edit = {
                        'solucao': 'Formatação realizada. Chave Windows e Office originais. Conserto de dobradiça',
                        'garantia': '2026-09-15T23:59',
                        'observacoes':'Serial Win10: AAAAA-BBBBB-CCCCC-DDDDD-EEEEE / Serial Office: FFFFF-GGGGG-HHHHH-IIIII-JJJJJ',
                        'emitido': True,
                    }

        self.client.post('/anexo/criar/1', json=self.mock_attachment, headers=self.headers)
        
        # editando
        response_1 = self.client.post('/anexo/editar/1', json=data_edit, headers=self.headers)
        
        assert response_1.status_code == 200
        
        # checando
        anexo = db.session.query(Anexo).filter_by(anexo_id=1).one_or_none()

        assert anexo.solucao == data_edit['solucao']
        assert str(anexo.garantia) == '2026-09-15 23:59:00'
        assert anexo.observacoes == data_edit['observacoes']
        assert anexo.emitida == data_edit['emitido']
        
        
    def test_attachment_delete(self):
        '''
        DADO um ANEXO EXISTENTE
        QUANDO deletado
        TESTE SE os dados são excluídos corretamente
        '''

        # inserindo
        self.client.post('/anexo/criar/1', json=self.mock_attachment, headers=self.headers)

        # excluindo
        response = self.client.post('/anexo/excluir/1', headers=self.headers)
        
        assert response.status_code == 200

    def test_attachment_search(self):
        '''
        DADO um ANEXO EXISTENTE
        QUANDO pesquisado
        TESTE SE os dados são retornados corretamente
        '''
        from datetime import datetime

        # inserindo
        self.client.post('/anexo/criar/1', json=self.mock_attachment, headers=self.headers)

        # pesquisando
        response = self.client.get('/anexo/1', headers=self.headers)
        data = response.json

        assert response.status_code == 302
        assert data == {
                        'id': 1,
                        'garantia': datetime.strftime(datetime.strptime('2026-06-15T23:59', '%Y-%m-%dT%H:%M') ,'%d/%m/%Y às %H:%M:%S, %A'),
                        'observacoes':'Serial Win10: AAAAA-BBBBB-CCCCC-DDDDD-EEEEE',
                        'solucao': 'Formatação realizada. Chave Windows original. Conserto de dobradiça',
                        'is_emitida': False,
                    }
    