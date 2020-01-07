import mongoengine as me


class UserModel(me.Document):
    meta = {'collection': 'users'}

    title = me.StringField(max_length=10)
    first_name = me.StringField(max_length=50)
    last_name = me.StringField(max_length=50)
    
    email = me.EmailField(unique=True)
    mobile_number = me.StringField(max_length=16, unique=True)

    username = me.StringField(max_length=50, unique=True, nullable=False, required=True)
    password = me.StringField(nullable=False, required=True)