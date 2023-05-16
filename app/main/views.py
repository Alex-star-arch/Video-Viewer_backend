import json

import requests

from app import get_logger, get_config
import math
from flask import g, render_template, redirect, url_for, flash, request, jsonify
from flask_login import login_required, current_user
from app import utils
from app.models import CfgNotify, User
from app.main.forms import Useredit, UserForm
# ,StatDailySite小渔村，不会用
from . import main
import pymysql
# from cretablestrems import *
from imageprocess import *

# from app.utils import Pagination
#
# conn = pymysql.connect(host="127.0.0.1", user="root", password="123456", database="test", charset='utf8',
#                            use_unicode=True)
logger = get_logger(__name__)
cfg = get_config()


# 通用列表查询
def common_list(DynamicModel, view):
    # 接收参数
    action = request.args.get('action')
    id = request.args.get('id')
    id.keep_alive = False
    page = int(request.args.get('page')) if request.args.get('page') else 1
    page.keep_alive = False
    length = int(request.args.get('length')) if request.args.get('length') else cfg.ITEMS_PER_PAGE

    # 删除操作
    if action == 'del' and id:
        try:
            DynamicModel.get(DynamicModel.id == id).delete_instance()
            flash('删除成功')
        except:
            flash('删除失败')

    # 查询列表
    query = DynamicModel.select()
    total_count = query.count()

    # 处理分页
    if page: query = query.paginate(page, length)

    dict = {'content': utils.query_to_list(query), 'total_count': total_count,
            'total_page': math.ceil(total_count / length), 'page': page, 'length': length}
    return render_template(view, form=dict, current_user=current_user)


# 通用单模型查询&新增&修改
def common_edit(DynamicModel, form, view):
    id = request.args.get('id', '')
    if id:
        # 查询
        model = DynamicModel.get(DynamicModel.id == id)
        if request.method == 'GET':
            utils.model_to_form(model, form)
        # 修改
        if request.method == 'POST':
            if form.validate_on_submit():
                utils.form_to_model(form, model)
                model.save()
                flash('修改成功')
            else:
                utils.flash_errors(form)
    else:
        # 新增
        if form.validate_on_submit():
            model = DynamicModel()
            utils.form_to_model(form, model)
            model.save()
            flash('保存成功')
        else:
            utils.flash_errors(form)
    return render_template(view, form=form, current_user=current_user)


# 注册 common_list 视图函数
@main.route('/user')
def user():
    return common_list(User, 'user.html')


# 注册 common_edit 视图函数
@main.route('/user/edit', methods=['GET', 'POST'])
def user_edit():
    form = UserForm(request.form)
    return common_edit(User, form, 'user_edit.html')


# 根目录跳转
@main.route('/', methods=['GET'])
@login_required
def root():
    return redirect(url_for('main.index'))


# 首页
@main.route('/index', methods=['GET'])
@login_required
def index():
    return render_template('index.html', current_user=current_user)

@main.route('/indexsuper', methods=['GET'])
@login_required
def indexsuper():
    return render_template('indexsuper.html', current_user=current_user)


# 通知方式查询
@main.route('/notifylist', methods=['GET', 'POST'])
@login_required
def notifylist():
    return common_list(CfgNotify, 'notifylist.html')

######返回所有视频流
@main.route('/allvideolist', methods=['GET'])
def allvideolist():
    getallstream = jsonify(database.get_allstream())
    return getallstream


######返回视频分析图片流
@main.route('/videoimage', methods=['GET'])
def videoimage():
    database.insert_image()
    video_id = request.args.get('videoid')
    video_id = 'streamnum=' + video_id
    pictures = database.get_onevideoimage(video_id)
    return jsonify(pictures)


######增加视频流
@main.route('/videolistadd', methods=['POST'])
def videolistadd():
    # streamname = request.form.get('streamname')
    # stream = request.form.get('stream')
    streamname = json.loads(request.get_data().decode('utf-8'))['streamname']
    stream = json.loads(request.get_data().decode('utf-8'))['stream']
    result = database.insert_stream(streamname, stream)
    return jsonify(result)


######删除视频流
@main.route('/videolistdelete', methods=['POST'])
def videolistdelete():
    video_id = json.loads(request.get_data().decode('utf-8'))['videoid']
    result = database.delete_stream(video_id)
    return jsonify(result)


######视频流列表修改
@main.route('/videolistupdate', methods=['POST'])
def videolistupdate():
    updateid = json.loads(request.get_data().decode('utf-8'))['videoid']
    updatestreamname = json.loads(request.get_data().decode('utf-8'))['streamname']
    updatestream = json.loads(request.get_data().decode('utf-8'))['stream']
    result = database.update_stream(updateid, updatestreamname, updatestream)
    return jsonify(result)


######视频流列表查询
@main.route('/videolistquery', methods=['GET'])
def videolistquery():
    result = database.streamlistquery()
    return jsonify(result)

@main.route('/addClock', methods=['POST'])
def addClock():
    hour=int(request.form['hour'])
    minute=int(request.form['minute'])
    form = {
        'hour': hour,
        'minute': minute,
    }
    url="http://127.0.0.1:5001/clock"
    r=requests.post(url,form)
    # result = database.streamlistquery()
    return "success"

######用户列表查询
@main.route('/userlistquery', methods=['GET'])
def userlistquery():
    result = database.userlistquery()
    return jsonify(result)

# ######用户界面
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
        result = database.admin(text)
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