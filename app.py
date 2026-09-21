from flask import Flask, render_template, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('page1_hero.html')

@app.route('/about-education')
def about_education():
    return render_template('page2_about.html')

@app.route('/interests')
def interests():
    return render_template('page3_interests.html')

@app.route('/art-vault-1')
def art_vault_1():
    return render_template('page4_art1.html')

@app.route('/art-vault-2')
def art_vault_2():
    return render_template('page5_art2.html')

@app.route('/journey')
def journey():
    return render_template('page6_journey.html')

@app.route('/contact')
def contact():
    return render_template('page7_contact.html')

@app.route('/api/theme')
def get_time_theme():
    hour = datetime.now().hour
    if 5 <= hour < 12:
        theme = "morning"
    elif 12 <= hour < 17:
        theme = "afternoon"
    elif 17 <= hour < 21:
        theme = "evening"
    else:
        theme = "night"
    return jsonify({"theme": theme, "hour": hour})

if __name__ == '__main__':
    app.run(debug=True)