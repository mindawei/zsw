# -*- coding: utf-8 -*-
from pymongo import MongoClient
import json

# 连接
conn = MongoClient('localhost', 27017)
# 连接数据库
db = conn.p2p

# 资讯类型

# 新闻入库
db.news.remove()
data = json.load(open('static/data/raw/news.json', 'r',encoding='utf-8'))
db.news.insert(data)
print("now the number of news is:%d" % db.news.count())

# 政策入库
db.policy.remove()
data = json.load(open('static/data/raw/policy.json', 'r',encoding='utf-8'))
db.policy.insert(data)
print("now the number of policy is:%d" % db.policy.count())

# 观点入库
db.opinion.remove()
data = json.load(open('static/data/raw/opinion.json', 'r',encoding='utf-8'))
db.opinion.insert(data)
print("now the number of opinion is:%d" % db.opinion.count())


# 平台部分数据入库
db.platform.remove()
data = json.load(open('static/data/raw/all_platform_mongodb_data.json', 'r'))
for platform_name in data:
    item = data[platform_name]
    item['platform_name'] = platform_name
    db.platform.insert(item)
print("now the number of platform is:%d" % db.platform.count())

# 初始用户
db.user.remove();
db.user.insert({'username': 'mdw', 'password': '123'})
print("now the number of user is:%d" % db.user.count())

