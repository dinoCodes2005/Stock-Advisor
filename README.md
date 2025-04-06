# Stock Advisor Website

A web app for stock market analysis using **Next.js** (frontend) and **Django** (backend), integrating **nsepython** and **yfinance** for live data.

## Features

- Real-time stock data from NSE and Yahoo Finance
- Modern frontend with Next.js
- REST API powered by Django
- Data from `nsepython` and `yfinance`

## Tech Stack

- **Frontend**: Next JS
- **Backend**: Django (DRF)
- **Database**: SQLite3
- **Stock Data APIs**: `nsepython`, `yfinance`

## Installation

### Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
cd frontend
npm i --legacy-peer-deps
npm run dev
