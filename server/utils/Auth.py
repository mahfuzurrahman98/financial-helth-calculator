from datetime import datetime, timedelta
from os import environ

from dotenv import load_dotenv
from fastapi import HTTPException, status
from jose import jwt
from jose.exceptions import JWTError

load_dotenv()


def create_access_token(data: dict):
    to_encode = data.copy()

    expires_delta = timedelta(
        minutes=float(environ.get('ACCESS_TOKEN_EXPIRE_MINUTES'))
    )
    expire = datetime.utcnow() + expires_delta if expires_delta else datetime.utcnow()

    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(
        to_encode,
        environ.get('ACCESS_TOKEN_SECRET'),
        algorithm=environ.get('ALGORITHM')
    )
    return encoded_jwt


def create_refresh_token(data: dict):
    to_encode = data.copy()

    expires_delta = timedelta(
        minutes=float(environ.get('REFRESH_TOKEN_EXPIRE_MINUTES'))
    )
    expire = datetime.utcnow() + expires_delta if expires_delta else datetime.utcnow()

    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(
        to_encode,
        environ.get('REFRESH_TOKEN_SECRET'),
        algorithm=environ.get('ALGORITHM')
    )
    return encoded_jwt


def decode_access_token(token):
    try:
        payload = jwt.decode(
            token.replace('Bearer ', ''),
            environ.get('ACCESS_TOKEN_SECRET'),
            algorithms=[environ.get('ALGORITHM')]
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )


def decode_refresh_token(token):
    try:
        payload = jwt.decode(
            token.replace('Bearer ', ''),
            environ.get('REFRESH_TOKEN_SECRET'),
            algorithms=[environ.get('ALGORITHM')]
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )
