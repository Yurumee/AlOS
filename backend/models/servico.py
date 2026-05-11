# importando bibliotecas necessarias
from ..db import db
# from config import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import VARCHAR, INTEGER, NUMERIC, Numeric, ForeignKey

class Servico(db.Model):
    __tablename__ = 'servico'

    # COLUNAS
    # chave primaria
    servico_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    categoria_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('categoria.categoria_id'), nullable=True)

    nome_servico: Mapped[str] = mapped_column(VARCHAR(30), nullable=False, unique=True)
    descricao_servico: Mapped[str] = mapped_column(VARCHAR(30), nullable=True)
    custo: Mapped[Numeric] = mapped_column(NUMERIC(7, 2), default=0.01 , nullable=False)

    # RELACIONAMENTOS
    # relacionamentos n:n entre ordemServico e servico
    ordens_servico: Mapped[list['models.os_servico.Os_servico']] = relationship(back_populates='servicos')