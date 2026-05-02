from config import db
from sqlalchemy import VARCHAR, INTEGER, BOOLEAN, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.ordemServico import OrdemServico
# from models.cliente import Cliente

class Produto(db.Model):
    __tablename__ = 'produto'

    # COLUNAS
    # chave primaria
    produto_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    cliente_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('cliente.cliente_id'))

    modelo: Mapped[str] = mapped_column(VARCHAR(20), default='Não Informado')
    num_serie: Mapped[str] = mapped_column(VARCHAR(20), default='Não Informado')
    cor: Mapped[str] = mapped_column(VARCHAR(20), nullable=True)
    sis_operacional: Mapped[str] = mapped_column(VARCHAR(20))
    avaria: Mapped[bool] = mapped_column(BOOLEAN)
    liga: Mapped[bool] = mapped_column(BOOLEAN)
    carrega: Mapped[bool] = mapped_column(BOOLEAN)
    backup: Mapped[bool] = mapped_column(BOOLEAN)
    acessorios: Mapped[str] = mapped_column(VARCHAR, nullable=True)
    observacoes: Mapped[str] = mapped_column(VARCHAR, nullable=True)

    # RELACIONAMENTOS
    # relacionamento 1:n com ordemServico
    ordem_servicos: Mapped[list['OrdemServico']] = relationship()

    # relacionamento com Cliente
    # cliente: Mapped["models.cliente.Cliente"] = relationship(back_populates='produto_id')