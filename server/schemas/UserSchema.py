from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator


class loginFormSchema(BaseModel):
    email: EmailStr
    password: str

    @field_validator('password')
    def validate_password(cls, value):
        value = value.strip()
        if ' ' in value:
            raise ValueError('Password cannot contain spaces')
        if len(value) < 6:
            raise ValueError('Password must be at least 6 characters')
        return value


class createUserSchema(BaseModel):
    company_name: str
    email: EmailStr
    password: str

    @field_validator('company_name')
    def validate_blank_company_name_field(cls, value):
        value = value.strip()
        if value == '':
            raise ValueError('Company name cannot be blank')
        return value

    @field_validator('password')
    def validate_password(cls, value):
        value = value.strip()
        if ' ' in value:
            raise ValueError('Password cannot contain spaces')
        if len(value) < 6:
            raise ValueError('Password must be at least 6 characters')
        return value
