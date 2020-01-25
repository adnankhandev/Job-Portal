from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
from models.Users import Users
from models import Services
import json
import bcrypt
from flask import request
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
        try:
            if userId is None:
                response = Users.objects.all()
            else:
                response = Users.objects.get(id=userId)
            return {
                'response': '{}'.format(json.loads(response.to_json()))
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400

class users(Resource):
    def get(self):
        try:
            response = Users.objects.all()
            return {
                'response': '{}'.format(json.loads(response.to_json()))
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400
