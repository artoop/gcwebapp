from flask import request, jsonify, session, g
from werkzeug.security import check_password_hash, generate_password_hash
from bson import ObjectId

from app.decorators import json_request, authenticated
from app.db import get_db

from app.server import bp

import string

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