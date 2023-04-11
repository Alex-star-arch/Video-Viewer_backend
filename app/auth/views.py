from flask import render_template, redirect, request, url_for, flash
from . import auth
from .forms import LoginForm,RegisterForm,RetrieveForm
from app.models import User
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash



@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        try:
            user = User.get(User.username == form.username.data)
            if user.verify_password(form.password.data):
                import os
                file_path = "user.txt"
                os.remove(file_path)
                file = open("user.txt", "w")
                # 要保存的字符串
                text = form.username.data
                file.write(text)
                file.close()
                login_user(user, form.rememberme.data)
                print(type(user.status))
                if user.status == 1:
                    print('yes')
                    return redirect(url_for('main.indexsuper'))##########4.6qsy删除了request.args.get('next') or ，这个有什么用？
                else:
                    print("no")
                    return redirect(request.args.get('next') or url_for('main.index'))
            else:
                flash('用户名或密码错误')
        except:
            flash('用户名不存在')
    return render_template('auth/login.html', form=form)


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('您已退出登录')
    return redirect(url_for('auth.login'))

@auth.route('/register', methods=['GET', 'POST'])
def register():
    form1 = RegisterForm()
    if request.method == 'POST':
        createname = form1.username.data
        createpassword = form1.password.data
        createagainpassword =form1.againpassword.data
        # createphone = form1.phone.data
        # createemail = form1.email.data
        createsubmit = form1.submit.data
        if createpassword != createagainpassword:
            print(createpassword,createagainpassword)
            flash('两次密码不一致')
        else:
            jiami=generate_password_hash(createpassword)
            def insert():
                user = User(username=createname,
                            password=jiami,
                            fullname='zero',
                            email=0, phone=0, status=0)
                user.save()
            insert()
            flash('您已注册成功')
    return render_template('auth/register.html',form1=form1)

# @auth.route('/retrieve', methods=['GET', 'POST'])
# def retrieve():
#     form2 = RetrieveForm()
#     if form2.validate_on_submit():
#         try:
#             user = User.get(User.username == form2.username.data)
#             jiami = generate_password_hash(form2.password.data)
#             if user.phone == form2.phone.data and user.email == form2.email.data:
#                 print('无误')
#                 User.update(password=jiami).where(User.username==form2.username.data).execute()
#                 flash('修改成功')
#             else:
#                 flash('用户信息有误')
#         except:
#             flash('用户不存在')
#     return render_template('auth/retrieve.html',form2=form2)

