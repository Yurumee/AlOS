from config import db
# import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import INTEGER, VARCHAR, DATETIME, DateTime, ForeignKey

class Anexo(db.Model):
    __tablename__ = 'anexo'

    # COLUNAS
    # chave primaria
    anexo_id: Mapped[int] = mapped_column(ForeignKey('ordemServico.ordem_id'), primary_key=True, autoincrement=False)

    solucao: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    garantia: Mapped[DateTime] = mapped_column(DATETIME, nullable=False)
    observacoes: Mapped[str] = mapped_column(VARCHAR, nullable=False)