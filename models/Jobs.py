import mongoengine as me
import json

class Jobs(me.Document):
    meta = {'collection': 'jobs'}

    job_title = me.StringField()
    customer_name = me.StringField()
    job_description = me.StringField()
    required_services = me.ListField(me.ReferenceField('Services'), reverse_delete_rule=1)
    start_date_to_apply = me.DateTimeField()
    last_date_to_apply = me.DateTimeField()
    pay = me.StringField()