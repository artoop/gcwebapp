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
# @json_request
@authenticated
def post_games():
    db = get_db()

    data = request.form
    data = json.loads(data.get('data'))

    files = request.files

    if not data.get("title"):
        return jsonify({
            "success": False,
            "message": "No title"
        })

    code = "%08d" % (get_game_code(db), )

    banner = files.get('banner')

    try:
        p = path.join(current_app.static_folder, f"src/images/games/{code}")
        if not path.exists(p):
            mkdir(p)
    except Exception:
        return jsonify({
            "success": False,
            "message": traceback.format_exc()
        })

    try:
        banner_filename = f"banner.{banner.filename.split('.')[-1]}"
        banner.save(path.join(path.join(current_app.static_folder, f"src/images/games/{code}"), banner_filename))
    except Exception:
        print(traceback.format_exc())
        banner_filename = "banner.png"

    image_urls = []
    images = dict(files.lists()).get('images')

    if images:
        for i, img in enumerate(images):
            try:
                img_filename = f"image{i}.{img.filename.split('.')[-1]}"
                img.save(path.join(path.join(current_app.static_folder, f"src/images/games/{code}"), img_filename))
                image_urls.append(f"/client/src/images/games/{code}/{img_filename}")
            except Exception:
                print(traceback.format_exc())
                pass

    db.games.insert_one({
        "code": code,
        "title": data["title"],
        "description": data["description"],
        "platforms": [ObjectId(k) for k in data["platforms"]],
        "developer": ObjectId(data["developer"]) if data.get("developer") else None,
        "publishers": [ObjectId(k) for k in data["publishers"]],
        "tags": [ObjectId(k) for k in data["tags"]],
        "banner_url": f"/client/src/images/games/{code}/{banner_filename}",
        "images_url": image_urls,
        "active": True,
        "created_at": datetime.datetime.utcnow()
    })

    return jsonify({
        "success": True
    })


def get_game_code(db):
    return db.games.count_documents({})
