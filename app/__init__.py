from flask import Flask, redirect, render_template, request, session, url_for

@app.route("/", methods=['GET', 'POST'])
def root():
    return "hello world"

if __name__ == "__main__":
    app.debug = True
    app.run()