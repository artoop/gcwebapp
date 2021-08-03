import app.server.controllers.favorites as favoriteValidation

from app.server import bp

@bp.route("/favorites", methods=["GET"])
def get_favorites():
    return favoriteValidation.get_favorites


@bp.route("/favorites", methods=["POST"])
def post_favorites():
    favoriteValidation.favorite()