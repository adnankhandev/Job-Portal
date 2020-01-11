from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
import models
import json
import bcrypt
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

class InitialRegistration(Resource):
    def post(self):
        parser.add_argument('username', help='This field cannot be blank', required=True)
        parser.add_argument('password', help='Please enter at least 6 characters', required=True)
        parser.add_argument('email')
        parser.add_argument('mobile_number')
        parser.add_argument('title')
        parser.add_argument('first_name')
        parser.add_argument('last_name')

        data = parser.parse_args()

        new_user = models.Users(
            username=data['username'],
            password=bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()),
            email=data['email'],
            mobile_number=data['mobile_number'],            
            title=data['title'],
            first_name=data['first_name'],
            last_name=data['last_name'],
        )

        try:
            new_user.save()
            return {
                'message': 'User {} was created'.format(data['username'])
            }, 200
        except Exception as ex:
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500

class UserLogin(Resource):
    def post(self):
        parser.add_argument('username', help='This field cannot be blank', required=True)
        parser.add_argument('password', help='Please enter at least 6 characters', required=True)
        data = parser.parse_args()

        user = models.Users.objects(username=data['username']).first()
        if not user:
            return {'error': 'User {} doesn\'t exist'.format(data['username'])}, 404
        user = json.loads(user.to_json())

        if bcrypt.checkpw(data['password'].encode('utf-8'), user["password"].encode('utf-8')):
            access_token = create_access_token(identity = data['username'])
            refresh_token = create_refresh_token(identity = data['username'])
            return {
                'message': 'Logged in as {}'.format(user["username"]),
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 200
        else:
            return {'error': 'Unauthorized'}, 401
        
        return data

class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = models.RevokedTokens(jti = jti)
            revoked_token.save()
            return {'message': 'Access token has been revoked'}, 200
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = models.RevokedTokens(jti = jti)
            revoked_token.save()
            return {'message': 'Refresh token has been revoked'}, 200
        except:
            return {'message': 'Something went wrong'}, 500

class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity = current_user)
        return {'access_token': access_token}

class test(Resource):
    @jwt_required
    def get(self):
        return models.RevokedTokens.is_jti_blacklisted("adnan")