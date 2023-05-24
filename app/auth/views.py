import json

from flask import request, render_template
from imageprocess import database
from . import auth
from app.utils import gen_jwt,parse_jwt

@auth.route('/', methods=['GET'])
def root():
    return render_template('auth/login.html')

@auth.route('/login', methods=['POST'])
def login():
    # 从请求中获取表单数据
    username = json.loads(request.get_data().decode('utf-8'))['username']
    password = json.loads(request.get_data().decode('utf-8'))['password']
    if database.checkUser(username, password) == 'admin':
        payload = {'username': username, 'role': 'admin'}
        return {'code': 200, 'msg': '登录成功', 'data': {'username': username, 'role': 'admin', 'token': gen_jwt(payload)}}
    elif database.checkUser(username, password) == 'user':
        payload = {'username': username, 'role': 'user'}
        return {'code': 200, 'msg': '登录成功', 'data': {'username': username, 'role': 'user', 'token': gen_jwt(payload)}}
    else:
        return {'code': 400, 'msg': '用户名或密码错误'}


@auth.route('/register', methods=['POST'])
def register():
    username = json.loads(request.get_data().decode('utf-8'))['username']
    password = json.loads(request.get_data().decode('utf-8'))['password']
    if database.checkUser(username, password) != 'Fail':
        return {'code': 400, 'msg': '用户名已存在'}
    else:
        database.registerUser(username, password)
        return {'code': 200, 'msg': '注册成功'}
