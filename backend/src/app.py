from flask import Flask
from dotenv import load_dotenv
import os
from pathlib import Path

from src import routes

load_dotenv()

static_folder = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")

# Setup the CA if needed
if os.getenv("CUSTOM_CA_FILE"):
    ca_file = Path("/usr/local/share/ca-certificates") / os.getenv("CUSTOM_CA_FILE")

    if ca_file.is_file():
        os.environ["CURL_CA_BUNDLE"] = str(ca_file)
        os.environ["REQUESTS_CA_BUNDLE"] = str(ca_file)

app = Flask(__name__, static_url_path="/static", static_folder=static_folder)

app.register_blueprint(routes.screens)
app.register_blueprint(routes.projects)
app.register_blueprint(routes.tags)
app.register_blueprint(routes.scrape)
app.register_blueprint(routes.shares)
