from flask import Flask, redirect, render_template, request, session, url_for, flash, get_flashed_messages
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import random
import string

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
        print(games)
        return render_template("home.html")
    else:
        game_id = request.form.get("game_id")
        username = request.form.get("username")

        if len(game_id) != 5:
            return render_template("home.html", error = "Invalid join code")
        if game_id in games:
            if len(games[game_id]['usernames']) == 2:
                return render_template("home.html", error = "Room full")
            if username in games[game_id]:
                return render_template("home.html", error = "Name taken")
        flash(username)
        return redirect(url_for("roomPage", game_id = game_id))


# TODO: check if gameid in games
@app.route("/room/<game_id>", methods=['GET', 'POST'])
def roomPage(game_id):
    return render_template("room.html", game_id = game_id, username=get_flashed_messages()[0])


@app.route("/game/<game_id>", methods=['GET', 'POST'])
def gamePage(game_id):
    if request.method == "POST":
        return render_template("game.html", color=request.form.get("color"), 
                               name=request.form.get("name"), opponent=request.form.get('opponent'))
    return redirect(url_for('root'))

@app.route("/winner/<game_id>", methods=['GET', 'POST'])
def winnerPage(game_id):
    if request.method == "POST":

        winner = request.form.get("winner")
        return render_template("winner.html", winner=winner,game_id=game_id)

## socket-------------------------------------------------------------------------------------------------------
# home socket--------------------------------------------------------------------------------------------
@socketio.on('I want a game id')
def create_game_id():
    #random letters
    letters = string.ascii_letters
    word = ''.join(random.choice(letters) for i in range(3)) 

    #random digits
    digits = string.digits
    nums = ''.join(random.choice(digits) for i in range(2)) 

    key = word + nums   
    send(str(key))

# room socket--------------------------------------------------------------
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

# game socket------------------------------------------------------------------

bird_positions = {}
# { game_id: {
#   <color>: {
#       x: <x>,
#       y: <y>,
#       dir: <dir>     
#   }
# } }
@socketio.on("pooped")
def send_client_poop(data):
    game_id=data['game_id']
    emit("has_pooped", data['color'], to=game_id)

@socketio.on("gamestart")
def on_start(data):
    global bird_positions
    
    
    game_id=data['game_id']

    join_room(game_id)

    color=data['color']
    if game_id in bird_positions:
        bird_positions[game_id][color] = {
            'x': 800, 'y': 0, 'dir': 'upleft',
            'xVel': 0, 'yVel':0, 'isLeft':"left"}
        emit('draw', bird_positions, to=game_id)
    else:
        bird_positions[game_id] = {color: {
            'x': 0, 'y': 0, 'dir': 'up',
            'xVel': 0, 'yVel':0, 'isLeft':""}}


@socketio.on('frame') #TODO: Check points each frame
def frame(data):
    global bird_positions
    game_id=data['game_id']

    # data
    birdImgWidth = 200
    birdImgHeight = 220

    #terminal velocity
    fallVel = 6

    # velocity when first flap
    flapVel = -6

    # xVel
    moveVel = 8
    
    fps = 60
    
    # in relation to fps
    yAcc = 16
    xAcc = 24
    
    #kinematic variables
    kin_var = bird_positions[game_id][data['color']]

    #bounds, acceleration
    kin_var['yVel'] = min(kin_var['yVel']+yAcc/fps, fallVel)
    if kin_var['xVel'] == 0:
        sign = 1
    else:
        sign = kin_var['xVel']/abs(kin_var['xVel'])
    kin_var['xVel'] = sign * max(0,abs(kin_var['xVel'])-xAcc/fps)

    #x-axis bounds
    #if bird goes beyond left bound
    if (kin_var['x'] + birdImgWidth-20 < 0):
        kin_var['x'] = 1000-20
    #if bird goes beyond right bound
    if (kin_var['x']+20 > 1000):
        kin_var['x'] = -1*birdImgWidth+20

    #y-axis bounds
    #hits upper bound
    if (kin_var['y'] + birdImgHeight < 0):
        kin_var['y'] = 600 - birdImgHeight
    #lower bound
    if (kin_var['y'] + birdImgHeight-70 > 600):
        if (data['key']!='up'):
            kin_var['yVel'] = 0
    
    if data['key'] == None:
        kin_var['dir'] = 'up'+kin_var['isLeft']
    else:
        if data['key'] == "up":
            kin_var['yVel'] = flapVel
            kin_var['dir'] = 'down'+kin_var['isLeft']
        elif data['key'] == "left":
            kin_var['xVel'] = -1*moveVel
            kin_var['isLeft'] = 'left'
            kin_var['dir'] = 'mid'+kin_var['isLeft']
        elif data['key'] == "right":
            kin_var['xVel'] = moveVel
            kin_var['isLeft'] = ''
            kin_var['dir'] = 'mid'+kin_var['isLeft']
        elif data['key'] == "down":
            kin_var['yVel'] = flapVel*1.2
            kin_var['xVel'] = flapVel if bool(kin_var['isLeft']) else -1*flapVel # TODO fix
            kin_var['dir'] = 'down'+kin_var['isLeft']
                 

        # adjust bird according to keystroke
    kin_var['x'] += kin_var['xVel']
    kin_var['y'] += kin_var['yVel']
    
    emit('draw', bird_positions, to=game_id)

@socketio.on('collided')
def reset_bird(dataset):
    game_id=dataset[0]['game_id']

    bird_positions[game_id]['red'] = {
            'x': 0, 'y': 0, 'dir': 'up',
            'xVel': 0, 'yVel':0, 'isLeft':""}
    bird_positions[game_id]['green'] = {
            'x': 800, 'y': 0, 'dir': 'upleft',
            'xVel': 0, 'yVel':0, 'isLeft':"left"}
    emit('draw', bird_positions, to=game_id)

    colors = dataset[1]
    emit("point_update",colors, to=game_id)

# winner socket------------------------------------------------------------------
@socketio.on("leave")
def leaveRoom(game_id):
    leave_room(game_id)
    games.pop(game_id)
    

if __name__ == "__main__":
    app.debug = True
    #app.run()
    socketio.run(app)