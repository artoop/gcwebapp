from flask import request, jsonify, session, g
from werkzeug.security import check_password_hash, generate_password_hash
from bson import ObjectId

from app.decorators import json_request, authenticated
from app.db import get_db

from app.server import bp

import string
import app.server.validation.auth as authValidation


@bp.route("/auth/login", methods=["POST"])
def login():
    return authValidation.authLogin()


@bp.route("/auth/register", methods=["POST"])
def register():
   return authValidation.authRegister


@bp.route("/auth/refresh", methods=["GET"])
@authenticated
def refresh():
    if not g.user:
        return jsonify({
            "success": False,
            "message": "Refreshed"
        })

    return jsonify({
        "success": True,
        "message": "Refreshed",
        "data": {
            "user": {
                "username": g.user["username"],
                "groups": g.user.get("groups", ["user"])
            }
        }
    })


@bp.route("/auth/logout", methods=["POST"])
def logout():
    return authValidation.authLogout()

    


# load user
@bp.before_app_request
def load_logged_user():
    user_id = session.get("user_id")

    if not user_id:
        g.user = None
    else:
        db = get_db()

        g.user = db.users.find_one({
            "_id": ObjectId(user_id)
        })


def is_user_request_valid(data, check_exists=True):
    username = data.get("username")
    password = data.get("password")

    if not username:
        return False

    if check_exists is True:
        db = get_db()
        user = db.users.find_one({
            "username": username
        })

        if user:
            return False

    if not password:
        return False

    return True


def validate_username(username: str) -> bool:
    """ Validate an username

        @param username : str \n
        @return : bool
    """

    valid_characters = string.ascii_uppercase + string.ascii_lowercase + string.digits + '_'

    if not all([False for k in username if k not in valid_characters]):
        return False

    return True


def validate_password(password: str) -> bool:
    """ Validate a password

        @param password : str \n
        @return : bool
    """

    valid_characters = string.ascii_uppercase + string.ascii_lowercase + string.digits + "_-?!#@*&"

    if not all([False for k in password if k not in valid_characters]):
        return False

    return True
