import app.server.controllers.games as gameValidation

from app.server import bp

@bp.route("/games/<code>", methods=["GET"])
def get_game():
    return gameValidation.get_game


@bp.route("/games", methods=["GET"])
def get_games():
    return gameValidation.get_games

@bp.route("/games", methods=["POST"])
def post_games():
    return gameValidation.game()