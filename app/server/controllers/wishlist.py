import datetime

from app.decorators import json_request, authenticated
from flask import request, jsonify, g
from bson import ObjectId
from app.decorators import authenticated
from app.db import get_db

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


@json_request
@authenticated
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
