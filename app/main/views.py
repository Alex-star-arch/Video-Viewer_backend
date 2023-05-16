import json

import requests
from flask import render_template, request, jsonify
from flask_login import login_required, current_user

from app import get_logger, get_config
from imageprocess import *
from . import main

logger = get_logger(__name__)
cfg = get_config()


# 根目录跳转
@main.route('/', methods=['GET'])
@login_required
def root():
    return render_template('auth/login.html')


# 首页
@main.route('/index', methods=['GET'])
@login_required
def index():
    return render_template('index.html', current_user=current_user)


# 返回所有视频流
@main.route('/allvideolist', methods=['GET'])
def allvideolist():
    getallstream = jsonify(database.getStreamUrl())
    return getallstream


# 返回视频分析图片流
@main.route('/videoimage', methods=['GET'])
def videoimage():
    database.addImage()
    video_id = request.args.get('videoid')
    video_id = 'streamnum=' + video_id
    pictures = database.getAllImage(video_id)
    return jsonify(pictures)


# 增加视频流
@main.route('/videolistadd', methods=['POST'])
def videolistadd():
    # streamname = request.form.get('streamname')
    # stream = request.form.get('stream')
    streamname = json.loads(request.get_data().decode('utf-8'))['streamname']
    stream = json.loads(request.get_data().decode('utf-8'))['stream']
    result = database.addStream(streamname, stream)
    return jsonify(result)


# 删除视频流
@main.route('/videolistdelete', methods=['POST'])
def videolistdelete():
    video_id = json.loads(request.get_data().decode('utf-8'))['videoid']
    result = database.deleteStream(video_id)
    return jsonify(result)


# 视频流列表修改
@main.route('/videolistupdate', methods=['POST'])
def videolistupdate():
    updateid = json.loads(request.get_data().decode('utf-8'))['videoid']
    updatestreamname = json.loads(request.get_data().decode('utf-8'))['streamname']
    updatestream = json.loads(request.get_data().decode('utf-8'))['stream']
    result = database.updateStream(updateid, updatestreamname, updatestream)
    return jsonify(result)


# 视频流列表查询
@main.route('/videolistquery', methods=['GET'])
def videolistquery():
    result = database.getAllStream()
    return jsonify(result)


# 设置时钟
@main.route('/addClock', methods=['POST'])
def addClock():
    hour = int(request.form['hour'])
    minute = int(request.form['minute'])
    form = {
        'hour': hour,
        'minute': minute,
    }
    url = "http://127.0.0.1:5001/clock"
    r = requests.post(url, form)
    # result = database.streamlistquery()
    return "success"


# 用户列表查询
@main.route('/userlistquery', methods=['GET'])
def userlistquery():
    result = database.getAllUser()
    return jsonify(result)


# 用户界面
@main.route('/admin', methods=['GET'])
# @login_required
def admin():
    file = open("user.txt", "r")
    # 读取整个文件内容
    text = file.read()
    # 关闭文件
    file.close()
    # 打印读取的字符串
    print(text)
    result = database.getUser(text)
    return jsonify(result)
# except:
#     file = open("user.txt", "r")
#     # 读取整个文件内容
#     text = file.read()
#     # 关闭文件
#     file.close()
#     # 打印读取的字符串
#     # print(text)
#     # result = database.admin(text)
#     return jsonify(text)
