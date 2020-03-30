import math, string, uvicorn, settings, json, jwt
from datetime import datetime, timedelta
from fastapi import FastAPI, Response, Depends, Header
from fastapi.security import HTTPBasicCredentials, HTTPBearer
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:4200",
    "https://localhost",
    "https://localhost:4200",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

token_check = HTTPBearer()

class User(BaseModel):
    username: str

class Operands(BaseModel):
    x: float
    y: Optional[float]

class User_Session(BaseModel):
    username: str
    iat: int
    exp: int


json_letters = string.ascii_letters
xml_letters = string.ascii_lowercase

    

json_allowed = json_letters[json_letters.index(settings.json_start):json_letters.index(settings.json_end)+1]
xml_allowed = xml_letters[xml_letters.index(settings.xml_start):xml_letters.index(settings.xml_end)+1]


def createToken(input):
    data = jwt.encode(input, 'secret', algorithm='HS256')
    return data



def decodeToken(authorization : HTTPBasicCredentials = Depends(token_check)):
    for i in authorization:
        token = i[1]

    user_data = jwt.decode(token, 'secret', algorithms='HS256')
    return User_Session(**user_data)



@app.post("/login")
async def set_name(username: User):
    token_data = username.json()

    date = int(datetime.utcnow().timestamp())

    token_data = json.loads(token_data)
    token_data.update({ "iat": date, "exp": date + 3600 })
    token = createToken(token_data)

    if any(token_data["username"].lower().startswith(x) for x in json_allowed):
        settings.name.append(token_data["username"])
        content = { "token": { "access_token": token, "type": "Bearer", "exp": token_data["exp"]} }
        return content

    elif any(token_data["username"].lower().startswith(x) for x in xml_allowed):
        settings.name.append(token_data["username"])
        data = """<?xml version="1.0"?>
        <token><access_token>{}</access_token>
        <type>Bearer</type>
        <exp>{}</exp></token>
        """.format(token.decode("utf-8"), date)
        content = Response(content=data, media_type="text/xml", status_code=201)

        return content
    
    else:
        content = {"message": "No Data Provided"}
        return content

    return



@app.get("/ready")
async def get_ready(token: str = Header(None)):
    token_data = jwt.decode(token, 'secret', algorithms='HS256')
    print(settings.name)
    print(token_data["username"])

    if token_data["username"] not in settings.name:
        info = {"message": "No Name Input"}
        return info
        
    elif (any(Authorization.username.lower().startswith(x) for x in json_allowed) and Authorization.username in settings.name):
        info = {"message": "Calulator is ready",
                "user": settings.name}
        return info

    elif (any(Authorization.username.lower().startswith(x) for x in xml_allowed) and Authorization.username in settings.name):
        info = """<?xml version="1.0"?>
        <message>Calulator is ready</message>
        """
        return Response(content=info, media_type="text/xml", status_code=201)

    return



@app.post("/add")
async def perform_addition(ops: Operands, Authorization: HTTPBasicCredentials = Depends(decodeToken) ):

    answer = None

    if ops.y is None:
        answer = {"Result": "Can't perform operation"}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in json_allowed) and Authorization.username in settings.name):
        resp = ops.x + ops.y
        answer = {"Result": resp}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in xml_allowed) and Authorization.username in settings.name):
        resp = ops.x + ops.y
        answer = """<?xml version="1.0"?>
        <Result>{}</Result>""".format(resp)
        return Response(content=answer, media_type="text/xml", status_code=201)

    else:
        answer = {"message": "Unable to perfrom"}
        return answer



@app.post("/sub")
async def perform_subtraction(ops: Operands, Authorization: HTTPBasicCredentials = Depends(decodeToken) ):

    if ops.y is None:
        answer = {"Result": "Can't perform operation"}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in json_allowed) and Authorization.username in settings.name):
        resp = ops.x - ops.y
        answer = {"Result": resp}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in xml_allowed) and Authorization.username in settings.name):
        resp = ops.x - ops.y
        answer = """<?xml version="1.0"?>
        <Result>{}</Result>""".format(resp)
        return Response(content=answer, media_type="text/xml", status_code=201)

    else:
        answer = {"message": "Unable to perfrom"}
        return answer

    return


@app.post("/divide")
async def perform_division(ops: Operands, Authorization: HTTPBasicCredentials = Depends(decodeToken) ):

    if ops.y is None:
        answer = {"Result": "Can't perform operation"}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in json_allowed) and Authorization.username in settings.name):
        resp = ops.x / ops.y
        answer = {"Result": resp}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in xml_allowed) and Authorization.username in settings.name):
        resp = ops.x / ops.y
        answer = """<?xml version="1.0"?>
        <Result>{}</Result>""".format(resp)
        return Response(content=answer, media_type="text/xml", status_code=201)

    else:
        answer = {"message": "Unable to perfrom"}
        return answer
    
    return


@app.post("/multi")
async def perform_multi(ops: Operands, Authorization: HTTPBasicCredentials = Depends(decodeToken) ):
    if ops.y is None:
        answer = {"Result": "Can't perform operation"}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in json_allowed) and Authorization.username in settings.name):
        resp = ops.x * ops.y
        answer = {"Result": resp}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in xml_allowed) and Authorization.username in settings.name):
        resp = ops.x * ops.y
        answer = """<?xml version="1.0"?>
        <Result>{}</Result>""".format(resp)
        return Response(content=answer, media_type="text/xml", status_code=201)

    else:
        answer = {"message": "Unable to perfrom"}
        return answer

    return



@app.post("/sqrt")
async def perform_sqrt(ops: Operands, Authorization: HTTPBasicCredentials = Depends(decodeToken) ):

    if ops.x is None:
        answer = {"Result": "Can't perform operation"}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in json_allowed) and Authorization.username in settings.name):
        resp = math.sqrt(ops.x)
        answer = {"Result": resp}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in xml_allowed) and Authorization.username in settings.name):
        resp = math.sqrt(ops.x)
        answer = """<?xml version="1.0"?>
        <Result>{}</Result>""".format(resp)
        return Response(content=answer, media_type="text/xml", status_code=201)

    else:
        answer = {"message": "Unable to perfrom"}
        return answer

    return




@app.post("/natlog")
async def perform_natlog(ops: Operands, Authorization: HTTPBasicCredentials = Depends(decodeToken) ):

    if ops.x is None:
        answer = {"Result": "Can't perform operation"}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in json_allowed) and Authorization.username in settings.name):
        resp = math.log1p(ops.x)
        answer = {"Result": resp}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in xml_allowed) and Authorization.username in settings.name):
        resp = math.log1p(ops.x)
        answer = """<?xml version="1.0"?>
        <Result>{}</Result>""".format(resp)
        return Response(content=answer, media_type="text/xml", status_code=201)

    else:
        answer = {"message": "Unable to perfrom"}
        return answer

    return


@app.post("/exponential")
async def perform_exponential(ops: Operands, Authorization: HTTPBasicCredentials = Depends(decodeToken) ):

    if ops.x is None:
        answer = {"Result": "Can't perform operation"}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in json_allowed) and Authorization.username in settings.name):
        resp = math.exp(ops.x)
        answer = {"Result": resp}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in xml_allowed) and Authorization.username in settings.name):
        resp = math.exp(ops.x)
        answer = """<?xml version="1.0"?>
        <Result>{}</Result>""".format(resp)
        return Response(content=answer, media_type="text/xml", status_code=201)
    
    else:
        answer = {"message": "Unable to perfrom"}
        return answer

    return

@app.post("/factorial")
async def perform_factorial(ops: Operands, Authorization: HTTPBasicCredentials = Depends(decodeToken) ):

    if ops.x is None:
        answer = {"Result": "Can't perform operation"}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in json_allowed) and Authorization.username in settings.name):
        resp = math.factorial(ops.x)
        answer = {"Result": resp}
        return answer

    elif (any(Authorization.username.lower().startswith(x) for x in xml_allowed) and Authorization.username in settings.name):
        resp = math.factorial(ops.x)
        answer = """<?xml version="1.0"?>
        <Result>{}</Result>""".format(resp)

        return Response(content=answer, media_type="text/xml", status_code=201)

    else:
        answer = {"message": "Unable to perfrom"}
        return answer

    return

if __name__ == '__main__':
    uvicorn.run("app:app", host='0.0.0.0', port=5000, reload=True)