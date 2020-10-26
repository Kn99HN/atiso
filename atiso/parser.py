from Type import *

### CONFIG ###
FILE_PATH = "../input.txt"
#############

functions = ["first", "list", "+", "-", "*", "/"]


def read_file(filePath):
    if filePath:
        with open(filePath) as f:
            return f.read()


def check_int(value):
    try:
        int(value)
        return True
    except ValueError:
        return False


def tokenize(lisp):
    new_lisp = lisp.replace("(", " ( ").replace(")", " ) ").strip().split(" ")
    tokens = [char for char in new_lisp if char != ""]
    return tokens


def transform(tokens, curr_ls):
    if not tokens:
        return curr_ls
    else:
        token = tokens[0]
        tokens.remove(token)
        if token is None:
            return tokens[-1]
        elif token == "(":
            curr_ls.append(transform(tokens, []))
            return transform(tokens, curr_ls)
        elif token == ")":
            return curr_ls
        else:
            curr_ls.append(convert_type(token))
            return transform(tokens, curr_ls)


def convert_type(token):
    if check_int(token):
        return {"value": int(token), "type": Type.LispAtom}
    elif token in functions:
        return {"value": token, "type": Type.LispLambda}
    else:
        return {"value": token, "type": Type.LispStr}


def pretty_print(tokens):
    if not tokens:
        pass
    else:
        curr_value = tokens[0]
        tokens.remove(curr_value)
        if isinstance(curr_value, list):
            pretty_print(curr_value)
            pretty_print(tokens)
        elif isinstance(curr_value, str):
            print(f"Tokens: {curr_value}. Type str")
            pretty_print(tokens)
        elif isinstance(curr_value, int):
            print(f"Tokens: {curr_value}. Type int")
            pretty_print(tokens)
        else:
            print(f"Tokens: {curr_value}. Type N/A")
            pretty_print(tokens)


if __name__ == "__main__":
    expressions = read_file(filePath=FILE_PATH)
    print("Tokenizing...")
    tokens = tokenize(expressions)
    print(tokens)
    print("Transforming tokens...")
    transformed_tokens = transform(tokens, [])
    print(transformed_tokens)
