from config import db
import datetime
from sqlalchemy import VARCHAR, INTEGER, NUMERIC, Numeric, DATETIME, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

class OrdemServico(db.Model):
    __tablename__ = 'ordemServico'

    # COLUNAS
    # chave primaria
    ordem_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    tecnico_cpf: Mapped[int] = relationship(ForeignKey('cpf_tecnico'))
    produto_id: Mapped[int] = relationship(ForeignKey('produto_id'))
    cliente_cpf_cnpj: Mapped[int] = relationship(ForeignKey('cpf_cnpj'))

    tipo_ordem: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    emissao: Mapped[DateTime] = mapped_column(DATETIME, nullable=False, default=datetime.datetime.now())
    fechamento: Mapped[DateTime] = mapped_column(DATETIME)
    validade: Mapped[DateTime] = mapped_column(DATETIME)
    prognostico: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    diagnostico: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    orcamento: Mapped[Numeric] = mapped_column(NUMERIC(7, 2))
    solucao: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    observacoes_os: Mapped[str] = mapped_column(VARCHAR)

    # RELACIONAMENTOS