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


    def find_user_by_username(uname):
        user = me.objects(username=uname).first()
        if not user:
            return {'error': 'Ill give you a token if youre really smart'}
        user = json.loads(user.to_json())
        return user


class RevokedTokens(me.Document):
    meta = {'collection': 'revoked_tokens'}

    jti = me.StringField(max_length=120, unique=True)

    def is_jti_blacklisted(jti):
        return jti

    