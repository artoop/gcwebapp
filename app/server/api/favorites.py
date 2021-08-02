import datetime
import json
import traceback
import app.server.validation.favorites as favoriteValidation

from flask import request, jsonify, session, g, current_app
from werkzeug.security import check_password_hash, generate_password_hash
from bson import ObjectId
from os import listdir, path, mkdir


from app.decorators import json_request, authenticated
from app.db import get_db

from app.server import bp


@bp.route("/favorites", methods=["GET"])
@authenticated
def get_favorites():
    db = get_db()

    favorites = db.favorites.find({"user_id": g.user["_id"], "active": True}, {"game_id": 1})

    platforms_by_id = {p["_id"]: p for p in db.platforms.find({})}
    wishlist_by_id = [k["game_id"] for k in db.wishlist.find({"user_id": g.user["_id"], "active": True}, {"game_id": 1})]

    game_ids = [k["game_id"] for k in favorites]

    games = [{**k, "favorite": True, "wishlist": k["_id"] in wishlist_by_id, "platforms": [platforms_by_id[j] for j in k['platforms']]} for k in db.games.find({
        "_id": {
            "$in": game_ids
        }
    })]

    return jsonify({
        "success": True,
        "data": {
            "favorites": games
        }
    })


@bp.route("/favorites", methods=["POST"])
@json_request
def post_favorites():
    favoriteValidation.favorite()