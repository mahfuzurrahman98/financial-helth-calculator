from sqlalchemy import TIMESTAMP, Column, Integer, SmallInteger, String, text, func
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(
        TIMESTAMP,
        nullable=True,
        default=None,
        onupdate=func.now(),
        server_onupdate=func.now()
    )

    # one user to one company
    company = relationship('Company', back_populates='user', uselist=False)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email
        }
