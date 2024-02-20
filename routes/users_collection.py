from flask import Blueprint, jsonify, request
from bson import ObjectId

users_bp = Blueprint('users', __name__)

@users_bp.route("/users", methods=["GET", "POST"])
def getpost():
    from app import mongo
    db = mongo.db.users
    if request.method == "GET":
        o = []
        for i in db.find():
            o.append({"_ID": str(ObjectId(i["_id"])), "name":i["name"], "age":i["age"], "gender":i["gender"], "country":i["country"], "contact":i["contact"]})
        return jsonify(o)
    elif request.method == "POST":
        id = db.insert_one({"name": request.json["name"], "age": request.json["age"], "gender": request.json["gender"], "country": request.json["country"], "contact": {"email": request.json["contact"]["email"], "phone": request.json["contact"]["phone"]}})
        inserted_id = id.inserted_id
        return jsonify({"_id": str(inserted_id)})
        
@users_bp.route('/users/<id>', methods=["DELETE", "PUT"])
def deleteput(id):
    from app import mongo
    db = mongo.db.users
    if request.method == "DELETE":
        db.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Deleted"})
    elif request.method == "PUT":
        db.update_one({"_id": ObjectId(id)}, {"$set":{
            "name": request.json["name"],
            "age": request.json["age"],
            "gender": request.json["gender"],
            "country": request.json["country"],
            "contact": {"email": request.json["contact"]["email"], "phone": request.json["contact"]["phone"]}
        }})
        return jsonify({"message": "Updated"})
    
@users_bp.route('/editusers/<id>', methods=["GET"])
def editusers(id):
    from app import mongo
    db = mongo.db.users
    res = db.find_one({"_id": ObjectId(id)})
    print(res)
    return {"_ID": str(ObjectId(res["_id"])), "name":res["name"], "age":res["age"], "gender":res["gender"], "country":res["country"], "contact":res["contact"]}