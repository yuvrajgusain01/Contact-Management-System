# Contact Management System

A full-stack Contact Management System built using **FastAPI, Python, PostgreSQL, SQLAlchemy, HTML, CSS, and JavaScript**. The application allows users to create, view, search, update, and delete contact information through a web interface.

## Live Demo

- **Frontend:** [Contact Management System](https://contact-management-system-frontend-ruby.vercel.app/)
- **Backend API:** [FastAPI Backend](https://contact-management-system-4.onrender.com/)
- **API Documentation:** [Swagger UI](https://contact-management-system-4.onrender.com/docs)

## Features

- Add new contacts with name, email, phone number, and address.
- View all saved contacts.
- Search contacts by name, email, phone number, or address.
- Update existing contact information.
- Delete contacts.
- Validate input using Pydantic.
- Prevent duplicate email addresses.
- Store contact information in a PostgreSQL database.
- Access API endpoints through Swagger UI.

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL
- Uvicorn

### Frontend
- HTML
- CSS
- JavaScript

### Deployment
- Render — Backend and PostgreSQL database
- Vercel — Frontend

## Project Structure

```text
Contact-Management-System/
│
├── backend/
│   ├── main.py
│   ├── databaseModel.py
│   ├── dbConfig.py
│   ├── pydanticModel.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/contacts` | Retrieve all contacts |
| GET | `/contacts/{contact_id}` | Retrieve a contact by ID |
| POST | `/contact` | Create a new contact |
| PUT | `/contact/{contact_id}` | Update an existing contact |
| DELETE | `/contact/{contact_id}` | Delete a contact |

### Example: Create a Contact

Request:

```http
POST /contact
Content-Type: application/json
```

Request body:

```json
{
  "contactName": "Yuvraj Gusain",
  "email": "yuvraj@example.com",
  "phone": "9876543210",
  "address": "Dehradun, India"
}
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Contact-Management-System.git
cd Contact-Management-System
```

### 2. Set up the backend

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv myenv
```

Windows PowerShell:

```powershell
.\myenv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure the database

Create a PostgreSQL database and configure the `DATABASE_URL` environment variable.

Windows PowerShell:

```powershell
$env:DATABASE_URL="postgresql://username:password@localhost:5432/contact_management"
```

Replace the example credentials and database name with your actual PostgreSQL details.

### 4. Run the backend

```bash
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Open the interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 5. Run the frontend

Open `frontend/index.html` in your browser or use a local development server.

Make sure the API URL in `frontend/script.js` points to your local backend:

```javascript
const API_URL = "http://127.0.0.1:8000";
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL |

**Important:** Never commit database passwords or other secrets to GitHub. Configure environment variables in your deployment platform.

## Future Improvements

- User authentication and authorization
- Pagination for large contact lists
- Improved input validation
- Automated backend tests
- Contact profile images

## License

This project is open source and available under the [MIT License](https://opensource.org/license/mit).
