import mongoengine as me
import json
from models import Services

class PersonalDetails(me.Document):
    date_of_birth = me.DateField()
    nationality = me.StringField()
    gender = me.StringField
    home_number = me.IntField()
    current_address = me.StringField()
    postcode = me.IntField()
    duration_of_stay_at_address = me.StringField()
    profile_picture = me.ImageField()

class References(me.Document):
    name: me.StringField()
    contact_number: me.StringField()
    email = me.StringField()
    address = me.StringField()
    results = me.StringField()

class EmergencyContact(me.Document):
    meta = {'collection': 'emergency_contact'}

    fullname = me.StringField()
    relation = me.StringField()
    contact_number = me.IntField()

class EmployementHistory(me.Document):
    meta = {'collection': 'employement_history'}

    name = me.StringField()
    service_hours= me.IntField()
    salary_per_hour = me.IntField()
    starting_date = me.StringField()
    end_date = me.StringField()
    reasons_of_leaving = me.StringField()
    notes = me.StringField()


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

    user_type = me.StringField() # could be anyone of these 1. Admin 2, Applicant 3. Worker

    reference_details = me.ListField(me.ReferenceField('References', reverse_delete_rule=1))

    emergency_contact_details = me.ReferenceField('EmergencyContact', reverse_delete_rule=1)

    services = me.ListField(me.ReferenceField('Services'), reverse_delete_rule=1)

    employement_history = me.ListField(me.ReferenceField('EmployementHistory'), reverse_delete_rule=1)

    general_question_answers = me.ListField()

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

    # @classmethod
    # def add_reference_details():