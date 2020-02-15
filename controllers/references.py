from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
from models.Users import Users
from models.Users import References
from helpers.profileRating import UserHelper
import json
import bcrypt
from flask import request
from services import email
from flask_jwt_extended import jwt_required

parser = reqparse.RequestParser()

# /api/v1/registration/user/<userId>/references/
# {
# 	"references": [
# 		{
#           "name": "testname",
#           "contact_number": "03333333333",
#           "address": "ajdrhkewhfk", 
# 		    "email": "14besemfatima@seecs.edu.pk",
# 		},
# 		{
#           "name": "testname",
#           "contact_number": "03333333333",
#           "address": "ajdrhkewhfk", 
# 		    "email": "14besemfatima@seecs.edu.pk",
# 		},
# 		{
#           "name": "testname",
#           "contact_number": "03333333333",
#           "address": "ajdrhkewhfk", 
# 		    "email": "14besemfatima@seecs.edu.pk",
# 		},
# 		{
#           "name": "testname",
#           "contact_number": "03333333333",
#           "address": "ajdrhkewhfk", 
# 		    "email": "14besemfatima@seecs.edu.pk",
# 		},
# 		{
#           "name": "testname",
#           "contact_number": "03333333333",
#           "address": "ajdrhkewhfk", 
# 		    "email": "14besemfatima@seecs.edu.pk",
# 		}
# 		]
# }
class ReferenceRegistration (Resource):
    def post(self, userId):
        reference_details = [0] * 5
        parser.add_argument("references", action='append')

        data = parser.parse_args()
        user = Users.objects(id=userId).first()
        if not user:
            return {'error': 'User {} doesn\'t exist'.format(data['username'])}, 404
            user = json.loads(user.to_json())
        ## Adding refernces against user
        try:
            for i in range(5):
                current_obj = data['references'][i]
                reference_info = eval(current_obj)
                print(reference_info)
                reference_details[i] = References(email=reference_info['email'] ).save()
                ## send an email to this user
                url = 'jobportal.com/referenceStuff/{}'.format(reference_details[i].id)
                email.sendReferenceEmail.sendEmail(reference_info['email'], url)
            print(user)
            profile_rating = UserHelper.calulateUserRating(user)
            updatedUser = user.update(
                reference_details=reference_details,
                profile_completness = profile_rating
                )
            print(updatedUser)
            return {
                'message': 'User {} references have been added'.format(user['username'])
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500


# Request schema
# { 
#     "referenceId": "12334dsfds2342351",
#     "userId": "234567543w5ytrdtr",
#     "results": [
#         {
#             "question": "How was his attitude?",
#             "answer": "a"
#         },
#         {
#             "question": "Was he responsible?",
#             "answer": "b"
#         }
# ]
# }

class SaveReferenceAnswers(Resource):
    def post(self, referenceId):
        parser.add_argument("results", action='append')

        data = parser.parse_args()
        try:
            reference = References.objects(id=referenceId).first()
            if not reference:
                return {
                    'message': 'Invalid url'
                }, 400
            updated_reference = reference.update(results=data['results'])
            return {
                'message': 'User {} references have been created'.format(updated_reference)
            }, 200
        except Exception as ex:
            print(ex)
            return {'message': 'Something went wrong'}, 500

