from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Length


class LoginForm(FlaskForm):
    username = StringField('用户名', validators=[DataRequired(), Length(1, 64), ])
    password = PasswordField('密码', validators=[DataRequired()])
    rememberme = BooleanField('记住我')
    submit = SubmitField('提交')


class RegisterForm(FlaskForm):  # 3.11
    username = StringField('用户名', validators=[DataRequired(), Length(1, 64), ])
    password = PasswordField('密码', validators=[DataRequired()])
    againpassword = PasswordField('确认密码', validators=[DataRequired()])
    phone = StringField('电话号', validators=[DataRequired(), Length(1, 64), ])
    email = StringField('邮箱', validators=[DataRequired(), Length(1, 64), ])
    submit = SubmitField('提交')

class RetrieveForm(FlaskForm):  # 3.12
    username = StringField('用户名', validators=[DataRequired(), Length(1, 64), ])
    phone = StringField('注册电话号', validators=[DataRequired(),Length(1, 64)])
    email = StringField('注册邮箱', validators=[DataRequired(), Length(1, 64), ])
    password = PasswordField('密码', validators=[DataRequired()])
    submit = SubmitField('提交')
