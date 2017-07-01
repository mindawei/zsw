# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import json
import time

app = Flask(__name__)

# 数据库连接
conn = MongoClient('localhost', 27017)
db = conn.p2p


@app.route('/')
@app.route('/home')
def home():
    return render_template("home.html")


@app.route('/djs')
def djs():
    return render_template("djs.html")


@app.route('/kzx')
def kzx():
    return render_template("kzx.html")


@app.route('/cpt')
def cpt():
    return render_template("cpt.html")


@app.route('/xtz')
def xtz():
    return render_template("xtz.html")


@app.route('/sign_in')
def sign_in():
    return render_template("sign_in.html")


@app.route('/grzx')
def grzx():
    return render_template("grzx.html")


# 获取指定个数新闻列表
@app.route('/info/<type>/list/<int:size>', methods=['GET'])
def info_type_list(type, size):
    type_list = list()
    for line in db[type].find():
        type_list.append(line)
        if len(type_list) >= size:
            break
    data_info = {"type_list": type_list}
    return jsonify(data_info)


# 分页获取 current=0&rowCount=15
@app.route('/info/<type>/list/current=<int:cur>&rowCount=<int:rows>', methods=['GET'])
def info_type_list_sub(type, cur, rows):
    type_list = list()
    start_num = cur * rows
    end_num = (cur + 1) * rows
    num = 0
    for line in db[type].find():
        if (num >= start_num) and (num < end_num):
            type_list.append(line)
        num += 1
        if num >= end_num:
            break
    data_info = {"type_list": type_list}
    return jsonify(data_info)


# 获取指定个数新闻列表
@app.route('/info/<type>/list/size', methods=['GET'])
def info_type_list_size(type):
    data_info = {"list_size": db[type].count()}
    return jsonify(data_info)


# 显示新闻详细的信息
@app.route('/info/<type>/<id>', methods=['GET'])
def info_news_detail(type, id):
    line = db[type].find_one({'_id': id})
    line['type'] = type
    return render_template('info_type_detail.html', data_info=line)


@app.route('/info/<type>', methods=['GET'])
def info_news(type):
    return render_template("info_type.html", type=type)


# 获取某一平台信息
@app.route('/platform/info/<platform_name>', methods=['GET'])
def platform_info(platform_name):
    platform_info = get_platform_detail_info(platform_name)
    return jsonify(platform_info)


def get_platform_detail_info(platform_name):
    result = db.platform.find_one({'platform_name': platform_name})
    if result is None:
        return {}
    platform_dict = dict()
    # 基本信息
    platform_dict['basic'] = result['basic']
    # 基本信息
    platform_dict['company_info'] = result['company_info']
    # 相关图表
    platform_dict['chart'] = result['chart']
    # 最新新闻
    platform_dict['news'] = result['news']
    # 相关新闻
    platform_dict['related'] = result['related']
    # 评论
    platform_dict['reviews'] = result['reviews']
    return platform_dict


@app.route('/search/<platform_name>', methods=['GET'])
def search_info(platform_name):
    result = db.platform.find_one({'platform_name': platform_name})
    if result is None:
        return render_template("search_not_found.html")
    return render_template("search_platform_info.html", platform_name=platform_name)


# 登录验证
@app.route('/sign_in/username=<username>&password=<password>', methods=['GET'])
def sign_in_valid(username, password):
    result = db.user.find_one({'username': username, 'password': password})
    if result is None:
        return jsonify({'result': '0'})
    else:
        return jsonify({'result': '1'})


# 获得用户信息
@app.route('/user/<username>', methods=['GET'])
def uesr_info(username):
    result = db.user.find_one({'username': username})
    user_info = {
        'platform_names': result['platform_names']
    }
    return jsonify(user_info)


@app.route('/register')
def register():
    return render_template("register.html")


@app.route('/register/username=<username>&password=<password>', methods=['GET'])
def register_valid(username, password):
    result = db.user.find_one({'username': username})
    if result is None:
        db.user.insert({'username': username, 'password': password})
        return jsonify({'result': '1'})
    else:
        return jsonify({'result': '0'})


@app.route('/topic/add/username=<username>&title=<title>&description=<description>', methods=['GET'])
def topic_add(username, title, description):
    iso_time_format = '%Y-%m-%d %X'
    create_time = time.strftime(iso_time_format, time.localtime())
    db.djs_topic.insert(
        {'_id': username + " " + create_time, 'title': title, 'description': description, 'create_time': create_time,
         'username': username})
    return jsonify({'result': '1'})


@app.route('/topic/get/all', methods=['GET'])
def topic_get_all():
    topics = []
    for topic in db.djs_topic.find():
        topics.append(topic)
    return jsonify({'topics': topics})


@app.route('/topic/get/one/<topic_id>')
def topic_get_one(topic_id):
    topic = db.djs_topic.find_one({'_id': topic_id})
    return jsonify({'topic': topic})


@app.route('/topic/get/mine/<username>')
def topic_get_mine(username):
    topics = []
    for topic in db.djs_topic.find({'username': username}):
        topics.append(topic)
    return jsonify({'topics': topics})


@app.route('/comments/get/mine/<username>')
def comments_get_mine(username):
    comments = []
    for comment in db.djs_topic_comment.find({'username': username}):
        topic = db.djs_topic.find_one({'_id': comment['topic_id']})
        comment['title'] = topic['title']
        comments.append(comment)
    return jsonify({'comments': comments})


@app.route('/comment/add/username=<username>&topic_id=<topic_id>&content=<content>', methods=['GET'])
def comment_add(username, topic_id, content):
    iso_time_format = '%Y-%m-%d %X'
    create_time = time.strftime(iso_time_format, time.localtime())
    db.djs_topic_comment.insert(
        {'_id': username + " " + topic_id + " " + create_time, 'topic_id': topic_id, 'content': content,
         'create_time': create_time, 'username': username})
    return jsonify({'result': '1'})


@app.route('/topics/delete/one/<topic_id>')
def topic_delete(topic_id):
    db.djs_topic.remove({"_id": topic_id})
    db.djs_topic_comment.remove({"topic_id": topic_id})
    return jsonify({'result': '1'})


@app.route('/comments/delete/one/<comment_id>')
def comment_delete(comment_id):
    db.djs_topic_comment.remove({"_id": comment_id})
    return jsonify({'result': '1'})


@app.route('/topic/get/comments/<topic_id>')
def topic_get_comments(topic_id):
    comments = []
    for commnet in db.djs_topic_comment.find({'topic_id': topic_id}):
        comments.append(commnet)
    return jsonify({'comments': comments})


@app.route('/djs/topic/<topic_id>')
def djs_topic(topic_id):
    return render_template("djs_topic.html", topic_id=topic_id)


@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80, threaded=True)
