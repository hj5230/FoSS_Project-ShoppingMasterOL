import os
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import pairwise_distances
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from chatterbot.trainers import ListTrainer
from os import listdir
from os.path import isfile
from os.path import join

def recommend_algorithm(datasets: list) -> list:
    users=["u1","u2","u3","u4","u5"]
    items=["i1","i2","i3","i4","i5"]
    df =pd.DataFrame(datasets,columns=items,index=users)
    user_similar=1-pairwise_distances(df.values,metric='jaccard')
    user_similar=pd.DataFrame(user_similar,columns=users,index=users)
    item_similar=1-pairwise_distances(df.values,metric='jaccard')
    item_similar=pd.DataFrame(item_similar,columns=items,index=items)
    top2={}
    for i in user_similar.index:
        _df=user_similar.loc[i].drop([i])
        _df_sorted=_df.sort_values(ascending=False)
        top=list(_df_sorted.index[:2])
        top2[i]=top
    o=0
    results=[]
    for user,sim_users in top2.items():
        result=set()
        for sim_user in sim_users:
            result=result.union(set(df.loc[sim_user].replace(0,np.nan).dropna().index))
        result-=set(df.loc[user].replace(0,np.nan).dropna().index)
        results.append(list(result))
        o+=1
    l=[0]*5
    for i in range(len(l)):
        w=[0]*5
        l[i]=w
    for i in range(0,5):
        for w in results[i]:
            for j in range(1,6):
                if w=="i"+str(j):
                    l[i][j-1]=1
    return l

def relevent_tag(datasets: list) -> list:
    users = ["User1", "User2", "User3", "User4", "User5"]
    items = ["Switch", "Ipad", "Headset", "Glass brush", "Backpack"]
    labels = ["games", "Nintendo", "work", "study", "music", "relaxation", "clean", "house", "travel", "nature"]
    labels1 = ["games", "Nintendo", "work", "study", "music", "relaxation", "clean", "house", "travel", "nature"]
    datasets1 = [[0]]
    for i in datasets:
        List = []
        num = 0
        for j in i:
            if j == 1:
                List.append(1)
                List.append(1)
            else:
                List.append(0)
                List.append(0)
        datasets1.append(List)
    datasets1.remove([0])
    df = pd.DataFrame(datasets1, columns=labels, index=users)
    labels_similar = 1 - pairwise_distances(df.T.values, metric='jaccard')
    labels_similar = pd.DataFrame(labels_similar, columns=labels, index=labels)
    toplabels = {}
    for i in labels_similar.index:
        _df = labels_similar.loc[i].drop([i])
        _df_sorted = _df.sort_values(ascending=False)
        top = list(_df_sorted.index[:2])
        toplabels[i] = top
    rs_results = []
    for users in df.index:
        rs_result = set()
        for labels in df.loc[users].replace(0,np.nan).dropna().index:
            rs_result=rs_result.union(toplabels[labels])
        rs_result -= set(df.loc[users].replace(0,np.nan).dropna().index)
        rs_results.append(list(rs_result))
    l = [0] * 5
    for i in range(len(l)):
        w = [0] * 10
        l[i] = w
    for i in range(0, 5):
        for m in rs_results[i]:
            num = 0
            for j in labels1:
                if m == j:
                    l[i][num] = 1
                else:
                    num += 1
    return l

def chat_reply(reinformtation: str) -> str:
    src = './ShoppingMasterOL/public/plugins/relateddata'
    fn= [f for f in listdir(src) if isfile(join(src, f))]
    fn = [src + x for x in fn]
    print(fn)
    ai = ChatBot(
        'talkingAI',  
        logic_adapters=[{ 
                'import_path': 'chatterbot.logic.BestMatch', 
                'default_response': 'I am sorry, but I do not understand.', 
                'maximum_similarity_threshold': 0.50, 
            },], 
            preprocessors = [ 
                "chatterbot.preprocessors.clean_whitespace", 
            ], 
            input_adaptor="chatterbot.input.TerminalAdaptor", 
            output_adaptor="chatterbot.output.TerminalAdaptor", 
            database_uri='sqlite:///database.sqlite3') 
    trainer = ChatterBotCorpusTrainer(ai)
    trainer.train(*fn,)
    reinformtation = str(reinformtation)
    if reinformtation=='no more talking':
        print('talkingAI: I am looking for next conversation. See you')
    elif reinformtation == '1':
        return "Which area do you need product recommendations for?\na, Electronics\nb, Headphones\nc, Tools\nd, Bag"
    elif reinformtation == '2':
        return "Please enter your order number"
    elif "#" in reinformtation:
        return  "Inquiring, please wait......"
    elif reinformtation == "Electronics" or reinformtation == 'a':
        return 0 ###
    elif reinformtation == "Headphones" or reinformtation == 'b':
        return 1###
    elif reinformtation == "Tools" or reinformtation == 'c':
        return 2###
    elif reinformtation == "Bag" or reinformtation == 'd':
        return 3###
    else:
        response = ai.get_response(reinformtation)
        return str(response)

# def chat_reply(msg):
#     return msg

# def test_dir():
#     print(os.listdir('./ShoppingMasterOL/public/plugins/relateddata')