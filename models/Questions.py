
import mongoengine as me

class Questions(me.Document):
    meta = {'collection': 'questions'}
    
    multiple_choice = me.StringField()
    general_questions = me.ListField()
    options = me.StringField() 
    answer = me.StringField()