from config import db
# from typing import Optional
import datetime
from sqlalchemy import VARCHAR, INTEGER, NUMERIC, BOOLEAN, Numeric, DATETIME, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# from models.anexo import Anexo

class OrdemServico(db.Model):
    __tablename__ = 'ordemServico'

    # COLUNAS
    # chave primaria
    ordem_id: Mapped[int] = mapped_column(INTEGER, primary_key=True, autoincrement=True)

    # chave estrangeira
    tecnico_cpf: Mapped[str] = mapped_column(VARCHAR, ForeignKey('tecnico.cpf_tecnico'))
    produto_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('produto.produto_id'))
    cliente_id: Mapped[int] = mapped_column(INTEGER, ForeignKey('cliente.cliente_id'))

    tipo_ordem: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    # data de criação da os
    emissao: Mapped[DateTime] = mapped_column(DATETIME, nullable=False, default=datetime.datetime.now())
    # data de aprovação/cancelamento da os
    fechamento: Mapped[DateTime] = mapped_column(DATETIME)
    # data de validade para o orçamento da os
    # por padrão, adiciona 2 semanas
    validade: Mapped[DateTime] = mapped_column(DATETIME, nullable=False, default=datetime.datetime.now() + datetime.timedelta(days=14))

    prognostico: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    diagnostico: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    orcamento: Mapped[Numeric] = mapped_column(NUMERIC(7, 2))
    estado_os: Mapped[str] = mapped_column(VARCHAR, nullable=False)
    emitida: Mapped[bool] = mapped_column(BOOLEAN, default=False, nullable=False)
    ultima_atualizacao: Mapped[DateTime] = mapped_column(DATETIME, default=datetime.datetime.now())

    # RELACIONAMENTOS
    # relacionamento 1:1 entre ordem e anexo
    # model declarado dessa forma para evitar erro de circular import 
    anexo: Mapped['models.anexo.Anexo'] = relationship(back_populates='ordem', uselist=False)
    
    