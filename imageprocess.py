import os
import base64
import pymysql
from datetime import datetime


def _connect():
    return pymysql.connect(host="localhost", user="root", password="root", database="video",
                           charset='utf8', use_unicode=True, max_allowed_packet=24 * 1024 * 1024 * 1024)


class Database:
    def __init__(self):
        self.cursor = None


    def create_slx(self, tablename):  # 创建图片表格
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """
                CREATE TABLE IF NOT EXISTS %s(

                id        INT(11)        NOT NULL,
                streamnum   VARCHAR(255) NOT NULL,
                date      DATETIME       NOT NULL,
                image      longblob

                )CHARACTER SET utf8 COLLATE utf8_general_ci
                """ % tablename
            self.cursor.execute(sql)
            connection.commit()
        finally:
            connection.close()

    def insert_image(self):  # 将文件夹内所有图像全部插入数据库，插入完成后删除图像
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            folder_path = 'app/static/images/picture'  # 文件夹路径
            for filename in os.listdir(folder_path):
                if filename.endswith('.jpg') or filename.endswith('.png'):
                    # 分割文件名
                    name_parts = filename.split('.')
                    # 获取test1部分的数字
                    streamnum = ''.join(filter(str.isdigit, name_parts[0]))
                    sql1 = """SELECT count(*) FROM picture"""
                    self.cursor.execute(sql1)
                    count = self.cursor.fetchone()[0]
                    id = count + 1
                    sql2 = "insert into picture(id, streamnum, date, image) values(%s,%s,%s,%s)"
                    date = datetime.now()
                    with open(os.path.join(folder_path, filename), 'rb') as f:
                        image_data = f.read()
                    image_base64 = base64.b64encode(image_data).decode('utf-8')
                    image = f'data:image/jpeg;base64,{image_base64}'
                    imagee = (id, streamnum, date, image)
                    self.cursor.execute(sql2, imagee)
                    connection.commit()
                    os.remove(os.path.join(folder_path, filename))
        finally:
            connection.close()

    def get_image(self, where_condition):
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select * from picture where %s""" % where_condition
            self.cursor.execute(sql)
            image = self.cursor.fetchone()[2]
            return image.decode()
        finally:
            connection.close()

    def get_onevideoimage(self, where_condition):
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select image from picture where %s ORDER BY id DESC LIMIT 20""" % where_condition
            self.cursor.execute(sql)
            images = self.cursor.fetchall()
            decoded_images = []
            for image in images:
                image_data = base64.b64decode(image[0])
                decoded_image = base64.b64encode(image_data).decode('utf-8')
                decoded_image = decoded_image.replace('dataimage/jpegbase64', '')
                decoded_images.append(decoded_image)
            return decoded_images
        finally:
            connection.close()

    def create_slxstream(self, tablename):  # 创建表格
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """
                CREATE TABLE IF NOT EXISTS %s(
                id            INT(11)          NOT NULL,
                streamname    VARCHAR(255)     NOT NULL,
                stream        VARCHAR(255)     NOT NULL,
                datetime       VARCHAR(255)        NOT NULL

                )CHARACTER SET utf8 COLLATE utf8_general_ci
                """ % tablename
            self.cursor.execute(sql)
        finally:
            connection.close()

    def insert_stream(self, streamname, stream):
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql1 = """SELECT count(*) FROM streams"""
                self.cursor.execute(sql1)
                count = self.cursor.fetchone()[0]
                id = count + 1
                print('--now-')
                sql = "insert into streams(id,streamname, stream,datetime) values(%s,%s,%s,%s)"
                now = datetime.now()
                print(now)
                print('--cn_date--')
                cn_date = now.strftime("%Y-%m-%d %H:%M:%S")
                print(cn_date)
                print('======')
                print(cn_date)
                stm = (id, streamname, stream, cn_date)
                self.cursor.execute(sql, stm)
                connection.commit()
                return 'Success'
            except:
                return 'Fail'
        finally:
            connection.close()

    def get_stream(self, where_condition):
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select * from streams where %s""" % where_condition
            self.cursor.execute(sql)
            streams = self.cursor.fetchone()[1]
            return streams
        finally:
            connection.close()

    def get_allstream(self):
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
        finally:
            connection.close()

    def delete_stream(self, video_id):
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql = """DELETE FROM streams WHERE id=%s""" % video_id
                self.cursor.execute(sql)
                sql1 = """update streams set id=id-1 where id>%s""" % video_id
                self.cursor.execute(sql1)
                connection.commit()
                return 'Success'
            except:
                return 'Fail'
        finally:
            connection.close()

    def update_stream(self, updateid, updatestreamname, updatestream):
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            try:
                sql = """update streams set streamname= %s, stream = %s where id=%s"""
                values = (updatestreamname, updatestream, updateid)
                self.cursor.execute(sql, values)
                connection.commit()
                return 'Success'
            except:
                return 'Fail'
        finally:
            connection.close()

    def streamlistquery(self):
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
                temp_dict = {}
                # 将每个列和相应的值添加到字典中
                temp_dict["id"] = row[0]
                temp_dict["streamname"] = row[1]
                temp_dict["stream"] = row[2]
                temp_dict["datetime"] = row[3]
                data.append(temp_dict)
            return data
        finally:
            connection.close()

    def userlistquery(self):
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select * from user"""
            self.cursor.execute(sql)
            users = self.cursor.fetchall()
            data = []
            for row in users:
                temp_dict = {}
                # 将每个列和相应的值添加到字典中
                temp_dict["id"] = row[0]
                temp_dict["username"] = row[1]
                temp_dict["role"] = row[6]
                data.append(temp_dict)
            return data
        finally:
            connection.close()

    def admin(self, current_user):
        connection = _connect()
        self.cursor = connection.cursor()
        try:
            sql = """select email from user WHERE username = %s"""
            values = current_user
            self.cursor.execute(sql, values)
            email = self.cursor.fetchone()[0]
            sql1 = """select phone from user WHERE username = %s"""
            values1 = current_user
            self.cursor.execute(sql1, values1)
            phone = self.cursor.fetchone()[0]
            sql2 = """select username from user WHERE username = %s"""
            values2 = current_user
            self.cursor.execute(sql2, values2)
            username = self.cursor.fetchone()[0]
            data = []
            temp_dict = {}
            # 将每个列和相应的值添加到字典中
            temp_dict["username"] = username
            temp_dict["email"] = email
            temp_dict["phone"] = phone
            data.append(temp_dict)
            return data
        finally:
            connection.close()


def read_image(filepath):
    with open(filepath, 'rb') as f:
        data = f.read()
        b64_data = base64.b64encode(data)
        return b64_data.decode('utf-8')


database = Database()
database.create_slx("picture")
database.create_slxstream("streams")