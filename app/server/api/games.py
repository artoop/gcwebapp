import datetime
import json
import traceback
import app.server.validation.games as gameValidation

from flask import request, jsonify, session, g, current_app
from werkzeug.security import check_password_hash, generate_password_hash
from bson import ObjectId
from os import listdir, path, mkdir

from app.decorators import json_request, authenticated
from app.db import get_db



from app.server import bp


@bp.route("/games/<code>", methods=["GET"])
@authenticated
def get_game(code):
    db = get_db()

    game = db.games.find_one({"code": code})

    if not game:
        return jsonify({
            "success": False
        })

    platforms_by_id = {k['_id']: k for k in db.platforms.find({
        "active": {
            "$ne": False
        }
    })}

    game["platforms"] = [platforms_by_id[k] for k in game["platforms"]]

    return jsonify({
        "success": True,
        "data": {
            "game": game
        }
    })



@bp.route("/games", methods=["GET"])
@authenticated
def get_games():
    db = get_db()

    platforms_by_id = {p["_id"]: p for p in db.platforms.find({})}
    favorites_by_id = [k["game_id"] for k in db.favorites.find({"user_id": g.user["_id"], "active": True}, {"game_id": 1})]
    wishlist_by_id = [k["game_id"] for k in db.wishlist.find({"user_id": g.user["_id"], "active": True}, {"game_id": 1})]



    games = []

    for game in db.games.find({
        "active": True
    }):
        game["platforms"] = [platforms_by_id[p] for p in game["platforms"]]
        game["favorite"] = game["_id"] in favorites_by_id
        game["wishlist"] = game["_id"] in wishlist_by_id
        games.append(game)

    return jsonify({
        "success": True,
        "data": {
            "games": games
        }
    })

@bp.route("/games", methods=["POST"])
def post_games():
    return gameValidation.game()