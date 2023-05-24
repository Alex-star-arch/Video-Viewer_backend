from flask import Blueprint

auth = Blueprint('auth', __name__, template_folder="app/templates/auth", static_folder="app/static")
from . import views
