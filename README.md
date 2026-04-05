# Web Application and Programming Lab

This repository contains Lab 1 to Lab 6 work for web application and programming coursework, covering static web pages, JavaScript apps, event-driven UI, Django backend development, security-focused PHP examples, and a full-stack CRUD system.

## Labs and Projects (Core Description)

- **Lab 1**: Static website development (portfolio and blog style pages with HTML/CSS).
- **Lab 2**: Core JavaScript apps (calculator, quiz, random generator, marks analyzer, todo list).
- **Lab 3**: Event-driven JavaScript mini projects and a combined report.
- **Lab 4**: Django application demonstrating server-side web concepts and CRUD workflows.
- **Lab 5**: Web security lab examples focused on XSS, SQL injection, and CSRF concepts.
- **Lab 6**: Student Record Management System (Django REST API backend + React frontend CRUD).

## Directory Structure (Labs and Projects)

```text
web_application_and_programming_lab/
├── lab_1/                       # Static web pages (HTML/CSS)
│   ├── blogwebsite/             # Blog-style pages
│   └── portfolio/               # Personal portfolio page
├── lab_2/                       # JavaScript fundamentals mini apps
│   ├── claculator/              # Basic calculator app
│   ├── quiz_app/                # Quiz with scoring logic
│   ├── random_number_generator/ # Random number utility
│   ├── student_marks_analyzer/  # Student marks processing app
│   └── todo_list/               # Task management app
├── lab_3/                       # Event-driven JavaScript projects
│   ├── dynamic_table_generator/         # Table creation with dynamic rows
│   ├── event_driven_color_theme_manager/# Theme switching demo
│   ├── form_validation_system/          # Client-side validation project
│   └── timekeeper_hub/                  # Time and event utility app
├── lab_4/                       # Django server-side development lab
│   └── django_lab4/             # Main Django workspace
│       ├── lab4_project/        # Project configuration (settings, urls)
│       ├── learning_hub/        # App logic, models, views, templates
│       └── static/              # Shared static assets
├── lab_5/                       # Web security demonstrations (PHP)
└── lab_6/                       # Full-stack student record system
│       ├── lab4_project/        # Project configuration (settings, urls)
│       ├── learning_hub/        # App logic, models, views, templates
│       ├── backend/                 # Django REST API backend   
│       └──  frontend/                # React + Vite frontend

```

## Dependencies

### Python / Django (for backend labs)
- Django
- djangorestframework
- django-cors-headers

Install using:
```cmd
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### React / Frontend (for Lab 6)
- react
- react-dom
- axios
- vite

Install and run (Lab 6 frontend):
```cmd
cd lab_6\frontend
npm install
npm run dev
```

Run backend (Lab 6):
```cmd
cd lab_6\backend
..\..\.venv\Scripts\python manage.py runserver
```

## Author
Kushal Regmi

## License
This project is licensed under the terms in the LICENSE file.
