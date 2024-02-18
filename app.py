from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId
import json

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://grupoDinamita:GrupoDinamita3@lab03.sutnr1c.mongodb.net/demo2"
#app.config["MONGO_URI"] = "mongodb+srv://grupoDinamita:GrupoDinamita3@proyecto01.dge4zeo.mongodb.net/Cook_recipes"
mongo = PyMongo(app)
CORS(app)

#db = mongo.db.international_recipes
db = mongo.db.demo2

@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Funcionanding"})

@app.route("/ver", methods=["GET", "POST"])
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
    
@app.route('/edit/<id>', methods=["GET"])
def edit(id):
    res = db.find_one({"_id": ObjectId(id)})
    print(res)
    return {"_ID": str(ObjectId(res["_id"])), "name":res["name"], "email":res["email"], "password":res["password"]}