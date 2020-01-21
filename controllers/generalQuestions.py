from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
from models.Questions import Questions
import json

parser = reqparse.RequestParser()

# {
#     "general_questions": ["what is your name", "how old are you"]
# }


class GeneralQuestions(Resource):
    def post(self):
        parser.add_argument('general_questions', action='append', help='This field cannot be blank', required=True)
        data = parser.parse_args()
        print(data['general_questions'])
        new_question = Questions(
            general_questions=data['general_questions'],
        )

        try:
            # print(json.loads(new_question))
            new_question.save()
            return {
                'message': 'Service {} was created'.format(new_question)
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400
    
    def get(self, id=None):
        try:
            if id is None:
                print(Questions)
                response = Questions.objects.all()
            else:
                response = Questions.objects.get(id=id)
            return {
                'response': '{}'.format(json.loads(response.to_json()))
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400
    
    def put(self, id=None):
        try:
            response = Questions.objects(id=id).first()
            if response is None:
                print(Questions)
                return {
                    'response': 'No such object'
                }, 404
            else:
                parser.add_argument('general_questions', action='append', help='This field cannot be blank', required=True)
                print(parser)
                data = parser.parse_args()
                additional_questions = response['general_questions'].append(data['general_questions'])
                updated_object = response.update(general_questions = additional_questions)
                print(updated_object)
                return {
                    'response': '{}'.format(json.loads(response.to_json()))
                }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400