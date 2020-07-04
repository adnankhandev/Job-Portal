
import mongoengine as me

class Questions(me.Document):
    meta = {'collection': 'questions'}
    
    multiple_choice = me.BooleanField()
    question = me.StringField()
    options = me.ListField(me.StringField())
    answer = me.StringField()