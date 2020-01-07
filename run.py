from flask import Flask
from flask_restful import Api
import resources
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager


app = Flask(__name__)
api = Api(app)

# JWT
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)


# Registering endpoints
api.add_resource(resources.InitialRegistration, '/api/v1/registration/initial')
api.add_resource(resources.UserLogin, '/api/v1/login')
api.add_resource(resources.UserLogoutAccess, '/api/v1/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/api/v1/logout/refresh')
api.add_resource(resources.TokenRefresh, '/api/v1/token/refresh')
api.add_resource(resources.AllUsers, '/api/v1/users')
api.add_resource(resources.SecretResource, '/api/v1/secret')


# Setting up database
app.config['MONGODB_SETTINGS'] = {
    "db": "jobPortal",
}
db = MongoEngine(app)