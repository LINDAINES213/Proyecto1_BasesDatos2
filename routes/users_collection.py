import io
from flask import Blueprint, jsonify, request, send_file, url_for
from bson import ObjectId
from gridfs import GridFS

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
    
@users_bp.route('/usersImage/<id>', methods=['GET'])
def get_profile_image(id):
    from app import mongo
    try:
        '''fs = GridFS(mongo.db)
        image = fs.get(ObjectId(id))
        if image is not None:
            return send_file(image, mimetype = 'image/png')
        else:
            return 'Image not found', 404'''
        gridfs_file = mongo.db.fs.files.find_one({'_id': ObjectId(id)})
        if gridfs_file is None:
            return 'Image not found', 404
        
        file_data = b''
        for chunk in mongo.db.fs.files.find({'_id': ObjectId(id)}):
            file_data += chunk.get('data', b'')

        image_data = {
            'filename': gridfs_file['filename'],
            'chunkSize': gridfs_file.get('chunkSize', ''),
            'upload_date': gridfs_file.get('uploadDate', ''),
            'length': gridfs_file.get('length', ''),
            # Añade más campos según sea necesario
        }

        # Construye la URL de la imagen
        image_url = url_for('users.get_profile_image', id=id)

        # Devuelve los datos de la imagen junto con la URL
        return jsonify({'image_data': image_data, 'image_url': image_url}), 200

        '''response = send_file(io.BytesIO(file_data), mimetype = 'image/png')
        response.headers['Content-Disposition'] = 'inline; filename=' + gridfs_file['filename']
        return jsonify({'image_data': image_data, 'image': response}), 200'''
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