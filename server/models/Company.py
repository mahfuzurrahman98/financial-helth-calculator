from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from database import Base


class Company(Base):
    __tablename__ = 'companies'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    updated_at = Column(
        TIMESTAMP,
        nullable=True,
        default=None,
        onupdate=func.now(),
        server_onupdate=func.now()
    )
    deleted_at = Column(TIMESTAMP, nullable=True)

    # one company to one user
    user = relationship('User', back_populates='company')
    # one company to many finances
    finances = relationship('Finance', back_populates='company')

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
        }
