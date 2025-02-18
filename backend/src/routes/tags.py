import json
from pathlib import Path
from flask import Blueprint, jsonify, current_app

blueprint = Blueprint("tags", __name__)


@blueprint.route("/api/tags")
def fetch_tags():
    try:
        tags_json_path = Path(current_app.static_folder) / "common" / "tags.json"

        if tags_json_path.exists():
            # Read JSON file
            with tags_json_path.open("r") as file:
                tags = json.load(file)

                return jsonify({"data": tags.get("tags", [])})
        else:
            return "Tags file not found", 404
    except Exception as e:
        return f"Error fetching tags: {e}", 500
