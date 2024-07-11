from flask import Flask, request, render_template, session, jsonify
from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "abcde"

boggle_game = Boggle()

@app.route("/")
def show_board():
    """Display board on homepage."""

    board = boggle_game.make_board()
    session["board"] = board
    high_score = session.get("high_score" , 0)
    num_plays = session.get("num_plays" , 0)

    return render_template("index.html" , board=board , high_score=high_score , num_plays=num_plays )

@app.route("/check-word")
def check_word():
    """check if word exists in dictionary."""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board , word)

    return jsonify({"result" : response})

@app.route("/post-score" , methods= ["POST"])
def post_score():
    """Retrieve score, update number of times played, update high score."""

    score = request.json["score"]
    high_score = session.get("high_score" , 0)
    num_plays = session.get("num_plays" , 0)

    session["num_plays"] = num_plays + 1
    session["high_score"] = max(score, high_score)

    return jsonify(brokeRecord = score > high_score)