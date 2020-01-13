
import mongoengine as me

class Question(me.EmbeddedDocument):
    question = me.StringField()
    options = me.StringField() 