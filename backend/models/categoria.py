from config import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import INTEGER, VARCHAR

class Categoria(db.Model):
    __tablename__ = 'categoria'

    # COLUNAS
    # chave primaria
    categoria_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    titulo: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    tipo: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    descricao: Mapped[str] = mapped_column(VARCHAR(100))