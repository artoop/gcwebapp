from flask import Blueprint

# create blueprint
bp = Blueprint('api', __name__, url_prefix="/api")

from .api.routes import auth, favorites, games, platforms, wishlist