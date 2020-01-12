import mongoengine as me
import json

class PersonalDetails(me.Document):
    date_of_birth = me.DateField()
    nationality = me.StringField()
    gender = me.StringField
    home_number = me.IntField()
    current_address = me.StringField()
    postcode = me.IntField()
    duration_of_stay_at_address = me.StringField()
    profile_picture = me.ImageField()


class Users(me.Document):
    meta = {'collection': 'users'}

    title = me.StringField(max_length=10)
    first_name = me.StringField(max_length=50)
    last_name = me.StringField(max_length=50)
    
    email = me.EmailField(unique=True)
    mobile_number = me.StringField(max_length=16, unique=True)

    username = me.StringField(max_length=50, unique=True, nullable=False, required=True)
    password = me.StringField(nullable=False, required=True)

    personal_details = me.ReferenceField('PersonalDetails', reverse_delete_rule=1)

    @classmethod
    def find_user_by_username(cls, uname):
        user = cls.objects(username=uname).first()
        if not user:
            return {'error': 'Ill give you a token if youre really smart'}
        user = json.loads(user.to_json())
        return user
    
    @classmethod
    def find_user_by_id(cls, id):
        user = cls.objects(id=id).first()
        if not user:
            return {'error': 'Ill give you a token if youre really smart'}
        user = json.loads(user.to_json())
        return user

    @classmethod
    def get_all(cls):
        return json.loads(cls.objects().to_json())