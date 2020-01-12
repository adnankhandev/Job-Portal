class RevokedTokens(me.Document):
    meta = {'collection': 'revoked_tokens'}

    jti = me.StringField(max_length=120, unique=True)

    @classmethod
    def is_jti_blacklisted(cls, jti):
        return bool(cls.objects(jti=jti).first())
 

    