# -*- coding: utf-8 -*-
from pymongo import MongoClient

## 连接
conn = MongoClient('localhost', 27017)
db = conn.p2p

db.djs_topic.remove()
db.djs_topic_comment.remove()