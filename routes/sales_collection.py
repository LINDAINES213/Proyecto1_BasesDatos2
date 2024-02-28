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
        pipeline = [
            {"$lookup": { 
                "from": "restaurants", 
                "localField": "id_restaurant", 
                "foreignField": "_id", 
                "as": "restaurant_name" 
                }
            },
            {"$lookup": { 
                "from": "recipes", 
                "localField": "id_recipe", 
                "foreignField": "_id", 
                "as": "recipe_name" 
                }
            },
            {"$lookup": { 
                "from": "users", 
                "localField": "id_user", 
                "foreignField": "_id", 
                "as": "user_name" 
                }
            },
            {"$sort":{ "date": -1}},
        ]
        if limit > 0: 
            pipeline.append({"$limit": limit})
            result = db.aggregate(pipeline)
            for i in result:
                restaurante = [{"id": str(restaurant["_id"]), "name": restaurant["name"]} for restaurant in i["restaurant_name"]]
                receta = [{"id": str(recipe["_id"]), "title": recipe["title"]} for recipe in i["recipe_name"]]
                usuario = [{"id": str(user["_id"]), "name": user["name"]} for user in i["user_name"]]

                o.append({"_ID": str(ObjectId(i["_id"])), "date": datetime.strptime(str(i["date"]), "%Y-%m-%d %H:%M:%S"), "id_recipe": receta, "id_restaurant": restaurante, "id_user": usuario, "quantity":i["quantity"], "price":i["price ($)"], "total":i["total ($)"]})
        else:
            result = db.aggregate(pipeline)
            for i in result:
                restaurante = [{"id": str(restaurant["_id"]), "name": restaurant["name"]} for restaurant in i["restaurant_name"]]
                receta = [{"id": str(recipe["_id"]), "title": recipe["title"]} for recipe in i["recipe_name"]]
                usuario = [{"id": str(user["_id"]), "name": user["name"]} for user in i["user_name"]]
                o.append({"_ID": str(ObjectId(i["_id"])), "date": datetime.strptime(str(i["date"]), "%Y-%m-%d %H:%M:%S"), "id_recipe": receta, "id_restaurant": restaurante, "id_user": usuario, "quantity":i["quantity"], "price":i["price ($)"], "total":i["total ($)"]})
        return jsonify(o)
    elif request.method == "POST":
        date_str = request.json.get("date")
        id = db.insert_one({"date": datetime.strptime(date_str, "%Y-%m-%d"), "id_recipe": request.json[str("id_recipe")], "id_restaurant": request.json[str("id_restaurant")], "id_user": request.json[str("id_user")], "quantity": request.json["quantity"], "price": request.json["price ($)"], "total": request.json["total ($)"]})
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

    recipe = mongo.db.recipes.find_one({"_id": res["id_recipe"]}) 
    restaurant = mongo.db.restaurants.find_one({"_id": res["id_restaurant"]})
    user = mongo.db.users.find_one({"_id": res["id_user"]})

    recipe = [{"id": str(res["id_recipe"]),"title": recipe["title"]}]
    restaurant = [{"id": str(res["id_restaurant"]), "name": restaurant["name"]}]
    user = [{"id": str(res["id_user"]), "name": user["name"]}]

    print(res)
    return {"_ID": str(ObjectId(res["_id"])), "date": date_str,
    "id_recipe": recipe,
    "id_restaurant": restaurant,
    "id_user": user,
    "quantity": res["quantity"],
    "price": res["price ($)"],
    "total": res["total ($)"]}

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