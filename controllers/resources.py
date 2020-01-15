from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
from models.Users import Users
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

class AddPersonalDetails(Resource):
    def post(self, userId):
        parser.add_argument('duration_of_stay_at_address')
        parser.add_argument('profile_picture')
        parser.add_argument('postcode')
        parser.add_argument('current_address')
        parser.add_argument('home_number')
        parser.add_argument('gender')
        parser.add_argument('nationality')
        parser.add_argument('date_of_birth')

        data = parser.parse_args()
        currentUser = Users.find_user_by_id(userId)

        currentUserDetails = Users.PersonalDetails(
            duration_of_stay_at_address = data['duration_of_stay_at_address'],
            profile_picture = data['profile_picture'],
            postcode = data['postcode'],
            current_address = data['current_address'],
            home_number = data['home_number'],
            gender = data['gender'],
            nationality = data['nationality'],
            date_of_birth = data['date_of_birth'],
        )

        currentUserDetails.save()

    def update(self):
        parser.add_argument('duration_of_stay_at_address')
        parser.add_argument('profile_picture')
        parser.add_argument('postcode')
        parser.add_argument('current_address')
        parser.add_argument('home_number')
        parser.add_argument('gender')
        parser.add_argument('nationality')
        parser.add_argument('date_of_birth')
        parser.add_argument('username')

        data = parser.parse_args()

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

        new_user = Users(
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
            return {'error': message}, 400

class UserLogin(Resource):
    def post(self):
        parser.add_argument('username', help='This field cannot be blank', required=True)
        parser.add_argument('password', help='Please enter at least 6 characters', required=True)
        data = parser.parse_args()

        user = Users.objects(username=data['username']).first()
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
            revoked_token = Users.RevokedTokens(jti = jti)
            revoked_token.save()
            return {'message': 'Access token has been revoked'}, 200
        except:
            return {'message': 'Something went wrong'}, 400

class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = Users.RevokedTokens(jti = jti)
            revoked_token.save()
            return {'message': 'Refresh token has been revoked'}, 200
        except:
            return {'message': 'Something went wrong'}, 400

class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity = current_user)
        return {'access_token': access_token}

class test(Resource):
    @jwt_required
    def get(self):
        return Users.get_all()
