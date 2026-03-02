# Jonglei State Youth Union Website

The official website for the Jonglei State Youth Union (JSYU), the primary representative body for young people in Jonglei State, South Sudan.

## About

The Jonglei State Youth Union is an independent, non-political, and non-profit civil society organization. Its core mandate includes:

- **Youth Representation** – Promoting institutionalized representation of youth in state and county-level decision-making
- **Peacebuilding** – Facilitating dialogues between different ethnic communities to mitigate inter-communal violence
- **Youth Empowerment** – Advocating for access to quality education, vocational training, and economic opportunities
- **Humanitarian Advocacy** – Advocating for humanitarian access and support for displaced youth

## Tech Stack

- **Backend:** Laravel (PHP)
- **Frontend:** React, Inertia.js, Tailwind CSS, Vite
- **Database:** SQLite (default) / MySQL

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory.
2. Run `composer install` to install PHP dependencies.
3. Run `npm install` to install Node dependencies.
4. Copy `.env.example` to `.env` and configure.
5. Run `php artisan key:generate`.
6. Run `php artisan migrate`.
7. Run `npm run build` to build frontend assets.
8. Run `php artisan serve` to start the development server.

### Development

- **Backend:** `php artisan serve` (serves at http://localhost:8000)
- **Frontend (hot reload):** `npm run dev` (Vite dev server)
- **Production build:** `npm run build`

## Structure

- Public home page with hero, about, programs, and CTA sections
- Programs page describing Youth Representation, Peacebuilding, Education, and Humanitarian Advocacy
- Student dashboard (authenticated members)
- Admin dashboard (administrators)
- Authentication (login, register, password reset)
