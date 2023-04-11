
from flask import Flask, request, redirect, g ,render_template
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, BooleanField, PasswordField, SelectField, TextAreaField, HiddenField
from wtforms.validators import DataRequired, Length, Email, Regexp, EqualTo

# app = Flask(__name__)
#
# #从配置文件中settings加载配置
# app.config.from_pyfile('settings.py')
# # 将app中的数据库配置加载到app中
# db = SQLAlchemy(app)
# # db = pymysql.connect(host="127.0.0.1", user="root", password="123456", database="test", charset='utf8',
# #                            use_unicode=True)

class Useredit(FlaskForm):
    editphone = StringField('注册电话号', validators=[DataRequired(),Length(1, 64)])
    editemail = StringField('注册邮箱', validators=[DataRequired(),Length(1, 64)])
    submit = SubmitField('提交')

class UserForm(FlaskForm):  # 3.11
    username = StringField('用户名', validators=[DataRequired(), Length(1, 64), ])
    phone = StringField('电话号', validators=[DataRequired(), Length(1, 64), ])
    email = StringField('邮箱', validators=[DataRequired(), Length(1, 64), ])

# # 全站日统计 小渔村的，不会用
# class StatDailySite(db):
#     __tablename__ = 'stat_daily_site'
#
#     id = db.Column(db.Integer, primary_key=True)
#     date = db.Column(db.Date, nullable=False, index=True)
#     total_pay_money = db.Column(db.Numeric(10, 2), nullable=False, comment="当日应收总金额")
#     total_member_count = db.Column(db.Integer, nullable=False,comment="会员总数")
#     total_new_member_count = db.Column(db.Integer, nullable=False,comment="当日新增会员数")
#     total_order_count = db.Column(db.Integer, nullable=False,comment="当日订单数")
#     total_shared_count = db.Column(db.Integer, nullable=False,comment="当日分享数")
#     updated_time = db.Column(db.DateTime, nullable=False)
#     created_time = db.Column(db.DateTime, nullable=False)

