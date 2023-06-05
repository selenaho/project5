from flask import Flask, redirect, render_template, request, session, url_for
app = Flask(__name__) 

@app.route("/", methods=['GET', 'POST'])
def root():
    return render_template("home.html")

@app.route("/game", methods=['GET', 'POST'])
def gamePage():
    return render_template("game.html")


if __name__ == "__main__":
    app.debug = True
    app.run()