from config import db
from sqlalchemy import VARCHAR, INTEGER, BOOLEAN, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.ordemServico import OrdemServico

class Produto(db.Model):
    __tablename__ = 'produto'

    # COLUNAS
    # chave primaria
    produto_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    cliente_cpf_cnpj: Mapped[int] = mapped_column(ForeignKey('cliente.cpf_cnpj'))

    modelo: Mapped[str] = mapped_column(VARCHAR(20), nullable=False, default='SEM INFO')
    num_serie: Mapped[str] = mapped_column(VARCHAR(20), nullable=False, default='SEM INFO')
    cor: Mapped[str] = mapped_column(VARCHAR(20))
    sis_operacional: Mapped[str] = mapped_column(VARCHAR(20))
    avaria: Mapped[bool] = mapped_column(BOOLEAN)
    liga: Mapped[bool] = mapped_column(BOOLEAN)
    carrega: Mapped[bool] = mapped_column(BOOLEAN)
    backup: Mapped[bool] = mapped_column(BOOLEAN)
    acessorios: Mapped[str] = mapped_column(VARCHAR)
    observacoes: Mapped[str] = mapped_column(VARCHAR)

    # RELACIONAMENTOS
    # relacionamento 1:n com ordemServico
    ordem_servicos: Mapped[list['OrdemServico']] = relationship()