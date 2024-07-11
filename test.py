from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setUp(self):
        """Stuff do before every test."""

        self.client = app.test_client()
        app.config["TESTING"] = True
    

    def test_homepage(self):
        """make sure information is in session and html is displayed"""

        with app.test_client() as client:
            resp = client.get("/")
            html = resp.get_data(as_text = True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("board" , session)
            self.assertIsNone(session.get("high_score"))
            self.assertIn("Your high score is <b>0!</b>" , html)
            self.assertIsNone(session.get("num_plays"))

    def non_english_word(self):
        """Test if word is on the board"""

        self.client.get('/')
        response = self.client.get('/check-word?word=fsjdakfkldsfjdslkfjdlksf')
        self.assertEqual(response.json['result'], 'not-word')

    def test_invalid_word(self):
        """test if word is on the board"""

        self.client.get('/')
        response = self.client.get('/check-word?word=happy')
        self.assertEqual(response.json['result'], 'not-on-board')

   