import mongoengine as me
import json
from models import Question

class Services(me.Document):
    meta = {'collection': 'Services'}

    service = me.StringField(max_length=10)
    questions = me.ListField(me.StringField())
