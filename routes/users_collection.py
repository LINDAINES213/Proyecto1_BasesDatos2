import io
from flask import Blueprint, abort, jsonify, request, send_file, url_for
from bson import ObjectId
from gridfs import GridFS
from pymongo import MongoClient
import mimetypes
from werkzeug.utils import secure_filename

users_bp = Blueprint('users', __name__)

@users_bp.route("/users", methods=["GET", "POST"])
def getpost():
    from app import mongo
    db = mongo.db.users
    if request.method == "GET":
        limit = int(request.args.get('limit', 0))
        o = []
        if limit > 0:
            for i in db.find().sort("name", 1).limit(limit):
                o.append({"_ID": str(ObjectId(i["_id"])), "name":i["name"], "age":i["age"], "gender":i["gender"], "country":i["country"], "contact":i["contact"]})
        else:
            for i in db.find().sort("name", 1):
                o.append({"_ID": str(ObjectId(i["_id"])), "name":i["name"], "age":i["age"], "gender": i["gender"], "country": i["country"], "contact": i["contact"]})
        return jsonify(o)
    elif request.method == "POST":
        id = db.insert_one({"name": request.json["name"], "age": request.json["age"], "gender": request.json["gender"], "country": request.json["country"], "contact": {"email": request.json["contact"]["email"], "phone": request.json["contact"]["phone"]}})
        inserted_id = id.inserted_id
        return jsonify({"_id": str(inserted_id)})
    
@users_bp.route('/usersImage/<id>', methods=['GET', 'PUT', 'DELETE'])
def get_profile_image(id):
    from app import mongo
    db = mongo.db.users
    if request.method == 'GET':
        try:
            fs = GridFS(mongo.db, collection='users')
            image = fs.get(ObjectId(id))
            if image is not None:
                filename = image.filename
                mimetype, _ = mimetypes.guess_type(filename)
                if mimetype:
                    return send_file(image, mimetype = mimetype)
                    #return send_file(image, mimetype = 'image/png')
                else:
                    return 'Unknown image format', 400
            else:
                abort(404)
        except Exception as e:
            return str(e), 500
    elif request.method == "PUT":
        try:
            fs = GridFS(mongo.db, collection='users')
            
            if 'profile_image' not in request.files:
                return 'No image provided', 400
            
            new_image = request.files['profile_image']

            if new_image.filename == '':
                return 'No selected file', 400
            
             # Obtener el nombre seguro del archivo
            filename = secure_filename(new_image.filename)

             # Verificar si se generó un nombre de archivo seguro
            if filename is None:
                return 'Invalid filename', 400
            
            fs.delete(ObjectId(id))
            new_image_id = fs.put(new_image, filename=filename, _id=ObjectId(id), metadata={'filename': filename})

            db.update_one({'profile_image': ObjectId(id)}, {'$set': {'profile_image': new_image_id}})

            return 'Image uploaded', 200
        except Exception as e:
            return str(e), 500
        
    elif request.method == 'DELETE':
        try:
            fs = GridFS(mongo.db, collection='users')

            # Verificar si la imagen existe
            if not fs.exists(ObjectId(id)):
                return 'Profile image not found', 404

            # Eliminar la imagen de la base de datos
            fs.delete(ObjectId(id))
            db.update_one({'profile_image': ObjectId(id)}, {'$set': {'profile_image': None}})

            return 'Profile image deleted successfully', 200

        except Exception as e:
            return str(e), 500
    
        
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
    
@users_bp.route("/usersImage", methods=["GET"])
def usersImage():
    from app import mongo
    db = mongo.db.users
    o = []
    for i in db.find().sort("name", 1):
        o.append({"_ID": str(ObjectId(i["_id"])), "name":i["name"], "age":i["age"], "gender": i["gender"], "country": i["country"], "contact": i["contact"], "profile_image": str(ObjectId(i["profile_image"]))})
    return jsonify(o)
    
@users_bp.route('/editusers/<id>', methods=["GET"])
def editusers(id):
    from app import mongo
    db = mongo.db.users
    res = db.find_one({"_id": ObjectId(id)})
    print(res)
    return {"_ID": str(ObjectId(res["_id"])), "name":res["name"], "age":res["age"], "gender":res["gender"], "country":res["country"], "contact":res["contact"]}

@users_bp.route('/users_per_country', methods=["GET"])
def users_per_country():
    from app import mongo
    db = mongo.db.users
    pipeline = [
        {"$group": {"_id": "$country", "total": {"$sum": 1}}},
        {"$sort": {"total": -1}},
        {"$limit": 10}
    ]
    resultado = list(db.aggregate(pipeline))
    return jsonify(resultado)

@users_bp.route('/age_average_per_gender', methods=["GET"])
def age_average_per_gender():
    from app import mongo
    db = mongo.db.users
    pipeline = [
        {"$group": {"_id": "$gender", "average_age": {"$avg": "$age"}}},
        {"$sort": {"average_age": -1}}
    ]
    resultado = list(db.aggregate(pipeline))
    return jsonify(resultado)

@users_bp.route('/check_usersId', methods=["GET"])
def check_usersId():
    from app import mongo
    db = mongo.db.users
    if request.method == "GET":
        query = db.find({}, { "_id": 1, "name": 1}).sort("name", 1)
        result = [{**doc, '_id': str(doc['_id'])} for doc in query]
    return jsonify(result)