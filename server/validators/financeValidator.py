from fastapi import Depends, HTTPException, Request, status

from database import db
from models.User import User
from models.Finance import Finance
from models.Company import Company
from utils.helpers import tags_arr_to_str
from middlewares import get_current_user2


def validate_get_finance(
    request: Request,
    id: int,
    user=Depends(get_current_user2)
):
    finance = (
        db.query(Finance)
        .filter(Finance.id == id)
        .first()
    )
    print(finance)

    if finance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Finance not found'
        )

    if finance.company.user_id != user.get('id'):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='You are not allowed to access this finance'
        )
    else:
        return finance

def validate_get_finance_by_company(
    request: Request,
    company_id: int,
    user=Depends(get_current_user2)
):
    company = (
        db.query(Company)
        .filter(Company.id == company_id)
        .first()
    )

    if company.user_id != user.get('id'):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='You are not allowed to access this companies finances'
        )

    if company is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Company not found'
        )
    
    total_finances = (
        db.query(Finance)
        .filter(Finance.company_id == company_id)
        .count()
    )
    print(total_finances)

    if total_finances == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Finance not found'
        )

    else:
        return total_finances
