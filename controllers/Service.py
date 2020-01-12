from utilities import (
    min_length
)
from flask_restful import Resource, reqparse
from models import Services as rt
import json

parser = reqparse.RequestParser()

class Service(Resource):
    def post(self):
        parser.add_argument('service', help='This field cannot be blank', required=True)
        parser.add_argument('questions', help='This field cannot be blank', action='append', location='json', required=True)
        print(parser)
        data = parser.parse_args()
        new_test = rt.Services(
            service=data['service'],
            questions=data['questions']
        )

        try:
            print(new_test)
            new_test.save()
            return {
                'message': 'Service {} was created'.format(data['service'])
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500
    
    def get(self, id=None):
        try:
            if id is None:
                print(rt.Services)
                response = rt.Services.objects.all()
            else:
                response = rt.Services.objects.get(id=id)
            return {
                'response': '{}'.format(json.loads(response.to_json()))
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 500
    