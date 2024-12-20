# SimQuery-App 🔍✨

A lightweight Flask web application for user authentication, text similarity predictions, and history management. 🚀

## Features 🛠️
- 🔑 Secure user authentication with JWT
- 🧠 Text predictions using GloVe embeddings and cosine similarity
- 📜 Save and view user search history
- 🌐 RESTful API for easy integration

## Technologies Used ⚙️
- **Backend**: Flask, Python
- **NLP**: GloVe, NumPy
- **Database**: SQLite
- **Auth**: JSON Web Tokens (JWT)

## Getting Started 🚀

Follow these steps to set up and run the application:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/SimQuery-App.git
   cd SimQuery-App
Install dependencies: Ensure you have Python 3.8+ and pip installed. Then run:


pip install -r requirements.txt
Set up environment variables: Create a .env file in the root directory of your project with the following content:

makefile
Copiază codul
ACCESS_TOKEN_EXPIRE_MINUTES=30
SECRET_KEY=your_secret_key
Set up the database: Initialize the SQLite database (or configure another database) by running the necessary migrations:

bash
Copiază codul
python -m scripts.initialize_db
Run the application: Start the Flask server:

bash
Copiază codul
python app.py
Open the app in your browser: Navigate to http://127.0.0.1:5000 🌐 to access the application.

Test the endpoints: Use tools like curl or Postman to test the API endpoints. Example:

bash
Copiază codul
curl -X POST http://127.0.0.1:5000/login \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "secret"}'
