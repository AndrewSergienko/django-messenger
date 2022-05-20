import json
from django.test import TestCase
from .models import CustomUser


def get_response_and_json(client, path, fields):
    response = client.post(path, fields)
    return response, json.loads(response.content.decode())


class AccountTests(TestCase):
    def test_reg_wrong_fields(self):
        fields = {
            'email': 'wrong',
            'password': '1234',
            'username': '0',
            'first_name': 'Unit',
            'last_name': 'Test'
        }
        response, resp_json = get_response_and_json(self.client, '/api/users/', fields)
        self.assertEqual(resp_json['email'], ['not valid'])
        self.assertEqual(resp_json['password'], ['short', 'common', 'onlynums'])
        self.assertEqual(resp_json['username'], ['short'])

    def test_reg_empty_fields(self):
        fields = {
            'email': '',
            'password': '',
            'username': '',
            'first_name': '',
            'last_name': ''
        }
        response, resp_json = get_response_and_json(self.client, '/api/users/', fields)
        self.assertEqual(resp_json['email'], ['no value'])
        self.assertEqual(resp_json['password'], ['no value'])
        self.assertEqual(resp_json['username'], ['no value'])
        self.assertEqual(resp_json['first_name'], ['no value'])

    def test_reg_duplicate_fields(self):
        fields = {
            'email': '1@unittest.user',
            'password': 'abobaaboba',
            'username': 'test',
            'first_name': 'Unit',
            'last_name': 'Test'
        }
        # Користувач з такими ж данними
        CustomUser(**fields).save()

        response, resp_json = get_response_and_json(self.client, '/api/users/', fields)
        self.assertEqual(resp_json['email'], ['user exist'])
        self.assertEqual(resp_json['username'], ['user exist'])

    def test_correct_registration(self):
        fields = {
            'email': '2@unittest.user',
            'password': 'abobaaboba',
            'username': 'test2',
            'first_name': 'Unit',
            'last_name': 'Test'
        }
        response = self.client.post('/api/users/', fields)
        self.assertEqual(response.status_code, 201)
