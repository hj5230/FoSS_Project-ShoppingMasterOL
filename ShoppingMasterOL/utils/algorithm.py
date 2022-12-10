import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import pairwise_distances

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

def service_reply(msg: str) -> str:
    '''algorithm'''
    return msg