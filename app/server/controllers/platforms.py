import datetime

from flask import request, jsonify, current_app
from os import listdir, path
from app.decorators import json_request, authenticated
from app.db import get_db

@authenticated
def get_platforms():
    db = get_db()

    platforms = list(db.platforms.find({
        "active": True
    }))

    return jsonify({
        "success": True,
        "data": {
            "platforms": platforms
        }
    })


@json_request
@authenticated
def platform():
    db = get_db()

    data = request.json

    db.platforms.insert_one({
        "name": data["name"],
        "acronym": data["acronym"],
        "icon": data["icon"],
        "active": True,
        "created_at": datetime.datetime.utcnow()
    })

    return jsonify({
        "success": True
    })


@authenticated
def get_platforms_icons():
    list_icons = [f"/client/src/icons/platforms/{k}" for k in listdir(path.join(current_app.static_folder, "src/icons/platforms"))]

    return jsonify({
        "success": True,
        "data": {
            "icons": list_icons
        }
    })