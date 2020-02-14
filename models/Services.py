import mongoengine as me
import json
from models import Questions

class Services(me.Document):
    meta = {'collection': 'Services'}

    service = me.StringField(max_length=20)
    questions = me.ListField(me.StringField())
