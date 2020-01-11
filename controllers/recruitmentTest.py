from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
from models import RecruitmentTest as rt
import json

parser = reqparse.RequestParser()

class RecruitmentTest(Resource):
    def post(self):
        print(rt)
        parser.add_argument('service', help='This field cannot be blank', required=True)
        parser.add_argument('questions', help='Please enter at least 6 characters', required=True)

        data = parser.parse_args()
        print(data)
        new_test = rt.RecruitementTest(
            service=data['service'],
        )

        try:
            print(new_test)
            new_test.save()
            return {
                'message': 'Recruitment Test {} was created'
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500
    
    def get(self, id=None):
        try:
            if id is None:
                print(rt.RecruitementTest)
                response = rt.RecruitementTest.objects.all()
            else:
                response = rt.RecruitementTest.objects.get(id)
            return {
                'response': '{}'.format(json.loads(response.to_json()))
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500
    