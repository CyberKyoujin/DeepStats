from pydantic import BaseModel


class User(BaseModel):
    id: int
    email: str
    username: str


class CreateUser(BaseModel):
    email: str
    username: str
    password: str
    
class LoginUser(BaseModel):
    email: str
    password: str

class StoreBybitApiKeys(BaseModel):
    api_key: str
    api_secret: str
