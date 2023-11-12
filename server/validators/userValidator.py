from fastapi import HTTPException, status

from database import db
from models.User import User
from models.Company import Company
from schemas.UserSchema import createUserSchema


def check_existing_user(user: createUserSchema):
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email already registered"
        )

    existing_username = db.query(User).filter(
        User.username == user.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Username already taken"
        )

    return user


def check_existing_company(user: createUserSchema):
    existing_company = db.query(User).join(Company).filter(
        Company.name == user.company_name).first()
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Company already registered"
        )

    return user
