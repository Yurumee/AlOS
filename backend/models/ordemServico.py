from config import db
import datetime
from sqlalchemy import VARCHAR, INTEGER, NUMERIC, Numeric, DATETIME, DateTime
from sqlalchemy.orm import Mapped, mapped_column

class OrdemServico(db.Model):
    __tablename__ = 'ordemServico'

    # COLUNAS
    # chave primaria
    ordem_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    # TO DO

    tipo_ordem: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    # TO DO
    # emissao, fechamento, validade são DATAS!!!
    emissao: Mapped[DateTime] = mapped_column(DATETIME, nullable=False, default=datetime.datetime.now())
    fechamento: Mapped[DateTime] = mapped_column(DATETIME)
    validade: Mapped[DateTime] = mapped_column(DATETIME)
    prognostico: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    diagnostico: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    orcamento: Mapped[Numeric] = mapped_column(NUMERIC(7, 2))
    solucao: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    observacoes_os: Mapped[str] = mapped_column(VARCHAR)