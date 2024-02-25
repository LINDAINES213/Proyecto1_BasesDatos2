from flask import Blueprint, jsonify, request
from bson import ObjectId

restaurants_bp = Blueprint('restaurants', __name__)

@restaurants_bp.route("/restaurants", methods=["GET", "POST"])
def getpost():
    from app import mongo
    db = mongo.db.restaurants
    if request.method == "GET":
        limit = int(request.args.get('limit', 0))
        o = []
        if limit > 0:
            for i in db.find().sort("stars", -1).limit(limit):
                o.append({"_ID": str(ObjectId(i["_id"])), "name":i["name"], "country":i["country"], "stars":i["stars"], "employees_quantity":i["employees_quantity"]})
        else:
            for i in db.find().sort("stars", -1):
                o.append({"_ID": str(ObjectId(i["_id"])), "name":i["name"], "country":i["country"], "stars":i["stars"], "employees_quantity":i["employees_quantity"]})
        return jsonify(o)
    elif request.method == "POST":
        id = db.insert_one({"name": request.json["name"], "country": request.json["country"], "stars": request.json["stars"], "employees_quantity": {"Female": request.json["employees_quantity"]["Female"], "Male": request.json["employees_quantity"]["Male"]}})
        inserted_id = id.inserted_id
        return jsonify({"_id": str(inserted_id)})
        
@restaurants_bp.route('/restaurants/<id>', methods=["DELETE", "PUT"])
def deleteput(id):
    from app import mongo
    db = mongo.db.restaurants
    if request.method == "DELETE":
        db.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Deleted"})
    elif request.method == "PUT":
        db.update_one({"_id": ObjectId(id)}, {"$set":{
            "name": request.json["name"],
            "country": request.json["country"],
            "stars": request.json["stars"],
            "employees_quantity": {"Female": request.json["employees_quantity"]["Female"], "Male": request.json["employees_quantity"]["Male"]}
        }})
        return jsonify({"message": "Updated"})
    
@restaurants_bp.route('/editrestaurant/<id>', methods=["GET"])
def edit(id):
    from app import mongo
    db = mongo.db.restaurants
    res = db.find_one({"_id": ObjectId(id)})
    print(res)
    return {"_ID": str(ObjectId(res["_id"])), "name":res["name"], "country":res["country"], "stars":res["stars"], "employees_quantity":res["employees_quantity"]}

@restaurants_bp.route('/stars_average_per_cuisine', methods=["GET"])
def stars_average_per_cuisine():
    from app import mongo
    db = mongo.db.restaurants
    pipeline = [
        {"$group": {"_id": "$country", "avg_stars": {"$avg": "$stars"}}},
        {"$sort": {"total_sales": -1}},
        {"$limit": 5}
    ]
    resultado = list(db.aggregate(pipeline))
    return jsonify(resultado)