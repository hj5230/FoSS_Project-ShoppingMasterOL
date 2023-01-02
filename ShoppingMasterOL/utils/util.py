from random import randint
from ShoppingMasterOL.utils.algorithm import recommend_algorithm

def random_generator():
    return randint(0, 9)

def matrixlize(json: dict) -> list:
    ROWS = len(json)
    matrix = [[] for _ in range(ROWS)]
    for _ in range(ROWS):
        matrix[_] = json[str(_)]
    return matrix

def jsonlize(matrix: list) -> dict:
    '''
    dict-like structure
    {'u1': ['u4', 'u5'], 'u2': ['u5', 'u1'], 'u3': ['u4', 'u1'], 'u4': ['u1', 'u3'], 'u5': ['u2', 'u1']}
    '''
    # json = {}
    # for _, __ in dict.items():
    #     # _ = str(int(_[1]) - 1)
    #     __ = sorted([int(_[1]) - 1 for _ in __])
    #     json[_] = __
    # return json
    '''
    matrix-like structure
    [[0, 0], [0, 0]]
    '''
    json = {}
    LEN = len(matrix)
    for _ in range(LEN):
        json['u' + str(_ + 1)] = []
        for __ in range(LEN):
            if matrix[_][__] == 1:
                json['u' + str(_ + 1)].append(__)
    return json

def parse_tag(matrix: list) -> list:
    tags = ["games", "Nintendo", "work", "study", "music", "relaxation", "clean", "house", "travel", "nature"]
    LEN_MTX = len(matrix)
    LEN_TAG = len(tags)
    tagnames = [[] for _ in range(LEN_MTX)]
    for _ in range(LEN_MTX):
        for __ in range(LEN_TAG):
            if matrix[_][__]:
                tagnames[_].append(tags[__])
    return tagnames

def json_integrate(json: list, tags: list) -> list:
    LEN_TAG = len(tags)
    for _ in range(LEN_TAG):
        json['t' + str(_ + 1)] = tags[_]
    return json

if __name__ == '__main__':
    json = {'0': [1, 1, 0, 0, 0], '1': [0, 1, 1, 1, 0], '2': [1, 0, 0, 1, 1], '3': [1, 1, 0, 0, 1], '4': [0, 1, 0, 1, 0]}
    dict = recommend_algorithm(matrixlize(json))
    matrix = matrixlize(json)
    print(dict)
    print(jsonlize(dict))

    print(parse_tag(
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
        ]
    ))
