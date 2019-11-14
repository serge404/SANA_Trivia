import pyrebase

from flask import Flask, flash, redirect, render_template, \
     request, url_for

app = Flask(__name__)

config = {
"apiKey": "AIzaSyB9SoquwFANP1i0sGh8enX63-s1TdpdX9I",
"authDomain": "sana-trivia.firebaseapp.com",
"databaseURL": "https://sana-trivia.firebaseio.com",
"projectId": "sana-trivia",
"storageBucket": "sana-trivia.appspot.com",
"messagingSenderId": "152446053252",
"appId": "1:152446053252:web:8b09b32430ce4dd1c50bd1",
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

auth = firebase.auth()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/landing/<username>')
def landingPage():
    return render_template('landing.html', username=username)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    unsuccessful = 'Please check your credentials'

    if request.method == 'POST':
        email = request.form['username']
        password = request.form['password']

        try:
             auth.sign_in_with_email_and_password(email, password)
             return render_template('landing.html', username=email)
        except:
             return render_template('login.html', us=unsuccessful)

    return render_template('login.html', error=error)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    error = None
    mesg = 'Please enter your credentials'
    unsuccessful = 'Username Exist, or password must be 6 characters'

    if request.method == 'POST':
        email = request.form['username']
        password = request.form['password']

        try:
             auth.create_user_with_email_and_password(email, password)
             return render_template('landing.html', username=email)
        except:
             return render_template('signup.html', us=unsuccessful)

    return render_template('signup.html', error=error)



if __name__ == '__main__':
      app.run()
