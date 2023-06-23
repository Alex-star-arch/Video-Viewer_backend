import base64
import os
from datetime import datetime
import re
import pymysql


def _connect():
    return pymysql.connect(host="localhost", user="root", password="root", database="video",
                           charset='utf8', use_unicode=True, max_allowed_packet=24 * 1024 * 1024 * 1024)


class Database:
    def __init__(self):
        self.cursor = None

    def createPictureTable(self, TableName):
        # 创建图片表，如果存在则不创建
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """
                CREATE TABLE IF NOT EXISTS %s(

                id        INT(11)        NOT NULL PRIMARY KEY AUTO_INCREMENT,
                streamnum   VARCHAR(255) NOT NULL,
                date      DATETIME       NOT NULL,
                image      longblob

                )CHARACTER SET utf8 COLLATE utf8_general_ci
                """ % TableName
            self.cursor.execute(sql)
            connection.commit()
        except Exception as e:
            print("createPictureTable Error:", e)
        finally:
            connection.close()

    def addImage(self):
        # 将文件夹内所有图像全部插入数据库，插入完成后删除图像
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            folder_path = 'app/static/images/picture'  # 文件夹路径
            for filename in os.listdir(folder_path):
                if filename.endswith('.jpg') or filename.endswith('.png'):
                    # 提取图像文件名
                    index = filename.find(".mp4")
                    if index != -1:
                        filenamep = filename[:index]
                    print("filename:" + filenamep)

                    indexweed = filename.rfind("+")
                    indexweedtail = filename.find(".jpg")
                    if indexweed != -1 and indexweedtail != -1:
                        strweed = filename[indexweed + 1:indexweedtail]
                    print("strweed:" + strweed)
                    match = re.search(r'\+(.*?)\+', filename)
                    if match:
                        streamnum = match.group(1)
                    date = datetime.now()
                    sql2 = "insert into picture(id,streamnum, date, image, weeds) values(0,%s,%s,%s,%s)"
                    with open(os.path.join(folder_path, filename), 'rb') as f:
                        image_data = f.read()
                    image_base64 = base64.b64encode(image_data).decode('utf-8')
                    image = f'data:image/jpeg;base64,{image_base64}'
                    imageTuple = (streamnum, date, image, strweed)
                    self.cursor.execute(sql2, imageTuple)
                    connection.commit()
                    os.remove(os.path.join(folder_path, filename))
        finally:
            connection.close()

    def getImage(self, VideoId):
        # 获取VideoId对应的所有图像
        self.cursor = None
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select image from picture where streamnum = %s"""
            self.cursor.execute(sql, VideoId)
            images = self.cursor.fetchall()
            decoded_images = []
            for image in images:
                image_data = base64.b64decode(image[0])
                decoded_image = base64.b64encode(image_data).decode('utf-8')
                decoded_image = decoded_image.replace('dataimage/jpegbase64', '')
                decoded_images.append(decoded_image)
            return decoded_images
        except Exception as e:
            print("getImage Error:", e)
            return []
        finally:
            connection.close()

    def createStreamTable(self, TableName):
        # 创建流表，如果存在则不创建
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """
                CREATE TABLE IF NOT EXISTS %s(
                id            INT(11)          NOT NULL PRIMARY KEY AUTO_INCREMENT,
                streamname    VARCHAR(255)     NOT NULL,
                stream        VARCHAR(255)     NOT NULL,
                datetime       VARCHAR(255)        NOT NULL

                )CHARACTER SET utf8 COLLATE utf8_general_ci
                """ % TableName
            self.cursor.execute(sql)
            connection.commit()
        except Exception as e:
            print("createStreamTable Error:", e)
        finally:
            connection.close()

    def addStream(self, streamname, stream):
        # 将流插入数据库
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql = """select * from streams where streamname = %s"""
                self.cursor.execute(sql, streamname)
                result = self.cursor.fetchall()
                if result:
                    return 'Exist'
            except Exception as e:
                print("addStream Error:", e)
                return 'Fail'
            try:
                sql = "insert into streams(id,streamname, stream,datetime) values(0,%s,%s,%s)"
                print('--now-')
                now = datetime.now()
                print(now)
                print('--cn_date--')
                cn_date = now.strftime("%Y-%m-%d %H:%M:%S")
                print(cn_date)
                print('======')
                print(cn_date)
                stm = (streamname, stream, cn_date)
                self.cursor.execute(sql, stm)
                connection.commit()
                return 'Success'
            except Exception as e:
                print("addStream Error:", e)
                return 'Fail'
        finally:
            connection.close()

    def getStreamUrl(self):
        # 获取流地址
        self.cursor = None
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select stream from streams"""
            self.cursor.execute(sql)
            streams = self.cursor.fetchall()
            streams = list(streams)
            streamlist = []
            for stream in streams:
                stream = ''.join(stream)
                streamlist.append(stream)
            return streamlist
        except Exception as e:
            print("getStreamUrl Error:", e)
            return []
        finally:
            connection.close()

    def deleteStream(self, video_id):
        # 删除流
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            # 先查询video_id是否存在,存在则删除
            sql = """select * from streams where id = %s"""
            self.cursor.execute(sql, video_id)
            result = self.cursor.fetchall()
            if result:
                sql = """delete from streams where id = %s"""
                self.cursor.execute(sql, video_id)
                connection.commit()
                return 'Success'
            else:
                return 'Fail'
        except Exception as e:
            print("deleteStream Error:", e)
            return 'Fail'
        finally:
            connection.close()

    def updateStream(self, updateid, updatestreamname, updatestream):
        # 更新流
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql = """update streams set streamname= %s, stream = %s where id=%s"""
                values = (updatestreamname, updatestream, updateid)
                self.cursor.execute(sql, values)
                connection.commit()
                return 'Success'
            except Exception as e:
                print("updateStream Error:", e)
                return 'Fail'
        finally:
            connection.close()

    def getAllStream(self):
        # 获取所有流
        self.cursor = None
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select * from streams"""
            self.cursor.execute(sql)
            streams = self.cursor.fetchall()
            data = []
            for row in streams:
                # 创建一个空字典
                # cn_date = row[3].strftime("%Y年%m月%d日 %H时%M分%S秒")
                temp_dict = {"id": row[0], "streamname": row[1], "stream": row[2], "datetime": row[3]}
                # 将每个列和相应的值添加到字典中
                data.append(temp_dict)
            return data
        except Exception as e:
            print("getAllStream Error:", e)
            return []
        finally:
            connection.close()

    def getAllUser(self):
        # 获取所有用户
        self.cursor = None
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select * from user"""
            self.cursor.execute(sql)
            users = self.cursor.fetchall()
            data = []
            for row in users:
                temp_dict = {"id": row[0], "username": row[1], "role": row[6]}
                # 将每个列和相应的值添加到字典中
                data.append(temp_dict)
            return data
        except Exception as e:
            print("getAllUser Error:", e)
            return []
        finally:
            connection.close()

    def getUser(self, current_user):
        # 获取当前用户
        self.cursor = None
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select * from user where username = %s"""
            values = current_user
            self.cursor.execute(sql, values)
            user = self.cursor.fetchone()
            data = []
            temp_dict = {"id": user[0], "username": user[1], "email": user[2], "phone": user[3], "role": user[6]}
            # 将每个列和相应的值添加到字典中
            data.append(temp_dict)
            return data
        except Exception as e:
            print("getUser Error:", e)
            return []
        finally:
            connection.close()

    def updateUser(self, updateid, updateusername, updateemail, updatephone, updatestatus):
        # 更新用户
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql = """update user set username= %s, email = %s, phone = %s, status = %s where id=%s"""
                values = (updateusername, updateemail, updatephone, updatestatus, updateid)
                self.cursor.execute(sql, values)
                connection.commit()
                return 'Success'
            except Exception as e:
                print("updateUser Error:", e)
                return 'Fail'
        finally:
            connection.close()

    def checkUser(self, username, password):
        # 登录
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select * from user where username = %s and password = %s"""
            values = (username, password)
            self.cursor.execute(sql, values)
            result = self.cursor.fetchone()
            if result:
                # 如果是管理员
                if result[6] == 1:
                    return 'admin'
                else:
                    return 'user'
            else:
                return 'Fail'
        except Exception as e:
            print("checkUser Error:", e)
            return 'Fail'
        finally:
            connection.close()

    def isUserExist(self, username):
        # 判断用户是否存在
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select * from user where username = %s"""
            values = username
            self.cursor.execute(sql, values)
            result = self.cursor.fetchone()
            if result:
                return 'Success'
            else:
                return 'Fail'
        except Exception as e:
            print("isUserExist Error:", e)
            return 'Fail'
        finally:
            connection.close()

    def registerUser(self, username, password, email='none', phone='none', status=0, fullname='normal_user'):
        # 注册
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:

                sql = "insert into user(username, password, email, phone,status,fullname) values(%s,%s,%s,%s,%s,%s)"
                stm = (username, password, email, phone, status, fullname)
                self.cursor.execute(sql, stm)
                connection.commit()
                return 'Success'
            except Exception as e:
                print("registerUser Error:", e)
                return 'Fail'
        finally:
            connection.close()

    def getUserRole(self, username):
        # 获取用户角色
        self.cursor = None
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select status from user where username = %s"""
            values = username
            self.cursor.execute(sql, values)
            result = self.cursor.fetchone()
            return result
        except Exception as e:
            print("getUserRole Error:", e)
            return 0
        finally:
            connection.close()

    def updateUserRole(self, userid, role):
        # 更新用户角色
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql = """update user set status = %s where id=%s"""
                values = (role, userid)
                self.cursor.execute(sql, values)
                connection.commit()
                return 'Success'
            except Exception as e:
                print("updateUserRole Error:", e)
                return 'Fail'
        finally:
            connection.close()

    def getAllImage(self):
        # 获取所有图片
        self.cursor = None
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select * from picture"""
            self.cursor.execute(sql)
            images = self.cursor.fetchall()
            data = []
            for row in images:
                image_data = base64.b64decode(row[3])
                decoded_image = base64.b64encode(image_data).decode('utf-8')
                decoded_image = decoded_image.replace('dataimage/jpegbase64', '')
                temp_dict = {"id": row[0], "streamnum": row[1], "datetime": row[2], "image": decoded_image, }
                # 将每个列和相应的值添加到字典中
                data.append(temp_dict)
            return data
        except Exception as e:
            print("getAllImage Error:", e)
            return []
        finally:
            connection.close()

    def deleteImage(self, imageId):
        # 删除图片
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql = """delete from picture where id = %s"""
                values = imageId
                self.cursor.execute(sql, values)
                connection.commit()
                return 'Success'
            except Exception as e:
                print("deleteImage Error:", e)
                return 'Fail'
        finally:
            connection.close()

    def getAlert(self):
        self.cursor = None
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql = """SELECT picture.streamnum, streams.streamname, picture.date, picture.weeds 
                FROM streams INNER JOIN picture ON streams.id = picture.streamnum"""
                self.cursor.execute(sql)
                alert = self.cursor.fetchall()
                alert = [tuple(data) for data in alert]
                modified_list = []
                for tuple_data in alert:
                    if tuple_data[3] is None:
                        continue
                    modified_date = tuple_data[2].strftime("%Y-%m-%d %H:%M:%S")
                    modified_element = tuple_data[3].replace('weeds,', '处草').replace('vines,', '处藤蔓')
                    modified_tuple = tuple_data[:2] + (modified_date,) + (modified_element,) + tuple_data[3:]
                    temp_dict = {"streamid": modified_tuple[0], "streamname": modified_tuple[1],
                                 "datetime": modified_tuple[2],
                                 "warncontent": modified_tuple[3]}
                    modified_list.append(temp_dict)
                return modified_list
            except Exception as e:
                print("getAlert Error:", e)
                return 'Fail'
        finally:
            connection.close()

    def deleteAlert(self, streamnum):
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql = """delete from picture where streamnum = %s"""
                values = streamnum
                self.cursor.execute(sql, values)
                connection.commit()
                return 'Success'
            except Exception as e:
                print("deleteAlert Error:", e)
                return 'Fail'
        finally:
            connection.close()


def read_image(filepath):
    with open(filepath, 'rb') as f:
        data = f.read()
        b64_data = base64.b64encode(data)
        return b64_data.decode('utf-8')


database = Database()
database.createPictureTable("picture")
database.createStreamTable("streams")
