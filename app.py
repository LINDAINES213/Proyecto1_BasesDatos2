from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
import json

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/demo2"
mongo = PyMongo(app)
CORS(app)

db = mongo.db.demo2

@app.route("/", methods=["GET", "POST"])
def getpost():
    if request.method == "GET":
        o = []
        for i in db.find():
            o.append({"_ID": str(ObjectId(i["_id"])), "name":i["name"], "email":i["email"], "password":i["password"]})
        return jsonify(o)
    elif request.method == "POST":
        id = db.insert_one({"name": request.json["name"], "email": request.json["email"], "password": request.json["password"]})
        inserted_id = id.inserted_id
        return jsonify({"_id": str(inserted_id)})
        
@app.route('/<id>', methods=["DELETE", "PUT"])
def deleteput(id):
    if request.method == "DELETE":
        db.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Deleted"})
    elif request.method == "PUT":
        db.update_one({"_id": ObjectId(id)}, {"$set":{
            "name": request.json["name"],
            "email": request.json["email"],
            "password": request.json["password"]
        }})
        return jsonify({"message": "Updated"})