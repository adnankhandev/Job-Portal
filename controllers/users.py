from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
from models.Users import Users
from models import Services
import json
import bcrypt
from flask import request, jsonify, make_response
from services import email
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    jwt_refresh_token_required, 
    get_jwt_identity, 
    get_raw_jwt
)

parser = reqparse.RequestParser()

####################################################################
####################### USERS ## & ## ACCOUNTS #####################
####################################################################

class user(Resource):
    def get(self, userId):
        result = {}
        try:
            response = Users.objects.get(id=userId)
            result['response'] = response
            return make_response(jsonify(result), 200)
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400

class users(Resource):
    def get(self):
        result = {}
        try:
            response = Users.objects.all()
            result['response'] = response
            return make_response(jsonify(result), 200)
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400
