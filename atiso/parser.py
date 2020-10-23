from enum import Enum

### CONFIG ###
FILE_PATH = "../input.txt"
#############

class Type(Enum):
    LispAtom = "atom"
    LispLambda = "lambda"
    LispList = "list"


def read_file(filePath):
    if filePath:
        with open(filePath) as f:
            return f.read()

lisp = read_file(filePath=FILE_PATH)

def check_int(value):
    try:
        int(value)
        return True
    except ValueError:
        return False

def tokenize(lisp):
    new_lisp = lisp.replace("(", " ( ").replace(")", " ) ").strip().split(" ")
    tokens = [char for char in new_lisp if char != '']
    return tokens

tokens = tokenize(lisp)
print("Tokenizing....")
print(tokens)

def parenthesize(tokens, curr_ls, idx):
    if idx >= len(tokens):
        return tokens
    else:
        token = tokens[idx]
        if token == '(':
            curr_ls.append(parenthesize(tokens, [], idx + 1))
            return parenthesize(tokens, curr_ls, idx + 1)
        elif token == ')':
            return curr_ls
        else:
            curr_ls.append(token)
            return parenthesize(tokens, curr_ls, idx + 1)

output = parenthesize(tokens, [], 0)
print("Parenthesizing tokens")
print(output)

