# SimQuery-App 🔍✨

A lightweight Flask web application for user authentication, text similarity predictions, and history management. 🚀

---

## Features 🛠️

- 🔑 **Secure user authentication** with JWT  
- 🧠 **Text predictions** using GloVe embeddings and cosine similarity  
- 📜 **Save and view** user search history  
- 🌐 **RESTful API** for easy integration  

---

## Technologies Used ⚙️

- **Backend**: Flask, Python  
- **NLP**: GloVe, NumPy  
- **Database**: SQLite  
- **Auth**: JSON Web Tokens (JWT)  

---

## Getting Started 🚀

### Prerequisites
- **Python**: Version 3.8 or higher  
- **pip**: Installed  

---

### Steps to Set Up and Run the Application

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/SimQuery-App.git
   cd SimQuery-App
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:  
   Create a `.env` file in the root directory of the project with the following content:
   ```
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   SECRET_KEY=your_secret_key
   ```

4. **Set up the database**:  
   Initialize the SQLite database (or configure another database) by running:
   ```bash
   python -m scripts.initialize_db
   ```

5. **Run the application**:  
   Start the Flask server:
   ```bash
   python app.py
   ```

6. **Open the app in your browser**:  
   Navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000) 🌐 to access the application.

7. **Test the endpoints**:  
   Use tools like `curl` or Postman to test the API endpoints. Example:
   ```bash
   curl -X POST http://127.0.0.1:5000/login \
   -H "Content-Type: application/json" \
   -d '{"username": "testuser", "password": "secret"}'
   ```
