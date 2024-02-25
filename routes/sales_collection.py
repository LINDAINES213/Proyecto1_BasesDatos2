from flask import Blueprint, jsonify, request
from bson import ObjectId
from datetime import datetime

sales_bp = Blueprint('sales', __name__)

@sales_bp.route("/sales", methods=["GET", "POST"])
def getpost():
    from app import mongo
    db = mongo.db.sales
    if request.method == "GET":
        limit = int(request.args.get('limit', 0))
        o = []
        if limit > 0: 
            for i in db.find().sort("date", -1).limit(limit):
                o.append({"_ID": str(ObjectId(i["_id"])), "date": datetime.strptime(str(i["date"]), "%Y-%m-%d %H:%M:%S"), "id_recipe": str(ObjectId(i["id_recipe"])), "id_restaurant": str(ObjectId(i["id_restaurant"])), "id_user": str(ObjectId(i["id_user"])), "quantity":i["quantity"], "price ($)":i["price ($)"], "total ($)":i["total ($)"]})
        else:
            for i in db.find().sort("date", -1):
                o.append({"_ID": str(ObjectId(i["_id"])), "date": datetime.strptime(str(i["date"]), "%Y-%m-%d %H:%M:%S"), "id_recipe": str(ObjectId(i["id_recipe"])), "id_restaurant": str(ObjectId(i["id_restaurant"])), "id_user": str(ObjectId(i["id_user"])), "quantity":i["quantity"], "price ($)":i["price ($)"], "total ($)":i["total ($)"]})
        return jsonify(o)
    elif request.method == "POST":
        date_str = request.json.get("date")
        id = db.insert_one({"date": datetime.strptime(date_str, "%Y-%m-%d"), "id_recipe": request.json[str("id_recipe")], "id_restaurant": request.json[str("id_restaurant")], "id_user": request.json[str("id_user")], "quantity": request.json["quantity"], "price ($)": request.json["price ($)"], "total ($)": request.json["total ($)"]})
        inserted_id = id.inserted_id
        return jsonify({"_id": str(inserted_id)})
        
        
@sales_bp.route('/sales/<id>', methods=["DELETE", "PUT"])
def deleteput(id):
    from app import mongo
    db = mongo.db.sales
    if request.method == "DELETE":
        db.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Deleted"})
    elif request.method == "PUT":
        date_str = request.json.get("date")
        db.update_one({"_id": ObjectId(id)}, {"$set":{
            "date": datetime.strptime(date_str, "%Y-%m-%d"),
            "id_recipe": request.json[str("id_recipe")], 
            "id_restaurant": request.json[str("id_restaurant")], 
            "id_user": request.json[str("id_user")], 
            "quantity": request.json["quantity"], 
            "price ($)": request.json["price ($)"], 
            "total ($)": request.json["total ($)"]}})
        return jsonify({"message": "Updated"})
    
@sales_bp.route('/editsales/<id>', methods=["GET"])
def editsales(id):
    from app import mongo
    db = mongo.db.sales
    res = db.find_one({"_id": ObjectId(id)})
    date_str = str(res["date"])
    print(res)
    return {"_ID": str(ObjectId(res["_id"])), "date": date_str, "id_recipe": str(res["id_recipe"]), "id_restaurant": str(res["id_restaurant"]), "id_user": str(res["id_user"]), "quantity":res["quantity"], "price ($)":res["price ($)"], "total ($)":res["total ($)"]}

@sales_bp.route('/total_sales_per_recipe', methods=["GET"])
def total_sales_per_recipe():
    from app import mongo
    db = mongo.db.sales
    pipeline = [
        {"$lookup": {
            "from": "recipes",
            "localField": "id_recipe",
            "foreignField": "_id",
            "as": "recipe"
        }},

        {"$unwind": "$recipe"},
        {"$group": {"_id": "$recipe.title", "total_sales ($)": {"$sum": "$total ($)"}}},
        {"$sort": {"total_sales ($)": -1}},
        {"$limit": 10}
    ]
    resultado = list(db.aggregate(pipeline))
    return jsonify(resultado)

@sales_bp.route('/total_sales_per_restaurant_month', methods=["GET"])
def total_sales_per_restaurant_month():
    from app import mongo
    db = mongo.db.sales
    pipeline = [
        {"$lookup": {
            "from": "restaurants",
            "localField": "id_restaurant",
            "foreignField": "_id",
            "as": "restaurant"
        }},
        {"$unwind": "$restaurant"},
        {"$project": {
            "restaurant": "$restaurant.name",
            "month": {"$month": {"$toDate": "$date"}},
            "total_sales ($)": "$total ($)"
        }},
        {"$group": {
            "_id": {"restaurant": "$restaurant", "month": "$month"},
            "total_sales ($)": {"$sum": "$total_sales ($)"},
        }},
        {"$sort": {"total_sales ($)": -1}},
        {"$limit": 10}
    ]
    resultado = list(db.aggregate(pipeline))
    return jsonify(resultado)

@sales_bp.route('/sold_recipes_per_country', methods=["GET"])
def sold_recipes_per_country():
    from app import mongo
    db = mongo.db.sales
    pipeline = [
        {"$lookup": { 
            "from": "recipes", 
            "localField": "id_recipe", 
            "foreignField": "_id", 
            "as": "recipe" 
            }
        }, 
            
        {"$unwind": "$recipe"}, 
        {"$group": { "_id": { "country": "$recipe.country", "recipe": "$recipe.title" }, "total_ventas ($)": {"$sum": "$total ($)"} }}, 
        {"$sort": {"total_ventas ($)": -1}}, 
        {"$limit": 10}
    ]
    resultado = list(db.aggregate(pipeline))
    return jsonify(resultado)