from app.decorators import json_request, authenticated
from app.server import bp

import app.server.controllers.auth as authValidation


@bp.route("/auth/login", methods=["POST"])
@json_request
def login():
    return authValidation.authLogin


@bp.route("/auth/register", methods=["POST"])
@json_request
def register():
   return authValidation.authRegister


@bp.route("/auth/refresh", methods=["GET"])
@authenticated
def refresh():
    return authValidation.authRefresh


@bp.route("/auth/logout", methods=["POST"])
def logout():
    return authValidation.authLogout


@bp.before_app_request
def load_logged_user():
    authValidation.load_logged_user
