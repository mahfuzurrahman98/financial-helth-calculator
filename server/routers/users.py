from datetime import datetime, timedelta
from os import environ
from typing import Annotated

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from passlib.exc import UnknownHashError

from database import db
from schemas.UserSchema import (
    createUserSchema,
    loginFormSchema
)

from models.User import User
from models.Company import Company

from utils import Auth  # as Module
from utils.Hash import Hash  # as Class
from validators.userValidator import check_existing_user

load_dotenv()
router = APIRouter()


# Register using Password
@router.post('/users/auth/register')
def register(
    user: Annotated[createUserSchema, Depends(check_existing_user)]
):
    try:
        new_user = User(
            email=user.email,
            password=Hash.make(user.password)
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        new_company = Company(
            name=user.company_name,
            user_id=new_user.id
        )
        db.add(new_company)
        db.commit()

        _new_company = new_company.serialize()
        resp = {
            'detail': 'Company registered successfully',
            'data': _new_company
        }
        return JSONResponse(status_code=201, content=resp)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Login using Password
@router.post('/users/auth/login')
def login(
    form_data: loginFormSchema
):
    try:
        user = db.query(User).filter(
            User.email == form_data.email
        ).first()

        if not user or not Hash.verify(form_data.password, user.password):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={'detail': 'Invalid Credentials'}
            )

        access_token = Auth.create_access_token(data={'sub': user.email})
        print(access_token)
        refresh_token = Auth.create_refresh_token(data={'sub': user.email})

        company = user.company
        response = JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                'detail': 'Login successful',
                'data': {
                    'company': {
                        'id': company.id,
                        'name': company.name
                    },
                    'user': user.serialize(),
                    'access_token': access_token
                }
            },
            headers={'WWW-Authenticate': 'Bearer'},
        )
        # print(response)
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            max_age=environ.get('REFRESH_TOKEN_EXPIRE_MINUTES'),
            expires=environ.get('REFRESH_TOKEN_EXPIRE_MINUTES'),
            # path='/api/v1/users/auth/refreshtoken',
            path='/',
            secure=False,
            httponly=True,
            samesite="strict",
        )
        return response

    except UnknownHashError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)+' xx',
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e) + ' x2x',
        )


# refresh token
@router.post('/users/auth/refreshtoken')
def refresh_token(request: Request):
    token_exception = JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={'detail': 'Unauthorized'},
        headers={'WWW-Authenticate': 'Bearer'},
    )

    token = request.cookies.get('refresh_token')

    if not token:
        return token_exception

    try:
        payload = Auth.decode_refresh_token(token)
        email = payload.get('sub')
        if not email:
            raise token_exception
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise token_exception

        _user = user.serialize()
    except Exception:
        return token_exception

    try:
        access_token = Auth.create_access_token(data={'sub': user.email})
        company = user.company
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                'detail': 'Authentication successful',
                'data': {
                    'company': {
                        'id': company.id,
                        'name': company.name
                    },
                    'user': _user,
                    'access_token': access_token,
                }
            },
            headers={'WWW-Authenticate': 'Bearer'},
        )

    except UnknownHashError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


# Logout
@router.post('/users/auth/logout')
def logout(request: Request):
    response = JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            'detail': 'Logout successful',
        }
    )
    response.delete_cookie('refresh_token')
    return response
