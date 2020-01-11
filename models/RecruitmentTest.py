import mongoengine as me
import json


class RecruitementTest(me.Document):
    meta = {'collection': 'recruitementtests'}

    service = me.StringField(max_length=10)
    questions = me.ListField()