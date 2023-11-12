from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# from database import Base, engine
from routers import finances, users

app = FastAPI()
# Base.metadata.create_all(engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    error_messages = {}
    status_code = 422
    for error in exc.errors():
        if len(error['loc']) > 1:
            error_messages[error['loc'][1]] = error['msg']
        else:
            status_code = 415
            error_messages[error['loc'][0]] = error['msg']

    return JSONResponse(
        status_code=status_code,
        content=jsonable_encoder({'detail': error_messages}),
    )


@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(finances.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
