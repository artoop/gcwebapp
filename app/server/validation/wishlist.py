import datetime
import json
import traceback


from flask import request, jsonify, session, g, current_app
from werkzeug.security import check_password_hash, generate_password_hash
from bson import ObjectId
from os import listdir, path, mkdir

from app.decorators import json_request, authenticated
from app.db import get_db

from app.server import bp


def wishlist():
    db = get_db()

    data = request.json

    db.wishlist.update_one({
        "game_id": ObjectId(data["game_id"]),
        "user_id": g.user["_id"]
    }, {
        "$set": {
            "active": data["active"]
        },
        "$setOnInsert": {
            "created_at": datetime.datetime.utcnow()
        }
    }, upsert=True)

    return jsonify({
        "success": True
    })
