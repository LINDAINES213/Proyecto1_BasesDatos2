from flask import Blueprint, jsonify, request
from bson import ObjectId

recipes_bp = Blueprint('recipes', __name__)

@recipes_bp.route("/recipes", methods=["GET", "POST"])
def getpost():
    from app import mongo
    db = mongo.db.recipes
    if request.method == "GET":
        o = []
        for i in db.find():
            restaurant_ids = str(i["restaurants"])
            o.append({"_ID": str(ObjectId(i["_id"])), "title":i["title"], "ingredients":i["ingredients"], "directions":i["directions"], "cook_time (min)":i["cook_time (min)"], "country":i["country"], "prep_time (min)":i["prep_time (min)"], "price ($)":i["price ($)"], "restaurants": restaurant_ids})
        return jsonify(o)
    elif request.method == "POST":
        restaurant_ids = [ObjectId(restaurant_id) for restaurant_id in request.json.get("restaurants", [])]
        id = db.insert_one({"title": request.json["title"], "ingredients": request.json["ingredients"], "directions": request.json["directions"], "cook_time (min)": request.json["cook_time (min)"], "country": request.json["country"], "prep_time (min)": request.json["prep_time (min)"], "price ($)": request.json["price ($)"], "restaurants": restaurant_ids})
        inserted_id = id.inserted_id
        return jsonify({"_id": str(inserted_id)})
        
@recipes_bp.route('/recipes/<id>', methods=["DELETE", "PUT"])
def deleteput(id):
    from app import mongo
    db = mongo.db.recipes
    if request.method == "DELETE":
        db.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Deleted"})
    elif request.method == "PUT":
        restaurant_id_str = request.json.get("restaurants")
        if restaurant_id_str.startswith("[ObjectId('") and restaurant_id_str.endswith("')]"):
            restaurant_id = restaurant_id_str[len("[ObjectId('"):-len("')]")]
        else:
            return jsonify({"error": "Invalid restaurants field format"}), 400
        restaurant_id_obj = ObjectId(restaurant_id)
        db.update_one({"_id": ObjectId(id)}, {"$set":{
            "title": request.json["title"],
            "ingredients": request.json["ingredients"],
            "directions": request.json["directions"],
            "cook_time (min)": request.json["cook_time (min)"],
            "country": request.json["country"],
            "prep_time (min)": request.json["prep_time (min)"],
            "price ($)": request.json["price ($)"],
            "restaurants": restaurant_id_obj}})
        return jsonify({"message": "Updated"})
    
@recipes_bp.route('/editrecipes/<id>', methods=["GET"])
def editrecipes(id):
    from app import mongo
    db = mongo.db.recipes
    res = db.find_one({"_id": ObjectId(id)})
    restaurant_ids = str(res["restaurants"])
    print(res)
    return {"_ID": str(ObjectId(res["_id"])), "title":res["title"], "ingredients":res["ingredients"], "directions":res["directions"], "cook_time (min)":res["cook_time (min)"], "country":res["country"], "prep_time (min)":res["prep_time (min)"], "price ($)":res["price ($)"], "restaurants": restaurant_ids}