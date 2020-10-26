from enum import Enum


class Type(Enum):
    LispAtom = "atom"
    LispLambda = "lambda"
    LispStr = "string"
