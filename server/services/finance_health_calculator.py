
from os import environ
from fastapi import FastAPI, HTTPException

def finance_health_calculator(
    income: float,
    expense: float,
    debts: float,
    assets: float
):
    # calculate the finance health score of a company using its monthly income, expense, debts, and assets
    # return a score between 0 and 100
    # 0 is the worst score, 100 is the best score
    # the score is calculated using the following formula:
    # score = (income - expense) / (debts + assets)
    score = (income - expense) / (debts + assets)
    return score