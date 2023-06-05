from flask import Flask, redirect, render_template, request, session, url_for
from flask_socketio import SocketIO

app = Flask(__name__) 
#if things don't work maybe we need a secret key
socketio = SocketIO(app)

@app.route("/", methods=['GET', 'POST'])
def root():
    return render_template("home.html")

@app.route("/game", methods=['GET', 'POST'])
def gamePage():
    return render_template("game.html")

# @socketio.on('message')
# def handle_message(data):
#     print('received message: ' + data)

@socketio.on('my event')
def handle_my_custom_event(json):
    print('received json: ' + str(json))

@socketio.on('I want a game id')
def give_game_id():
    print("receiving client request")

if __name__ == "__main__":
    app.debug = True
    #app.run()
    socketio.run(app)