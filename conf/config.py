import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or '1'
    DB_HOST = 'localhost'
    DB_PORT = 3306
    DB_USER = 'root'
    DB_PASSWD = 'root'
    DB_DATABASE = 'video'
    ITEMS_PER_PAGE = 10
    JWT_AUTH_URL_RULE = '/api/auth'

    # SQLALCHEMY_DATABASE_URI = "mysql://root:123456@127.0.0.1:3306/test"  # 3.11
    # SQLALCHEMY_TRACK_MODIFICATIONS = False  # 是否追踪数据库的修改 #3.11


    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True


class ProductionConfig(Config):
    PRODUCTION = True


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

