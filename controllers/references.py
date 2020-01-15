from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
from models.Users import Users
from models.Users import References
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

# Request schema
# 	{
# 		"userId": "testuser4",
# 		"references": [
# 			{
# 				"email": "14besemfatima@seecs.edu.pk",
# 				"answers": "sardewbjfd"
# 			},
# 			{
# 				"email": "adnanak556@gmail.com",
# 				"answers": "sardewbjfd"
# 			},
# 			{
# 				"email": "maryem.fatima96@gmail.com",
# 				"answers": "sardewbjfd"
# 			},
# 			{
# 				"email": "maryem.fatima96@gmail.com",
# 				"answers": "sardewbjfd"
# 			},
# 			{
# 				"email": "maryem.fatima96@gmail.com",
# 				"answers": "sardewbjfd"
# 			}
# 			]
# }

class ReferenceRegistration(Resource):
    def post(self):
        reference_details = [0] * 5
        parser.add_argument("references", action='append')
        parser.add_argument("userId", required=True)

        data = parser.parse_args()
        user = Users.objects(id=data['userId']).first()
        if not user:
            return {'error': 'User {} doesn\'t exist'.format(data['userId'])}, 404
            user = json.loads(user.to_json())
         ## Adding refernces against user
        try:
            for i in range(5):
                current_obj = data['references'][i]
                reference_info = eval(current_obj)
                print(reference_info)
                reference_details[i] = Users.References(email=reference_info['email'], results="random string for now").save()
                ## send an email to this user
                email.sendEmail.post(reference_info['email'])

            updatedUser = user.update(reference_details=reference_details)

            return {
                'message': 'User {} references have been created'.format(updatedUser)
            }, 200
        except:
            return {'message': 'Something went wrong'}, 500


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
    def post(self):
        parser.add_argument("referenceId", required=True)
        parser.add_argument("userId")
        parser.add_argument("results", action='append')

        data = parser.parse_args()
        try:
            reference = References.objects(id=data['referenceId']).first()
            if not reference:
                return {
                    'message': 'Reference does not exist'
                }
            updated_reference = reference.update(results=data['results'])
            return {
                'message': 'User {} references have been created'.format(updated_reference)
            }, 200
        except Exception as ex:
            print(ex)
            return {'message': 'Something went wrong'}, 500

