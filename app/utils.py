# -*- coding: utf-8 -*-

import html
import json
import datetime
from urllib.parse import unquote
from app.models import CfgNotify
from flask import Response, flash
import math


## 字符串转字典
def str_to_dict(dict_str):
    if isinstance(dict_str, str) and dict_str != '':
        new_dict = json.loads(dict_str)
    else:
        new_dict = ""
    return new_dict


## URL解码
def urldecode(raw_str):
    return unquote(raw_str)


# HTML解码
def html_unescape(raw_str):
    return html.unescape(raw_str)


## 键值对字符串转JSON字符串
def kvstr_to_jsonstr(kvstr):
    kvstr = urldecode(kvstr)
    kvstr_list = kvstr.split('&')
    json_dict = {}
    for kvstr in kvstr_list:
        key = kvstr.split('=')[0]
        value = kvstr.split('=')[1]
        json_dict[key] = value
    json_str = json.dumps(json_dict, ensure_ascii=False, default=datetime_handler)
    return json_str


# 字典转对象
def dict_to_obj(dict, obj, exclude=None):
    for key in dict:
        if exclude:
            if key in exclude:
                continue
        setattr(obj, key, dict[key])
    return obj


# peewee转dict
def obj_to_dict(obj, exclude=None):
    dict = obj.__dict__['_data']
    if exclude:
        for key in exclude:
            if key in dict: dict.pop(key)
    return dict


# peewee转list
def query_to_list(query, exclude=None):
    list = []
    for obj in query:
        dict = obj_to_dict(obj, exclude)
        list.append(dict)
    return list


# 封装HTTP响应
def jsonresp(jsonobj=None, status=200, errinfo=None):
    if status >= 200 and status < 300:
        jsonstr = json.dumps(jsonobj, ensure_ascii=False, default=datetime_handler)
        return Response(jsonstr, mimetype='application/json', status=status)
    else:
        return Response('{"errinfo":"%s"}' % (errinfo,), mimetype='application/json', status=status)


# 通过名称获取PEEWEE模型
def get_model_by_name(model_name):
    if model_name == 'notifies':
        DynamicModel = CfgNotify
    else:
        DynamicModel = None
    return DynamicModel


# JSON中时间格式处理
def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.strftime("%Y-%m-%d %H:%M:%S")
    raise TypeError("Unknown type")


# wtf表单转peewee模型
def form_to_model(form, model):
    for wtf in form:
        model.__setattr__(wtf.name, wtf.data)
    return model


# peewee模型转表单
def model_to_form(model, form):
    dict = obj_to_dict(model)
    form_key_list = [k for k in form.__dict__]
    for k, v in dict.items():
        if k in form_key_list and v:
            field = form.__getitem__(k)
            field.data = v
            form.__setattr__(k, field)


def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash("字段 [%s] 格式有误,错误原因: %s" % (
                getattr(form, field).label.text,
                error
            ))

# //小渔村的分页，不知道能不能用到
def Pagination(page_num,totals):
    ret = {"prev_page": page_num - 1,
           "next_page": page_num + 1,
           "current_page": 0,
           "total_pages": 0,
           "max_page": 0,
           "page_size": 10,
           "totals": totals,
           "offset": 0,
           "page_range": None
           }

    ret["total_pages"] = math.ceil(totals / ret["page_size"])
    ret["max_page"] = ret["total_pages"]


    if page_num <= 1:
        page_num = 1
        ret["prev_page"] = 1
    if page_num >= ret["max_page"]:
        page_num = ret["max_page"]
        ret["next_page"] = ret["max_page"]

    ret["current_page"] = page_num

    if totals == 0:
        ret["offset"] = 0
    else:
        ret["offset"] = (ret["current_page"] - 1) * ret["page_size"]

    page_range = []
    for i in range(1,ret["max_page"]+1):
        page_range.append(i)
    ret["page_range"] = page_range

    return ret