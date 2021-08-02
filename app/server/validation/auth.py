from flask import request, jsonify, session, g
from werkzeug.security import check_password_hash, generate_password_hash
from bson import ObjectId

from app.decorators import json_request, authenticated
from app.db import get_db

from app.server import bp

import string


@json_request
def authLogin():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    if not is_user_request_valid(data, False):
        return jsonify({
            "success": False,
            "message": "Missing username or password"
        }), 400

    if not validate_username(data.get("username", "")):
        return jsonify({
            "success": False,
            "message": "Bad username"
        }), 400

    db = get_db()

    user = db.users.find_one({
        "username": username
    })

    if user is None:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    # check for password match
    if not check_password_hash(user["password"], password):
        return jsonify({
            "success": False,
            "message": "Username or password don't match"
        }), 400

    # clear and set new session
    session.clear()
    session["user_id"] = str(user["_id"])

    return jsonify({
        "success": True,
        "message": "Logged in",
        "data": {
            "user": {
                "username": user["username"],
                "groups": user.get("groups", ["user"])
            }
        }
    }), 200


@json_request
def authRegister():
    data = request.json

    # check valid request
    if not is_user_request_valid(data):
        return jsonify({
            "success": False,
            "message": "User already exists"
        }), 400

    if not validate_username(data.get("username", "")):
        return jsonify({
            "success": False,
            "message": "Bad username"
        }), 400

    if not validate_password(data.get("password", "")):
        return jsonify({
            "success": False,
            "message": "Bad password"
        }), 400

    db = get_db()

    password = generate_password_hash(data["password"])
    del data["password"]

    # insert new user
    db.users.insert_one({
        **data,
        "password": password
    })

    return jsonify({
        "success": True,
        "message": "Registered successfully"
    }), 201

def authLogout():
    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out"
    })