
# using SendGrid's Python Library
# https://github.com/sendgrid/sendgrid-python
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required

class sendEmail(Resource):
    @jwt_required
    def post(self, email):
        message = Mail(
        from_email='maryem.fatima96@gmail.com',
        to_emails=email,
        subject='Maid of London, are you ready?',
        html_content='Hello, Im darth vader. Here to take over earth')
        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            return {
                'message': 'Message sent'
            }, 200
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            print(e)
            return {
                'message': 'Something unexpected happened'
            }, 400
    
class sendReferenceEmail(Resource):
    def sendEmail(email, url):
        message = Mail(
        from_email='maryem.fatima96@gmail.com',
        to_emails=email,
        subject='Maid of London, are you ready?',
        html_content='Hello, Im darth vader. Here to take over earth. Please fill this refernce form {}'.format(url))
        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
        except Exception as e:
            print(e)
