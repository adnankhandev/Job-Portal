# Download the helper library from https://www.twilio.com/docs/python/install
from twilio.rest import Client
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required

class sendMessage(Resource):
    @jwt_required
    def post(self, number):
        # Your Account Sid and Auth Token from twilio.com/console
        # DANGER! This is insecure. See http://twil.io/secure
        account_sid = 'AC5ded15bac3baebeac266e484143cce2a'
        auth_token = 'd04238ee9d2cb6ab42732bc2148f8e2d'
        client = Client(account_sid, auth_token)
        try:
            message = client.messages.create(
                            body="Maid of London, are you ready?",
                            from_='+12056289220',
                            to='+' + number
                        )

            print(message.sid)
            return {
                'message': 'Message sent'
            }, 200
        except Exception as e:
            print(e.message)
            return {
                'message': 'Something unexpected happend'
            }, 500