from utilities import (
    min_length
)
from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from models.Questions import Questions
import json
from flask_jwt_extended import jwt_required

parser = reqparse.RequestParser()

# {
#     "general_questions": ["what is your name", "how old are you"]
# }


class GeneralQuestions(Resource):
    @jwt_required
    def post(self):
        parser.add_argument('general_questions', action='append', help='This field cannot be blank', required=True)
        data = parser.parse_args()
        print(data['general_questions'])
        new_question = Questions(
            general_questions=data['general_questions'],
        )

        try:
            new_question.save()
            return {
                'message': 'General Questions has been created'
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500
    
    @jwt_required
    def get(self, id=None):
        result = {}
        try:
            if id is None:
                print(Questions)
                response = Questions.objects.all()
            else:
                response = Questions.objects.get(id=id)
            result['response'] = response
            return make_response(jsonify(result), 200)
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500

class GeneralQuestion(Resource):
    @jwt_required
    def get(self, GeneralQuestionId):
        result = {}
        try:
            response = Questions.objects.get(id=GeneralQuestionId)
            result['response'] = response
            return make_response(jsonify(result), 200)
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400
    
    @jwt_required
    def put(self, GeneralQuestionId):
        additional_questions = {}
        try:
            response = Questions.objects(id=GeneralQuestionId).first()
            if response is None:
                print(Questions)
                return {
                    'response': 'No such object'
                }, 404
            else:
                parser.add_argument('general_questions', action='append', help='This field cannot be blank', required=True)
                print(parser)
                data = parser.parse_args()
                additional_questions = response['general_questions'] + data['general_questions']
                updated_object = response.update(general_questions = additional_questions)
                print(updated_object)
                return {
                    'response': 'general questions updated'
                }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500