from config import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import INTEGER, ForeignKey

# TABELA ASSOCIATIVA ENTRE SERVICO E OS
class Os_servico(db.Model):
    __tablename__ = 'os_servico'

    # COLUNAS
    # chave primaria
    id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    ordem_id: Mapped[int] = mapped_column(ForeignKey('ordemServico.ordem_id'))
    servico_id: Mapped[int] = mapped_column(ForeignKey('servico.servico_id'))

    # quantidade: Mapped[int] = mapped_column(INTEGER)

    ordem: Mapped['models.ordemServico.OrdemServico'] = relationship(back_populates='servicos_os')
    servicos: Mapped['models.servico.Servico'] = relationship(back_populates='ordens_servico')