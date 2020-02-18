
import mongoengine as me

class Questions(me.Document):
    meta = {'collection': 'questions'}
    
    multiple_choice = me.BooleanField()
    general_questions = me.StringField()
    options = me.ListField()
    answer = me.StringField()