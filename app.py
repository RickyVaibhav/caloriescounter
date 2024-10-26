from flask import Flask, jsonify, request, render_template
import pandas as pd

app = Flask(__name__)

# Load the dataset with proper handling for bad lines and delimiters
DATASET_FILE = r'C:\Users\Administrator\Desktop\Calorie-Counter-master\Food and Calories - Sheet1.csv'

try:
    data = pd.read_csv(DATASET_FILE, delimiter='\t', on_bad_lines='skip')
    print("Data loaded successfully.")
except pd.errors.ParserError as e:
    print(f"Error parsing the file: {e}")
except Exception as e:
    print(f"Some other error occurred: {e}")

# Helper function to calculate calories based on food items and quantities
def calculate_calories(food_items):
    print(data.columns)
    total_calories = 0
    for item in food_items:
        food_name = item['name']
        quantity = float(item['quantity'])

        # Find the food in the dataset
        row = data[data["Food"].str.lower() == food_name.lower()]
        if not row.empty:
            calories_per_unit = int(row['Calories'].values[0].split()[0])
            print(calories_per_unit)
            total_calories += calories_per_unit * quantity
    return total_calories

# Route for the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Route to calculate calories
@app.route('/calculate', methods=['POST'])
def calculate():
    food_items = request.json.get('foodItems', [])
    total_calories = calculate_calories(food_items)
    return jsonify({'total_calories': total_calories})

if __name__ == '__main__':
    app.run(debug=True)
