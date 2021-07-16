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


@bp.route("/wishlist", methods=["GET"])
@authenticated
def get_wishlist():
    db = get_db()

    wishlist = db.wishlist.find({"user_id": g.user["_id"], "active": True}, {"game_id": 1})

    platforms_by_id = {p["_id"]: p for p in db.platforms.find({})}
    favorites_by_id = [k["game_id"] for k in db.favorites.find({"user_id": g.user["_id"], "active": True}, {"game_id": 1})]

    game_ids = [k["game_id"] for k in wishlist]

    games = [{**k, "wishlist": True, "favorite": k["_id"] in favorites_by_id, "platforms": [platforms_by_id[j] for j in k['platforms']]} for k in db.games.find({
        "_id": {
            "$in": game_ids
        }
    })]

    return jsonify({
        "success": True,
        "data": {
            "wishlist": games
        }
    })


@bp.route("/wishlist", methods=["POST"])
@json_request
@authenticated
def post_wishlist():
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
