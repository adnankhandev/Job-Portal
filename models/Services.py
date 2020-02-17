import mongoengine as me
import json
from models import Questions

class Services(me.Document):
    meta = {'collection': 'services'}

    service = me.StringField(max_length=20)
    description = me.StringField(max_length=120)
    questions = me.ListField(me.StringField())
