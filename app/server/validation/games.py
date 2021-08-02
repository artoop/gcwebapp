import datetime
import json
import traceback

from flask import request, jsonify, session, g, current_app
from bson import ObjectId
from os import listdir, path, mkdir

from app.decorators import json_request, authenticated
from app.db import get_db
from app.server import bp

@authenticated
def game():
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
