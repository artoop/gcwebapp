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