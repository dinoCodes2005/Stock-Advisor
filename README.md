# Stock Advisor Website

A web app for stock market analysis using **Next.js** (frontend) and **Django** (backend), integrating **nsepython** and **yfinance** for live data.

![Stock Advisor Screenshot](https://github.com/dinoCodes2005/Stock-Advisor/blob/main/home.png?raw=true)
![Invest Page](https://github.com/dinoCodes2005/Stock-Advisor/blob/main/invest.png)
![Consult with AI page](https://github.com/dinoCodes2005/Stock-Advisor/blob/main/consult.png)

## Features

- Real-time stock data from NSE and Yahoo Finance
- Modern frontend with Next.js
- REST API powered by Django
- Data from `nsepython` and `yfinance`

## Tech Stack

- **Frontend**: Next.js
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
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Frontend (Next JS)
```bash
cd frontend
npm install
npm run dev
```
