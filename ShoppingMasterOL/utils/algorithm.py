import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import pairwise_distances

def recommend_algorithm(datasets: list) -> list:
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

    # users=["u1","u2","u3","u4","u5"]
    # items=["i1","i2","i3","i4","i5"]
    # df =pd.DataFrame(datasets,columns=items,index=users)
    # user_similar=1-pairwise_distances(df.values,metric='jaccard')
    # user_similar=pd.DataFrame(user_similar,columns=users,index=users)
    # item_similar=1-pairwise_distances(df.values,metric='jaccard')
    # item_similar=pd.DataFrame(item_similar,columns=items,index=items)
    # top2={}
    # for i in user_similar.index:
    #     _df=user_similar.loc[i].drop([i])
    #     _df_sorted=_df.sort_values(ascending=False)
    #     top=list(_df_sorted.index[:2])
    #     top2[i]=top
    # o=0
    # results=[]
    # for user,sim_users in top2.items():
    #     result=set()
    #     for sim_user in sim_users:
    #         result=result.union(set(df.loc[sim_user].replace(0,np.nan).dropna().index))
    #     result-=set(df.loc[user].replace(0,np.nan).dropna().index)
    #     results.append(list(result))
    #     o+=1
    # l=[0]*5
    # for i in range(len(l)):
    #     w=[0]*5
    #     l[i]=w
    # for i in range(0,5):
    #     for w in results[i]:
    #         for j in range(1,6):
    #             if w=="i"+str(j):
    #                 l[i][j-1]=1
    # return l

def service_reply(msg: str) -> str:
    '''algorithm'''
    return msg