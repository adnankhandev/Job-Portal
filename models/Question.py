
import mongoengine as me
import json


class Question(me.EmbeddedDocument):
    question = me.StringField()
    options = me.StringField() 