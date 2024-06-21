from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route('/run_script', methods=['POST'])
def run_script():
    try:
        # Run the Python script using subprocess
        subprocess.run(['python3', 'CSV1.py', '15/05/24,00:00:00', '20/06/24,23:59:59'])
        return 'Script executed successfully', 200
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True)
