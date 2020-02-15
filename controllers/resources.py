from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
from models.Users import Users
from models.Users import EmergencyContact
from models.Users import EmployementHistory
from models.Users import References
from models.RevokedTokens import RevokedTokens
from models import Services
from ast import literal_eval
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
    @jwt_required
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
        parser.add_argument('name')

        data = parser.parse_args()

        new_user = Users(
            username=data['username'],
            password=bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()),
            email=data['email'],
            mobile_number=data['mobile_number'],            
            title=data['title'],
            name=data['name'],
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
            revoked_token = RevokedTokens(jti = jti)
            revoked_token.save()
            return {'message': 'Access token has been revoked'}, 200
        except:
            return {'message': 'Something went wrong'}, 500

class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedTokens(jti = jti)
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

# /api/v1/registration/user/<userId>/emergency-contact-details
# {
#   "fullname": "testcontact",
#   "contact_number": 03333333333,
#   "relation": "father"
# }

class AddEmergencyContact(Resource):
    @jwt_required
    def post(self, userId):
        parser.add_argument("fullname", required=True)
        parser.add_argument("contact_number", required=True)
        parser.add_argument("relation", required=True)

        data = parser.parse_args()
        try: 
            currentUser = Users.objects(id=userId).first()
            if not currentUser:
                return {'error': 'User doesn\'t exist'}, 404
            print(currentUser)
            emergencyContact = EmergencyContact(
                fullname = data['fullname'],
                contact_number = data['contact_number'],
                relation = data['relation']
            )

            emergency_contact = emergencyContact.save()

            updated_user = currentUser.update(emergency_contact_details = emergency_contact)
            print(updated_user)
            return {
                'message': '{} emergency contact has been added'.format(currentUser['username'])
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500

# /api/v1/registration/user/<userId>/services
# {
# serviceIds: ['objectIds of service1', 'objectId of service 2]
# }

class AddServices(Resource):
    @jwt_required
    def post(self, userId):
        parser.add_argument("serviceIds", action="append")
        data = parser.parse_args()

        try:
            currentUser = Users.objects(id=userId).first()
            if not currentUser:
                return {'error': 'User doesn\'t exist'}, 404
            services = Services.Services.objects(id__in=data['serviceIds'])
            updated_user = currentUser.update(services = services)
            print(updated_user)
            return {
                'message': '{}`s services have been added'.format(currentUser['username'])
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500
# /api/v1/registration/user/<userId>/employement-details
# {
# 	"employement_history": [
# 		{
# 			"name": "employer1",
# 			"service_hours": 4,
# 			"salary_per_hour": 100,
# 			"starting_date": "12-12-12",
# 			"end-date": "12-12-13",
# 			"reasons_of_leaving": "ruhewkfdejkhf",
# 			"notes": "ewrewfrew"
# 		},
# 				{
# 			"name": "employer1",
# 			"service_hours": 4,
# 			"salary_per_hour": 100,
# 			"starting_date": "12-12-12",
# 			"end-date": "12-12-13",
# 			"reasons_of_leaving": "ruhewkfdejkhf",
# 			"notes": "ewrewfrew"
# 		}]
# }

class AddEmployementHistory(Resource):
    @jwt_required
    def post(self, userId):
        parser.add_argument("employement_history", action="append", required=True)
        data = parser.parse_args()
        length_of_employement_history = len(data['employement_history'])
        employement_history = [0] * length_of_employement_history
        try:
            currentUser = Users.objects(id=userId).first()
            if not currentUser:
                return {'error': 'User doesn\'t exist'}, 404
            for i in range(length_of_employement_history):
                current_record = eval(data['employement_history'][i])
                employement_history[i] = EmployementHistory(
                    name=current_record['name'],
                    service_hours=current_record['service_hours'],
                    salary_per_hour=current_record['salary_per_hour'],
                    starting_date=current_record['starting_date'],
                    end_date=current_record['end_date'],
                    reasons_of_leaving=current_record['reasons_of_leaving'],
                    notes=current_record['notes']
                ).save()
                print(employement_history[i])
            print(currentUser)
            updated_user = currentUser.update(employement_history=employement_history)
            return {
                'message': '{} employement history has been added'.format(currentUser['username'])
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500
# {
#     general_question_answers = [
#         "answer1", "answer2", ...
#     ]
# }
class AddGeneralQuestionAnswer(Resource):
    @jwt_required
    def post(self, userId):
        parser.add_argument("general_question_answers", action="append", required=True)
        data = parser.parse_args()
        try:
            print(data)
            currentUser = Users.objects(id=userId).first()
            print(currentUser)
            if not currentUser:
                return {'error': 'User doesn\'t exist'}, 404
            updated_user = currentUser.update(general_question_answers=data['general_question_answers'])
            return {
                'message': 'general question answers has been added for {}'.format(currentUser['username'])
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500

# {
#     user_type: 0/1/2  0 -> Applicant, 1-> helper, 2-> CMS
# }
class UpdateUserType(Resource):
    @jwt_required
    def patch(self, userId):
        parser.add_argument("user_type", required=True)
        data = parser.parse_args()
        try:
            currentUser = Users.objects(id=userId).first()
            print(currentUser)
            if not currentUser:
                return {'error': 'User doesn\'t exist'}, 404
            print(currentUser)
            updated_user = currentUser.update(user_type=data['user_type'])
            return {
                'message': 'user_type has been updated for {}'.format(currentUser['username'])
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500

# {
# 	"available_hours": {
# 		"monday":  [hour, hour],
# 		"tueday": [hour. hour],
# 		"wednesday": [hour. hour],
# 		"thursday": [hour, hour],
# 		"friday": [hour, hour]
# 	}
# }

class AvailableHoursInfo(Resource):
    @jwt_required
    def post(self, userId):
        parser.add_argument("available_hours", required=True)
        data = parser.parse_args()
        try:
            currentUser = Users.objects(id=userId).first()
            if not currentUser:
                return {'error': 'User doesn\'t exist'}, 404
            updated_user = currentUser.update(available_hours=literal_eval(data['available_hours']))
            return {
                'message': 'user_type has been updated for {}'.format(currentUser['username'])
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500