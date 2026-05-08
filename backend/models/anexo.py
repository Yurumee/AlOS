from config import db
# import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import INTEGER, VARCHAR, BOOLEAN, DATETIME, DateTime, ForeignKey

class Anexo(db.Model):
    __tablename__ = 'anexo'

    # COLUNAS
    # chave primaria
    id: Mapped[int] = mapped_column(INTEGER, primary_key=True)
    # chave primaria depende da chave estrangeira de ordem de serviço
    anexo_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('ordemServico.ordem_id'), unique=True, autoincrement=False)

    solucao: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    garantia: Mapped[DateTime] = mapped_column(DATETIME, nullable=False)
    observacoes: Mapped[str] = mapped_column(VARCHAR, nullable=False, default='')
    emitida: Mapped[bool] = mapped_column(BOOLEAN, default=False, nullable=False)

    # RELACIONAMENTOS
    # relacionamento 1:1 entre anexo e ordem
    # model declarado dessa forma para evitar erro de circular import 
    ordem: Mapped['models.ordemServico.OrdemServico'] = relationship(back_populates='anexo')


