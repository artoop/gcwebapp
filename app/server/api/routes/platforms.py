import app.server.controllers.platforms as platformValidation

from app.server import bp


@bp.route("/platforms", methods=["GET"])
def get_platforms():
    return platformValidation.get_platforms


@bp.route("/platforms", methods=["POST"])
def post_platforms():
    return platformValidation.platform()    


@bp.route("/platforms/icons", methods=["GET"])
def get_platforms_icons():
    return platformValidation.get_platforms_icons
