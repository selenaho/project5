from flask import Flask, redirect, render_template, request, session, url_for, flash, get_flashed_messages
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import random
import string
import uuid

app = Flask(__name__) 
app.secret_key="asldkfjalko3inf2309urehdn"
socketio = SocketIO(app, manage_session=False)

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

games = {}
# { <game_id>: {usernames: [<user>], ready: [<user>], <color>: (<x>,<y>)} }


@app.route("/", methods=['GET', 'POST'])
def root():
    if request.method == "GET":
        return render_template("home.html")
    else:
        game_id = request.form.get("game_id")
        username = request.form.get("username")

        if len(game_id) != 5:
            return render_template("home.html", error = "Invalid join code")
        if game_id in games:
            if len(games[game_id]) == 2:
                return render_template("home.html", error = "Room full")
            if username in games[game_id]:
                return render_template("home.html", error = "Name taken")
        flash(username)
        return redirect(url_for("roomPage", game_id = game_id))


# TODO: check if gameid in games
@app.route("/room/<game_id>", methods=['GET', 'POST'])
def roomPage(game_id):
    return render_template("room.html", username=get_flashed_messages()[0])


@app.route("/game/<game_id>", methods=['GET', 'POST'])
def gamePage(game_id):
    if request.method == "POST":
        return render_template("game.html", color=request.form.get("color"))
    return redirect(url_for('root'))

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

# doesnt work if user leaves room though
@socketio.on('sendusername')
def on_sendusername(data):
    game_id = data['game_id']
    join_room(game_id)

    if game_id in games and data['username'] not in games[game_id]['usernames']:
        games[game_id]['usernames'].append(data['username'])
    else:
        games[game_id] = {'usernames': [data['username']]}
    send(games[game_id]['usernames'] , to=game_id)

@socketio.on('checked')
def on_checked(data):
    game_id = data['game_id']
    if 'ready' in games[game_id]:
        games[game_id]['ready'].append(data['username'])
    else:
        games[game_id]['ready']=[data['username']]
    color=("red","green")[games[game_id]['ready'].index(data['username'])]

    emit('color', [data['username'], color],to=game_id)
    if len(games[game_id]['ready']) >= 2:
        emit('readyToPlay', game_id, to=game_id)

    
@socketio.on('unchecked')
def on_unchecked(data):
    game_id = data['game_id']
    games[game_id]['ready'].remove(data['username'])

bird_positions = {}
# { game_id: {color: (x,y)} }

@socketio.on("gamestart")
def on_start(color):
    if bird_positions:
        bird_positions[color] = (800,0)
    else:
        bird_positions[color] = (0,0)

@socketio.on('keystroke')
def on_keystroke(data):
    pass


# @socketio.on('sendToGame')
# def on_sendToGame():
#     print("SEND TO GAME")
#     return redirect(url_for("gamePage", game_id = game_id))

if __name__ == "__main__":
    app.debug = True
    #app.run()
    socketio.run(app)