import json
import requests
from flask import render_template, request
from app.dao import *
from . import main

# 根目录跳转
from ..utils import parse_jwt


@main.route('/', methods=['GET'])
def root():
    return render_template('auth/login.html')


@main.route('/usercreate', methods=['GET'])
def usercreate():
    return render_template('auth/register.html')


# 首页
@main.route('/index', methods=['GET'])
def index():
    return render_template('index.html')


# 返回所有视频流
@main.route('/allvideolist', methods=['GET'])
def allvideolist():
    getallstream = database.getStreamUrl()
    return {'code': 200, 'msg': '获取成功', 'data': getallstream}


# 返回视频分析图片流
@main.route('/videoimage', methods=['GET'])
def videoimage():
    database.addImage()
    video_id = request.args.get('videoid')
    pictures = database.getImage(video_id)
    return {'code': 200, 'msg': '获取成功', 'data': pictures}


# 增加视频流
@main.route('/videolistadd', methods=['POST'])
def videolistadd():
    streamname = json.loads(request.get_data().decode('utf-8'))['streamname']
    stream = json.loads(request.get_data().decode('utf-8'))['stream']
    result = database.addStream(streamname, stream)
    if result == 'Fail':
        return {'code': 500, 'msg': '添加失败'}
    else:
        return {'code': 200, 'msg': '添加成功'}


# 删除视频流
@main.route('/videolistdelete', methods=['POST'])
def videolistdelete():
    video_id = json.loads(request.get_data().decode('utf-8'))['videoid']
    result = database.deleteStream(video_id)
    if result == 'Fail':
        return {'code': 500, 'msg': '删除失败'}
    else:
        return {'code': 200, 'msg': '删除成功'}


# 视频流列表修改
@main.route('/videolistupdate', methods=['POST'])
def videolistupdate():
    updateid = json.loads(request.get_data().decode('utf-8'))['videoid']
    updatestreamname = json.loads(request.get_data().decode('utf-8'))['streamname']
    updatestream = json.loads(request.get_data().decode('utf-8'))['stream']
    result = database.updateStream(updateid, updatestreamname, updatestream)
    if result == 'Fail':
        return {'code': 500, 'msg': '修改失败'}
    elif result == 'Exist':
        return {'code': 500, 'msg': '已存在该视频流'}
    else:
        return {'code': 200, 'msg': '修改成功'}


# 视频流列表查询
@main.route('/videolistquery', methods=['GET'])
def videolistquery():
    result = database.getAllStream()
    return {'code': 200, 'msg': '查询成功', 'data': result}


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
    return {'code': 200, 'msg': 'success'}


# 用户列表查询
@main.route('/userlistquery', methods=['POST'])
def userlistquery():
    # 检验JWT
    # bearer token
    token = request.headers.get('Authorization').split(' ')[1]
    payload = parse_jwt(token)
    if payload is None:
        return {'code': 500, 'msg': '请先登录'}
    else:
        role = payload['role']
        if role != 'admin':
            return {'code': 500, 'msg': '您没有权限'}
        else:
            result = database.getAllUser()
            return {'code': 200, 'msg': '查询成功', 'data': result}


@main.route('/userlistupdate', methods=['POST'])
def userlistupdate():
    # 检验JWT
    # bearer token
    token = request.headers.get('Authorization').split(' ')[1]
    payload = parse_jwt(token)
    if payload is None:
        return {'code': 500, 'msg': '请先登录'}
    else:
        role = payload['role']
        if role != 'admin':
            return {'code': 500, 'msg': '您没有权限'}
        else:
            updateid = json.loads(request.get_data().decode('utf-8'))['userid']
            updaterole = json.loads(request.get_data().decode('utf-8'))['role']
            result = database.updateUserRole(updateid, updaterole)
            if result == 'Fail':
                return {'code': 500, 'msg': '修改失败'}
            else:
                return {'code': 200, 'msg': '修改成功'}


@main.route('/imagelistquery', methods=['GET'])
def imagelistquery():
    result = database.getAllImage()
    if result == 'Fail':
        return {'code': 500, 'msg': '查询失败'}
    else:
        return {'code': 200, 'msg': '查询成功', 'data': result}


@main.route('/imagelistdelete', methods=['POST'])
def imagelistdelete():
    image_id = json.loads(request.get_data().decode('utf-8'))['imageid']
    result = database.deleteImage(image_id)
    if result == 'Fail':
        return {'code': 500, 'msg': '删除失败'}
    else:
        return {'code': 200, 'msg': '删除成功'}


# 用户界面
@main.route('/userrole', methods=['POST'])
# @login_required
def userrole():
    token = request.headers.get('Authorization').split(' ')[1]
    payload = parse_jwt(token)
    if payload is None:
        return {'code': 500, 'msg': '请先登录'}
    else:
        useranme = payload['username']
        result = database.getUserRole(useranme)
        return {'code': 200, 'msg': '查询成功', 'data': result}


@main.route('/alertquery', methods=['GET'])
def alertquert():
    result = database.getAlert()
    if (result == 'Fail'):
        return {'code': 500, 'msg': '获取报警信息失败'}
    else:
        return {'code': 200, 'msg': '获取报警信息成功', 'data': result}


@main.route('/alertdelete', methods=['POST'])
def alertdelete():
    stream_id = json.loads(request.get_data().decode('utf-8'))['streamid']
    result = database.deleteAlert(stream_id)
    if (result == 'Fail'):
        return {'code': 500, 'msg': '获取报警信息失败'}
    else:
        return {'code': 200, 'msg': '获取报警信息成功', 'data': result}
