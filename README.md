# PersonalVault

> **A Space Where Your Digital World Is Organized, Your Knowledge Lives, and Everything Connects.**

PersonalVault is a personal document and knowledge management application that allows users to store, organize, search, and interact with their uploaded documents.

The project combines a **React frontend** with a **Django REST Framework backend**, **PostgreSQL + pgvector** for vector-based semantic search, **Hugging Face embeddings**, and **Groq** for document-based AI chat.

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* User-specific data isolation

### Vault

* Upload documents
* View uploaded files
* Delete files
* View extracted file content
* File processing status
* Support for PDF, DOCX, TXT, and images

### Document Processing

* PDF text extraction
* DOCX text extraction
* TXT file reading
* Image OCR using Tesseract
* Text chunking
* Vector embedding generation

### Semantic Search

* Search uploaded documents using semantic similarity
* PostgreSQL + pgvector based vector search
* Search history
* Open the corresponding file from search results

### AI Chat

* Ask questions about uploaded documents
* Retrieval of relevant document chunks
* Groq-powered responses
* Responses grounded in uploaded document content
* Display of relevant sources

### Organization

* Collections
* Tags
* Bookmarks
* Automatically detected related documents

### Dashboard

* Total files
* Collections count
* Tags count
* Bookmarks count
* Recent files
* Navigation to major PersonalVault features

### Settings

* User profile information
* Vault statistics
* Collection count
* Tag count
* Bookmark count
* Search history
* Logout

---

# Technology Stack

## Frontend

* React
* JavaScript
* Vite
* Axios
* React Router

## Backend

* Python
* Django
* Django REST Framework
* SimpleJWT

## Database

* PostgreSQL
* pgvector

## AI / Machine Learning

* Hugging Face Inference API
* `sentence-transformers/all-MiniLM-L6-v2`
* Groq API

## Document Processing

* PyMuPDF
* python-docx
* Pillow
* Tesseract OCR

---

# Prerequisites

Before running PersonalVault, make sure the following are installed.

### Required Software

* Git
* Python 3.12+
* Node.js
* npm
* PostgreSQL
* Tesseract OCR

### Required API Keys

The project currently uses:

* Groq API key
* Hugging Face API key

---

# Installation & Setup

## 1. Clone the Repository

Clone the project from GitHub:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd PersonalVault
```

---

# 2. Backend Setup

Open a terminal and move into the backend:

```bash
cd Backend
```

---

## 2.1 Create a Python Virtual Environment

Create the virtual environment:

```bash
python3 -m venv venv
```

Activate it.

### Linux / macOS

```bash
source venv/bin/activate
```

### Windows

```powershell
venv\Scripts\activate
```

After activation, the terminal should show something similar to:

```text
(venv)
```

---

## 2.2 Install Python Dependencies

With the virtual environment activated:

```bash
pip install -r requirements.txt
```

This installs the Python packages required by the Django backend.

---

# 3. PostgreSQL Setup

PersonalVault uses PostgreSQL as its main database.

Make sure PostgreSQL is running.

### Ubuntu / Linux

```bash
sudo systemctl start postgresql
```

Check its status:

```bash
sudo systemctl status postgresql
```

---

## 3.1 Create the Database

Open PostgreSQL:

```bash
sudo -u postgres psql
```

Create the PersonalVault database and user.

Example:

```sql
CREATE USER personalvault_user WITH PASSWORD 'your_password';
CREATE DATABASE personalvault_db OWNER personalvault_user;
```

Connect to the database:

```sql
\c personalvault_db
```

Enable the pgvector extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Exit PostgreSQL:

```sql
\q
```

> If the database and user already exist, do not create them again.

---

# 4. Configure Environment Variables

Inside the `Backend` directory, create a file named:

```text
.env
```

The `.env` file contains configuration that should not be committed to GitHub.

Add the required configuration:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True

DB_NAME=personalvault_db
DB_USER=personalvault_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

GROQ_API_KEY=your_groq_api_key
HF_API_KEY=your_huggingface_api_key
```

Replace the placeholder values with your own values.

### Important

Never upload your `.env` file to GitHub.

The project's `.gitignore` should contain:

```gitignore
.env
```

---

# 5. Install Tesseract OCR

PersonalVault uses Tesseract for extracting text from images.

On Ubuntu:

```bash
sudo apt update
sudo apt install tesseract-ocr
```

Verify the installation:

```bash
tesseract --version
```

If the version is displayed, Tesseract is installed correctly.

---

# 6. Run Django Migrations

Make sure you are inside:

```text
PersonalVault/Backend/
```

and that the virtual environment is activated.

Run:

```bash
python manage.py makemigrations
```

Then:

```bash
python manage.py migrate
```

This creates and updates the database tables required by the project.

If Django displays:

```text
No changes detected
```

for `makemigrations`, there are no new model changes to create.

If Django displays:

```text
No migrations to apply.
```

the database is already up to date.

---

# 7. Start the Django Backend

From:

```text
PersonalVault/Backend/
```

run:

```bash
python manage.py runserver
```

The backend should start at:

```text
http://127.0.0.1:8000/
```

The API is available under:

```text
http://127.0.0.1:8000/api/
```

Keep this terminal running.

---

# 8. Frontend Setup

Open a **second terminal**.

Move to the frontend directory:

```bash
cd PersonalVault/Frontend
```

Install the JavaScript dependencies:

```bash
npm install
```

---

# 9. Start the React Frontend

From the `Frontend` directory:

```bash
npm run dev
```

Vite will provide a local development address, normally:

```text
http://localhost:5173/
```

Open the address in your browser.

---

# How to Run the Project

After the initial installation and configuration are complete, you only need to start the required services.

## Step 1 — Start PostgreSQL

Make sure PostgreSQL is running.

On Ubuntu:

```bash
sudo systemctl start postgresql
```

---

## Step 2 — Start Django

Open Terminal 1:

```bash
cd PersonalVault/Backend
```

Activate the virtual environment:

```bash
source venv/bin/activate
```

Start Django:

```bash
python manage.py runserver
```

Keep this terminal open.

---

## Step 3 — Start React

Open Terminal 2:

```bash
cd PersonalVault/Frontend
```

Start the frontend:

```bash
npm run dev
```

Keep this terminal open.

---

## Step 4 — Open PersonalVault

Open:

```text
http://localhost:5173
```

The complete application should now be running.

---

# First-Time Usage

## 1. Create an Account

Open the Register page:

```text
/register
```

Enter:

* Username
* Email
* Password

Click:

```text
Create Account
```

---

## 2. Sign In

Open:

```text
/login
```

Enter your username and password.

After successful login, the application stores the JWT authentication token and takes you to the Dashboard.

---

# Using the Application

## Dashboard

The Dashboard provides an overview of your PersonalVault.

It currently displays:

* File statistics
* Collection statistics
* Tag statistics
* Bookmark statistics
* Recent files

The Dashboard also provides navigation to the main application sections.

---

## Vault

The Vault is where uploaded files are stored.

You can:

* Upload files
* View files
* Open file content
* Delete files
* View related documents

Currently supported file types include:

```text
PDF
DOCX
TXT
PNG
JPG
JPEG
```

---

## File Processing

After a file is uploaded, PersonalVault extracts its text based on the file type.

### PDF

PDF text is extracted using PyMuPDF.

### DOCX

DOCX text is extracted using `python-docx`.

### TXT

Text files are read directly.

### Images

Images are processed using Tesseract OCR.

The extracted text is stored with the file.

---

# Semantic Search

PersonalVault uses vector embeddings to perform semantic search.

The process is:

```text
File
  ↓
Text Extraction
  ↓
Text Chunking
  ↓
Embedding Generation
  ↓
PostgreSQL + pgvector
  ↓
Semantic Search
```

Uploaded document text is divided into smaller chunks.

Each chunk receives an embedding using:

```text
sentence-transformers/all-MiniLM-L6-v2
```

The embeddings are stored in PostgreSQL using pgvector.

When a user performs a search, the search query is converted into an embedding and compared with the stored document embeddings.

The most semantically similar results are returned.

---

# Search

The Search page allows users to search through their uploaded documents.

The search flow is:

```text
User Query
    ↓
Query Embedding
    ↓
Vector Similarity Search
    ↓
Matching Document Chunks
    ↓
Search Results
```

Search queries are also stored in Search History.

Clicking a search result opens the corresponding file's content page.

---

# AI Chat

The AI Chat feature allows users to ask questions based on their uploaded documents.

The current flow is:

```text
User Question
      ↓
Semantic Search
      ↓
Relevant Document Chunks
      ↓
Groq
      ↓
Answer
```

The retrieved document content is provided to the AI so that the response is based on the user's uploaded documents.

Relevant sources are also displayed with the response.

---

# Collections

Collections allow users to group files together.

For example:

```text
Operating Systems
├── OS_LAB8.docx
├── OS_Similar_Content.docx
└── OS_Notes.pdf
```

Collections are associated with the authenticated user.

---

# Tags

Tags allow users to categorize their files.

Examples:

```text
AI
College
Research
Projects
Notes
```

Tags are associated with the authenticated user.

---

# Bookmarks

Bookmarks allow users to save useful external links.

A bookmark contains:

* URL
* Title
* Description

Bookmarks are associated with the authenticated user.

---

# Related Documents

PersonalVault can identify documents that are semantically related.

When documents are uploaded, their content is compared using vector similarity.

Documents with sufficiently similar content can be identified as related documents.

The related-document functionality is based on semantic similarity between document content.

---

# File Content View

A file can be opened from the Vault.

A file can also be opened directly from Search Results.

Both routes lead to the File Content View.

The File Content View retrieves the selected file from the backend and displays its extracted text.

---

# Settings

The Settings page currently provides:

### Profile Information

* Username
* Email
* User ID
* Account creation information

### Vault Statistics

* Files
* Collections
* Tags
* Bookmarks

### Search History

Previously performed searches are displayed.

### Logout

Users can log out from the application.

---

# Authentication Flow

PersonalVault uses JWT authentication.

The basic authentication flow is:

```text
Register
   ↓
Login
   ↓
JWT Access Token
   ↓
Browser Storage
   ↓
Axios Request
   ↓
Authorization Header
   ↓
Django REST API
```

Protected backend endpoints require authentication.

The backend also filters user-owned data so that users access their own files and related data.

---

# Project Structure

The main project structure is:

```text
PersonalVault/
│
├── Backend/
│   │
│   ├── personalvault/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   ├── apps/
│   │   ├── accounts/
│   │   ├── files/
│   │   ├── search/
│   │   ├── chat/
│   │   └── vault_collections/
│   │
│   ├── media/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
├── Frontend/
│   │
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api/
│   │
│   ├── package.json
│   └── ...
│
└── .gitignore
```

---

# Backend Application Modules

## accounts

Handles:

* User registration
* User information
* Authentication-related functionality

## files

Handles:

* File uploads
* File listing
* File deletion
* Text extraction
* OCR
* File processing

## search

Handles:

* Text chunking
* Embeddings
* Vector search
* Search history

## chat

Handles:

* Document-based AI chat
* Retrieval of relevant document content
* Groq integration

## vault_collections

Handles:

* Collections
* Tags
* Bookmarks
* Related documents

---

# Important Development Commands

## Backend

Activate virtual environment:

```bash
source venv/bin/activate
```

Create migrations:

```bash
python manage.py makemigrations
```

Apply migrations:

```bash
python manage.py migrate
```

Start Django:

```bash
python manage.py runserver
```

Create a Django superuser:

```bash
python manage.py createsuperuser
```

Open Django shell:

```bash
python manage.py shell
```

---

## Frontend

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# Troubleshooting

## Django does not start

Make sure the virtual environment is activated:

```bash
source venv/bin/activate
```

Then run:

```bash
python manage.py runserver
```

If a Python package is missing:

```bash
pip install -r requirements.txt
```

---

## PostgreSQL connection error

Check PostgreSQL:

```bash
sudo systemctl status postgresql
```

Start it if necessary:

```bash
sudo systemctl start postgresql
```

Also verify the database configuration in `.env`.

---

## pgvector error

Make sure the vector extension is enabled:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Frontend cannot connect to backend

Make sure Django is running:

```text
http://127.0.0.1:8000
```

and React is running:

```text
http://localhost:5173
```

The frontend API configuration is located at:

```text
Frontend/src/api/axios.js
```

The API base URL should point to:

```text
http://127.0.0.1:8000/api
```

---

## Image OCR is not working

Check that Tesseract is installed:

```bash
tesseract --version
```

If it is not installed:

```bash
sudo apt update
sudo apt install tesseract-ocr
```

Restart the Django server after installation.

---

## AI Chat is not working

Check that the Groq API key is configured in:

```text
Backend/.env
```

```env
GROQ_API_KEY=your_groq_api_key
```

Restart Django after changing environment variables.

---

## Semantic Search is not working

Check:

1. PostgreSQL is running.
2. The pgvector extension is enabled.
3. `HF_API_KEY` is present in `.env`.
4. Django is running.
5. The uploaded document was processed successfully.

---

# Git and `.gitignore`

The project should not commit sensitive or generated files.

Important entries include:

```gitignore
.env
venv/
__pycache__/
node_modules/
media/
dist/
build/
```

Do not commit:

* API keys
* Database passwords
* `.env`
* Python virtual environments
* Node modules
* Uploaded user files

---

# Complete Startup Checklist

Whenever you want to run PersonalVault:

### 1. Start PostgreSQL

```bash
sudo systemctl start postgresql
```

### 2. Open Terminal 1

```bash
cd PersonalVault/Backend
source venv/bin/activate
python manage.py runserver
```

### 3. Open Terminal 2

```bash
cd PersonalVault/Frontend
npm run dev
```

### 4. Open the application

```text
http://localhost:5173
```

### 5. Sign in

Use an existing account or register a new account.

### 6. Use PersonalVault

You can now:

```text
Upload files
    ↓
Files are processed
    ↓
Text is extracted
    ↓
Embeddings are generated
    ↓
Documents become searchable
    ↓
Use Semantic Search
    ↓
Use AI Chat
    ↓
Organize using Collections and Tags
```

---

# Current Project Status

PersonalVault is currently under development.

The implemented application includes:

* Authentication
* Vault
* File upload
* File deletion
* PDF/DOCX/TXT text extraction
* Image OCR
* Document chunking
* Embeddings
* PostgreSQL + pgvector semantic search
* Search history
* AI Chat
* Collections
* Tags
* Bookmarks
* Related documents
* File Content View
* Dashboard
* Settings

Some additional functionality may be added in future development.

---

# License

This project is currently developed for educational and project-development purposes.
