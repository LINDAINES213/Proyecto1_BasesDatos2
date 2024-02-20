from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
import json

from routes.users_collection import users_bp
from routes.restaurants_collection import restaurants_bp


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://grupoDinamita:GrupoDinamita3@lab03.sutnr1c.mongodb.net/Prueba1"
#app.config["MONGO_URI"] = "mongodb+srv://grupoDinamita:GrupoDinamita3@proyecto01.dge4zeo.mongodb.net/Cook_recipes"
mongo = PyMongo(app)
CORS(app)

app.register_blueprint(users_bp)
app.register_blueprint(restaurants_bp)

db = mongo.db.demo2

@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Funcionanding"})

if __name__ == "__main__":
    app.run(debug=True)