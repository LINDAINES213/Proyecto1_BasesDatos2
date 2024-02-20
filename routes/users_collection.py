from flask import Blueprint, jsonify, request
from bson import ObjectId

users_bp = Blueprint('users', __name__)

@users_bp.route("/ver", methods=["GET", "POST"])
def getpost():
    from app import mongo
    db = mongo.db.demo2
    if request.method == "GET":
        o = []
        for i in db.find():
            o.append({"_ID": str(ObjectId(i["_id"])), "name":i["name"], "email":i["email"], "password":i["password"]})
        return jsonify(o)
    elif request.method == "POST":
        id = db.insert_one({"name": request.json["name"], "email": request.json["email"], "password": request.json["password"]})
        inserted_id = id.inserted_id
        return jsonify({"_id": str(inserted_id)})
        
@users_bp.route('/<id>', methods=["DELETE", "PUT"])
def deleteput(id):
    from app import mongo
    db = mongo.db.demo2
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
    
@users_bp.route('/edit/<id>', methods=["GET"])
def edit(id):
    from app import mongo
    db = mongo.db.demo2
    res = db.find_one({"_id": ObjectId(id)})
    print(res)
    return {"_ID": str(ObjectId(res["_id"])), "name":res["name"], "email":res["email"], "password":res["password"]}