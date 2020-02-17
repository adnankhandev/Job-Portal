from utilities import (
    min_length
)
from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models import Jobs as jobs
import json
from datetime import datetime

parser = reqparse.RequestParser()

class Jobs(Resource):
    @jwt_required
    def post(self):
        parser.add_argument('job_title', help='This field cannot be blank', required=True)
        parser.add_argument('customer_name', help='This field cannot be blank', required=True)
        parser.add_argument('job_description', help='This field cannot be blank', required=True)
        parser.add_argument('required_services', help='This field cannot be blank', action='append', required=True)
        parser.add_argument('start_date_to_apply', help='This field cannot be blank', required=True)
        parser.add_argument('last_date_to_apply', help='This field cannot be blank', required=True)
        parser.add_argument('pay', help='This field cannot be blank', required=True)
        print(parser)
        data = parser.parse_args()
        print(jobs)
        new_job = jobs.Jobs(
            job_title=data['job_title'],
            customer_name=data['customer_name'],
            job_description=data['job_description'],
            required_services=data['required_services'],
            start_date_to_apply=datetime.strptime(data['start_date_to_apply'], "%a, %d %b %Y %H:%M:%S %Z"),
            last_date_to_apply=datetime.strptime(data['last_date_to_apply'], "%a, %d %b %Y %H:%M:%S %Z"),
            pay=data['pay']
        )

        try:
            print(new_job)
            new_job.save()
            return {
                'message': 'Job with title {} has been created'.format(data['title'])
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400
    
    @jwt_required
    def get(self):
        result = {}
        try:
            response = jobs.Jobs.objects.all()
            result['response'] = response
            return make_response(jsonify(result), 200)
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400

class Job(Resource):
    @jwt_required
    def get(self, jobId):
        result = {}
        try:
            response = jobs.Jobs.objects.get(id=jobId)
            result['response'] = response
            return make_response(jsonify(result), 200)
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400
            
    @jwt_required
    def put(self, jobId):
        parser.add_argument('job_title', help='This field cannot be blank', required=True)
        parser.add_argument('customer_name', help='This field cannot be blank', required=True)
        parser.add_argument('job_description', help='This field cannot be blank', required=True)
        parser.add_argument('required_services', help='This field cannot be blank', action='append', required=True)
        parser.add_argument('start_date_to_apply', help='This field cannot be blank', required=True)
        parser.add_argument('last_date_to_apply', help='This field cannot be blank', required=True)
        parser.add_argument('pay', help='This field cannot be blank', required=True)
        print(parser)
        data = parser.parse_args()
        try:
            response = jobs.Jobs.objects.get(id=jobId)
            if not response:
                return {'error': 'Job doesn\'t exist'}, 404
            updated_service = response.update(
                job_title=data['job_title'],
                required_services=data['required_services'],
                customer_name=data['customer_name'],
                job_description=data['job_description'],
                start_date_to_apply=data['start_date_to_apply'],
                last_date_to_apply=data['last_date_to_apply'],
                pay=data['pay']
            )
            
            return {
                'response': 'Job has been updated'
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400

    @jwt_required  
    def delete(self, jobId):
        try:
            response = jobs.Jobs.objects.get(id=jobId)
            if not response:
                return {'error': 'Job doesn\'t exist'}, 404
            updated_service = response.delete()
            print(updated_service)
            return {
                'response': 'Job has been deleted'
            }, 200
        except Exception as ex:
            print(ex)
            template = "{0}:{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            return {'error': message}, 400
