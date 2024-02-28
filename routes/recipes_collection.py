from flask import Blueprint, jsonify, request
from bson import ObjectId
import ast
import re

recipes_bp = Blueprint('recipes', __name__)

@recipes_bp.route("/recipes", methods=["GET", "POST"])
def getpost():
    from app import mongo
    db = mongo.db.recipes
    if request.method == "GET":
        limit = int(request.args.get('limit', 0))
        o = []
        pipeline = [
            {"$lookup": { 
                "from": "restaurants", 
                "localField": "restaurants", 
                "foreignField": "_id", 
                "as": "restaurant_name" 
                }
            },
            {"$sort":{ "title": 1}},
        ]
        if limit > 0:
            pipeline.append({"$limit": limit})
            result = db.aggregate(pipeline)
            for i in result:
                restaurantes = [{"id": str(restaurant["_id"]), "name": restaurant["name"]} for restaurant in i["restaurant_name"]]

                o.append({"_ID": str(ObjectId(i["_id"])), "title":i["title"], "ingredients":i["ingredients"], "directions":i["directions"], "cook_time":i["cook_time (min)"], "country":i["country"], "prep_time":i["prep_time (min)"], "price":i["price ($)"], "restaurants": restaurantes})
        else:
            result = db.aggregate(pipeline)
            for i in result:
                restaurantes = [{"id": str(restaurant["_id"]), "name": restaurant["name"]} for restaurant in i["restaurant_name"]]
                o.append({"_ID": str(ObjectId(i["_id"])), "title":i["title"], "ingredients":i["ingredients"], "directions":i["directions"], "cook_time":i["cook_time (min)"], "country":i["country"], "prep_time":i["prep_time (min)"], "price":i["price ($)"], "restaurants": restaurantes})
        return jsonify(o)
    elif request.method == "POST":
        restaurant_ids = ast.literal_eval(request.json["restaurants"])
        restaurant_ids = [ObjectId(r) for r in restaurant_ids]
        '''restaurant_ids_str = request.json["restaurants"]

        matches = re.findall(r"ObjectId\('(.*?)'", restaurant_ids_str)

        object_ids = [m.strip('[') for m in matches]

        restaurant_ids = [ObjectId(oid) for oid in object_ids]'''

        id = db.insert_one({"title": request.json["title"], "ingredients": request.json["ingredients"], "directions": request.json["directions"], "cook_time (min)": request.json["cook_time"], "country": request.json["country"], "prep_time (min)": request.json["prep_time"], "price ($)": request.json["price"], "restaurants": restaurant_ids})
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
        
        restaurant_ids = ast.literal_eval(request.json["restaurants"])
        restaurant_ids = [ObjectId(r) for r in restaurant_ids]

        '''restaurant_ids_str = request.json["restaurants"]

        matches = re.findall(r"ObjectId\('(.*?)'", restaurant_ids_str)

        object_ids = [m.strip('[') for m in matches]

        restaurant_ids = [ObjectId(oid) for oid in object_ids]'''

        db.update_one({"_id": ObjectId(id)}, {"$set":{
            "title": request.json["title"],
            "ingredients": request.json["ingredients"],
            "directions": request.json["directions"],
            "cook_time (min)": request.json["cook_time"],
            "country": request.json["country"],
            "prep_time (min)": request.json["prep_time"],
            "price ($)": request.json["price"],
            "restaurants": restaurant_ids}})
        return jsonify({"message": "Updated"})
    
@recipes_bp.route('/editrecipes/<id>', methods=["GET"])
def editrecipes(id):
    from app import mongo
    db = mongo.db.recipes
    res = db.find_one({"_id": ObjectId(id)})
    restaurant_ids = str(res["restaurants"])
    restaurantes = []
    matches = re.findall(r"ObjectId\('(.*?)'", restaurant_ids)
    object_ids = [m.strip('[') for m in matches]
    restaurant_ids = [ObjectId(oid) for oid in object_ids]
    for id in restaurant_ids:
        restaurant = mongo.db.restaurants.find_one({"_id": ObjectId(id)})
        restaurant = {
            "_id": str(restaurant["_id"]),
            "name": restaurant["name"] 
        }
        restaurantes.append((restaurant))
    print(res)
    return {"_ID": str(ObjectId(res["_id"])), "title":res["title"], "ingredients":res["ingredients"], "directions":res["directions"], "cook_time":res["cook_time (min)"], "country":res["country"], "prep_time":res["prep_time (min)"], "price":res["price ($)"], "restaurants": restaurantes}

@recipes_bp.route('/check_recipeId', methods=["GET"])
def check_recipeId():
    from app import mongo
    db = mongo.db.recipes
    if request.method == "GET":
        query = db.find({}, { "_id": 1, "title": 1}).sort("title", 1)
        result = [{**doc, '_id': str(doc['_id']), 'name': doc.pop('title')} for doc in query]
        for doc in result:
            del doc['title']
    return jsonify(result)

@recipes_bp.route('/restaurantsIds', methods=["GET"])
def recipes_per_country():
    from app import mongo
    db = mongo.db.recipes
    o = []
    pipeline = [
            {"$lookup": { 
                "from": "restaurants", 
                "localField": "restaurants", 
                "foreignField": "_id", 
                "as": "restaurant_name" 
                }
            },
    ]
    result = db.aggregate(pipeline)
    for i in result:
        restaurantes = [{"_id": str(restaurant["_id"]), "name": restaurant["name"]} for restaurant in i["restaurant_name"]]
        o.append({"_ID": str(ObjectId(i["_id"])), "restaurants": restaurantes})
    return jsonify(o)