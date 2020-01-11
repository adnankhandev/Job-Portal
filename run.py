from flask import Flask
from flask_restful import Api
import resources
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
api = Api(app)

# JWT
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)

app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return 1


# Registering endpoints
api.add_resource(resources.InitialRegistration, '/api/v1/registration/initial')
api.add_resource(resources.test, '/api/v1/test')
api.add_resource(resources.UserLogin, '/api/v1/login')
api.add_resource(resources.UserLogoutAccess, '/api/v1/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/api/v1/logout/refresh')
api.add_resource(resources.TokenRefresh, '/api/v1/token/refresh')
api.add_resource(resources.AllUsers, '/api/v1/users')
api.add_resource(resources.SecretResource, '/api/v1/secret')

#Registering database
DB_URI = "mongodb+srv://chameleon:kerberos@cluster0-sbsqw.mongodb.net/test?retryWrites=true&w=majority"

app.config['MONGODB_HOST'] = DB_URI

db = MongoEngine(app)