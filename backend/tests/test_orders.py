import unittest
from .. import create_app
from ..config import config_dict
from ..db import db
from flask_jwt_extended import create_access_token
from ..insert_sup import insert_sup
import locale
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')


class TestOrders(unittest.TestCase):
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
                        'emitir': False,
                        'hora_emissao': '2026-05-11T20:31',
                        'hora_fechamento': '2026-05-31T20:31',
                        'data_validade': '2026-06-09T20:31',
                        'orcamento': [
                                        {'cod_barra_item': '1472583690123', 'quantidade':1, 'nome': 'SSD 240GB', 'preco': '329.99', 'tipo': 'estoque'}, 

                                        {'cod_barra_item': '963852741456', 'quantidade':2, 'nome': 'Teclado Samsung', 'preco': '42.56', 'tipo': 'estoque'},

                                        {'id_item': 1, 'quantidade':1, 'nome': 'Formatação completa', 'preco': '100', 'tipo': 'servico'}
                                     ],
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

    def tearDown(self):
        self.client.post('/tecnico/logout', headers=self.headers)

        db.drop_all()

        self.appContext.pop()

        self.app = None

        self.client = None


    def test_os_new(self):
        '''
        DADO um modelo OrdemServico
        QUANDO cadastrado uma nova OS
        TESTE SE a OS é criada com sucesso
        '''     
        
        response = self.client.post('/os/novo', json=self.mock_os, headers=self.headers)

        assert response.status_code == 201

    def test_os_edit(self):
        '''
        DADO um modelo OrdemServico
        QUANDO editar uma OS
        TESTE SE a OS é editada com sucesso
        '''

        from ..models.ordemServico import OrdemServico

        # criando os
        self.client.post('/os/novo', json=self.mock_os, headers=self.headers)

        edit_os = {
                    'fechamento': '2026-05-23T21:58',
                    'validade': '2026-06-01T23:59',
                    'prognostico': 'Tela quebrada, lentidão',
                    'diagnostico': 'Troca de tela, formatação, conserto de dobradiça',
                    'orcamento': [
                                    {'cod_barra_item': '1472583690123', 'quantidade':1, 'nome': 'SSD 240GB', 'preco': 329.99, 'tipo': 'estoque'}, 

                                    {'cod_barra_item': '963852741456', 'quantidade':1, 'nome': 'Teclado Samsung', 'preco': 42.56, 'tipo': 'estoque'},

                                    {'id_item': 1, 'quantidade':1, 'nome': 'Formatação completa', 'preco': 100, 'tipo': 'servico'}
                                ],
                    'estado': 'Emitida',
                    'emitir_os': True,
                  }
        
        orcamento_val_total = 0.0
        
        for item in edit_os['orcamento']:
            orcamento_val_total += int(item['quantidade']) * float(item['preco'])

        # editando os
        response = self.client.post('/os/editar/1', json=edit_os, headers=self.headers)

        data = response.get_json()

        assert response.status_code == 200
        assert data['msg'] == 'ORDEM DE SERVIÇO ALTERADA COM SUCESSO!'

        # checando
        os = db.session.query(OrdemServico).filter_by(ordem_id = 1).one_or_none()

        assert str(os.fechamento) == '2026-05-23 21:58:00'
        assert str(os.validade) == '2026-06-01 23:59:00'
        assert os.estado_os == edit_os['estado']
        assert os.prognostico == edit_os['prognostico']
        assert os.diagnostico == edit_os['diagnostico']
        assert os.emitida == edit_os['emitir_os']
        
        assert float(os.orcamento) == float(orcamento_val_total)

    def test_os_del(self):
        '''
        DADO um modelo OrdemServico
        QUANDO excluir uma OS
        TESTE SE a OS é criada com sucesso
        '''

        self.client.post('/os/novo', json=self.mock_os, headers=self.headers)

        response = self.client.post('/os/excluir/1', headers=self.headers)

        assert response.status_code == 200

    def test_os_search(self):
        '''
        DADO um modelo OrdemServico
        QUANDO pesquisar uma OS especifica
        TESTE SE a OS é retornada com sucesso
        '''
        from datetime import datetime

        self.client.post('/os/novo', json=self.mock_os, headers=self.headers)
        date_now = datetime.now().replace(microsecond=0)

        response = self.client.get('/os/pesquisar/1', headers=self.headers)

        data = response.get_json()

        date_emissao = '2026-05-11 20:31:00'
        date_fechamento = '2026-05-31 20:31:00'
        date_validade = '2026-06-09 20:31:00'

        assert response.status_code == 302

        assert data == {
                                'id': 1,
                                'estado': 'Criada',
                                'tecnico_resp': '1234567890',
                                'tipo': 'Preventiva',
                                'data_emissao': date_emissao,
                                'data_fechamento': date_fechamento,
                                'validade': date_validade,
                                'prognostico': 'Tela quebrada',
                                'diagnostico': 'Troca de tela; conserto da dobradiça esquerda',
                                'orcamento': [
                                    
                                                {'id_item': 1, 'quantidade':1, 'nome': 'Formatação completa', 'preco': 100.0, 'tipo': 'servico'},

                                                {'cod_barra_item': '1472583690123', 'quantidade':1, 'nome': 'SSD 240GB', 'preco': 329.99, 'tipo': 'estoque'}, 

                                                {'cod_barra_item': '963852741456', 'quantidade':2, 'nome': 'Teclado Samsung', 'preco': 42.56, 'tipo': 'estoque'},
                                            ],
                                'cliente_os': 'cliente 01',
                                'produto_os': 'DELL',
                                'ult_atualizacao': date_now.strftime('%a, %d %b %Y %H:%M:%S GMT'),
                        }

    def test_os_all(self):
        '''
        DADO um modelo OrdemServico
        QUANDO pesquisar por todas as OS
        TESTE SE as OS são retornadas com sucesso
        '''

        from datetime import datetime

        orcamento_val_total = 0.0
        date_now = datetime.now().replace(microsecond=0)

        self.client.post('/os/novo', json=self.mock_os, headers=self.headers)

        response = self.client.get('/os/', headers=self.headers)
        data = response.json

        for item in self.mock_os['orcamento']:
            orcamento_val_total += int(item['quantidade']) * float(item['preco'])
        
        date_emissao = datetime.strptime('2026-05-11 20:31', '%Y-%m-%d %H:%M').strftime('%A, %d/%m/%Y às %H:%M:%S')
        date_fechamento = datetime.strptime('2026-05-31 20:31', '%Y-%m-%d %H:%M').strftime('%A, %d/%m/%Y às %H:%M:%S')
        date_validade = datetime.strptime('2026-06-09 20:31', '%Y-%m-%d %H:%M').strftime('%A, %d/%m/%Y às %H:%M:%S')

        assert response.status_code == 200

        assert data ==  {
                            '1': {
                                    'id': 1,
                                    'tipo_ordem': 'Preventiva',
                                    'tecnico_resp': 'Administrador',
                                    'cliente_nome': 'cliente 01',
                                    'produto_num_serie': '73573-A1',
                                    'prognostico': 'Tela quebrada',
                                    'diagnostico': 'Troca de tela; conserto da dobradiça esquerda',
                                    'orcamento': orcamento_val_total,
                                    'estado': 'Criada',
                                    'anexo_exists': 'Não',
                                    'solucao': '',
                                    'garantia': '',
                                    'observacao': '',
                                    'anexo_emitido': 'Não',
                                    'emitida': 'Não',
                                    'data_emissao': date_emissao,
                                    'data_fechamento': date_fechamento,
                                    'validade': date_validade,
                                    'ult_atualizacao': date_now.strftime('%A, %d/%m/%Y às %H:%M:%S'),
                                }
                        }

    def test_os_budget(self):
        '''
        DADO um modelo OrdemServico
        QUANDO pesquisar o orçamento completo de uma OS
        TESTE SE a OS e seus dados são retornados com sucesso
        '''
        from datetime import datetime

        i = 0
        orcamento_val_total = 0.0
        date_now = datetime.now().replace(microsecond=0)
        orcamento_itens = {}
        orcamento_servico = {}

        self.client.post('/os/novo', json=self.mock_os, headers=self.headers)

        response = self.client.get('/os/orcamento/1', headers=self.headers)
        data = response.json

        for item in self.mock_os['orcamento']:
            orcamento_val_total += int(item['quantidade']) * float(item['preco'])

        for item in self.mock_os['orcamento']:
            print(item)
            if item['tipo'] == 'estoque':
                orcamento_itens[str(i)] = {
                                        "cod_barras": item['cod_barra_item'],
                                        "nome_item": item['nome'],
                                        "preco": "{0:.2f}".format(float(item['preco'])),
                                        "quantidade_orcamento": item['quantidade'],
                                    }
                i += 1
            
            if item['tipo'] == 'servico':
                orcamento_servico[str(i)] = {
                                            "nome_servico": item['nome'],
                                            "custo": "{0:.2f}".format(float(item['preco']))
                                        }


        date_emissao = datetime.strptime('2026-05-11 20:31', '%Y-%m-%d %H:%M').strftime('%d/%m/%Y às %H:%M:%S, %A')
        date_fechamento = datetime.strptime('2026-05-31 20:31', '%Y-%m-%d %H:%M').strftime('%d/%m/%Y às %H:%M:%S, %A')
        date_validade = datetime.strptime('2026-06-09 20:31', '%Y-%m-%d %H:%M').strftime('%d/%m/%Y às %H:%M:%S, %A')

        assert response.status_code == 302

        assert data ==  {
                            'id': 1,
                            'cliente_nome': self.mock_cli['nome_cliente'],
                            'cliente_fantasia': self.mock_cli['empresa_cliente'],
                            'cliente_cpf_cnpj': self.mock_cli['cpf_cnpj_cliente'],
                            'cliente_endereco': self.mock_cli['endereco_cliente'],
                            'cliente_bairro': self.mock_cli['bairro_cliente'],
                            'cliente_cep': self.mock_cli['cep_cliente'],
                            'cliente_cidade': self.mock_cli['cidade_cliente'],
                            'cliente_telefone': self.mock_cli['telefone_cliente'],
                            'cliente_pessoa_juridica': self.mock_cli['flag_cnpj'],

                            'num_serie': self.mock_prod['num_serie'],
                            'modelo': self.mock_prod['modelo'],
                            'cor': self.mock_prod['cor'],
                            'so': self.mock_prod['sis_operacional'],
                            'acessorios': self.mock_prod['acessorios'],
                            'avaria': self.mock_prod['avaria'],
                            'backup': self.mock_prod['backup'],
                            'carrega': self.mock_prod['carrega'],
                            'liga': self.mock_prod['liga'],
                            'obs': self.mock_prod['obs'],

                            'tecnico_resp': 'Administrador',
                            'tecnico_contato': self.mock_user['contato_tecnico'],
                            
                            'anexo_exists': 'Não',
                            'solucao': '',
                            'garantia': '',
                            'observacao': '',
                            'anexo_emitido': 'Não',
                            
                            'tipo': self.mock_os['tipo_os'],
                            'data_emissao': date_emissao,
                            'data_fechamento': date_fechamento,
                            'validade': date_validade,
                            'prognostico': self.mock_os['prognostico'],
                            'diagnostico': self.mock_os['diagnostico'],

                            'orcamento_item': orcamento_itens,
                            'orcamento_servico': orcamento_servico,
                            'orcamento_total': str(orcamento_val_total),
                            'is_emitida': False,
                            'ult_atualizacao': date_now.strftime('%d/%m/%Y às %H:%M:%S, %A'),
                        }