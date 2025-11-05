from config import db
# import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import INTEGER, VARCHAR, DATETIME, DateTime, ForeignKey

# from models.ordemServico import OrdemServico
class Anexo(db.Model):
    __tablename__ = 'anexo'

    # COLUNAS
    # chave primaria
    # chave primaria depende da chave estrangeira de ordem de serviço
    anexo_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('ordemServico.ordem_id'), primary_key=True, autoincrement=False)

    solucao: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    garantia: Mapped[DateTime] = mapped_column(DATETIME, nullable=False)
    observacoes: Mapped[str] = mapped_column(VARCHAR, nullable=False)

    # RELACIONAMENTOS
    # relacionamento 1:1 entre anexo e ordem
    # model declarado dessa forma para evitar erro de circular import 
    ordem: Mapped['models.ordemServico.OrdemServico'] = relationship(back_populates='anexo')
