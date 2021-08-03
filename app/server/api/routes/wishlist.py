import app.server.controllers.wishlist as wishlistValidation

from app.server import bp


@bp.route("/wishlist", methods=["GET"])
def get_wishlist():
    return wishlistValidation.get_wishlist


@bp.route("/wishlist", methods=["POST"])
def post_wishlist():
    return wishlistValidation.wishlist()