from flask import Flask, redirect, render_template, request, session, url_for
from flask_socketio import SocketIO, send, emit
import random
import string
import uuid

app = Flask(__name__) 
#if things don't work maybe we need a secret key
socketio = SocketIO(app)

@app.route("/", methods=['GET', 'POST'])
def root():
    if request.method == "GET":
        return render_template("home.html")
    else:
        game_id = request.form.get("game_id")
        if len(game_id) != 5:
            return render_template("home.html", error = "Invalid join code")
        return redirect(url_for("roomPage", game_id = game_id))

@app.route("/room/<game_id>", methods=['GET', 'POST'])
def roomPage(game_id):
    if request.method == "GET":
        return render_template("room.html", game_id = game_id)
    else:
        return redirect(url_for("gamePage", game_id = game_id))

@app.route("/game/<game_id>", methods=['GET', 'POST'])
def gamePage(game_id):
    return render_template("game.html")

# @socketio.on('message')
# def handle_message(data):
#     print('received message: ' + data)

@socketio.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))


@socketio.on('I want a game id')
def create_game_id():
    #random letters
    letters = string.ascii_letters
    word = ''.join(random.choice(letters) for i in range(3)) 

    #random digits
    digits = string.digits
    nums = ''.join(random.choice(digits) for i in range(2)) 

    key = word + nums
    # print(key)
    # key = uuid.uuid4()
    # print(key)
    # print("receiving client request")    
    send(str(key))
    


if __name__ == "__main__":
    app.debug = True
    #app.run()
    socketio.run(app)