# InfoHub - Multi-Utility Single Page Application

A full-stack web application that integrates three everyday utilities into a unified interface: Real-time Weather Display, Currency Converter, and Motivational Quote Generator.

## 🎯 Project Overview

InfoHub is a single-page application (SPA) built to demonstrate proficiency in React, Node.js/Express, and API integration. The application seamlessly combines three distinct modules without requiring page reloads.

## ✨ Features

### 1. **Weather Module**
- Real-time weather information for any city
- City search functionality
- Temperature, weather conditions, and weather code
- Weather effects explanation (health, daily activities, transportation impacts)
- Uses Open-Meteo API (free, no API key required)

### 2. **Currency Converter**
- Convert between multiple currencies (INR, USD, EUR, GBP, AUD, CAD, JPY, CNY, AED, SGD)
- Real-time exchange rates
- Currency symbols display
- Recent conversion tracking (shows last 60 seconds)
- Supports any currency pair (not limited to INR→USD/EUR)
- Uses ExchangeRate-API (free, no API key required)

### 3. **Quote Generator**
- Random motivational quotes from famous personalities
- Auto-refresh every 30 seconds
- Manual refresh button
- Like/Save quotes feature (stored in localStorage)
- Multiple API fallbacks for reliability
- Uses API Ninjas Quotes API (with API key) + fallbacks

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **Axios** - HTTP client for API calls
- **CSS Modules** - Component styling
- **React Hooks** - useState, useEffect for state management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for external APIs
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External APIs
- **Open-Meteo** - Weather data
- **ExchangeRate-API** - Currency exchange rates
- **API Ninjas** - Quotes (with API key)
- **Quotable.io** - Quote fallback
- **ZenQuotes.io** - Quote fallback

## 📁 Project Structure

```
InfoHub-Challenge/
├── client/                      # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WeatherModule.jsx
│   │   │   ├── WeatherModule.css
│   │   │   ├── CurrencyConverter.jsx
│   │   │   ├── CurrencyConverter.css
│   │   │   ├── QuoteGenerator.jsx
│   │   │   └── QuoteGenerator.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── vite.config.js
│   └── package.json
│
└── server/                      # Node.js/Express Backend
    ├── server.js               # Main Express server
    ├── .env                     # Environment variables (create this)
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- Code Editor (VS Code recommended)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd InfoHub-Challenge
```

### Step 2: Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```bash
touch .env
```

4. Add the following to `.env`:
```env
PORT=3001
API_NINJAS_KEY=aXJF8DUXeo1vjs0NG1T0qg==VvdhTgHRKpseEVLu
WEATHER_CITY=Hyderabad
```

5. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:3001`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar Vite port)

## 📡 API Endpoints

### Weather API
```
GET /api/weather
GET /api/weather?city=London
GET /api/weather?city=New%20York
```

**Response:**
```json
{
  "city": "Hyderabad",
  "temperature": 28.5,
  "condition": "Temperature: 28.5°C, Weather code: 0",
  "effects": "Weather effects explanation...",
  "provider": "open-meteo"
}
```

### Currency API
```
GET /api/currency?amount=100&from=INR&to=USD
GET /api/currency?amount=500&from=EUR&to=GBP
```

**Response:**
```json
{
  "base": "INR",
  "amount": 100,
  "USD": 1.20,
  "fromSymbol": "₹",
  "toSymbol": "$",
  "fromName": "INR",
  "toName": "USD",
  "rate": 0.012
}
```

### Quote API
```
GET /api/quote
```

**Response:**
```json
{
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs"
}
```

## 🎮 Usage

1. **Home Page**: Click on any of the three cards (Weather, Currency, Quotes) to navigate to that module.

2. **Weather Module**:
   - View weather for default city (Hyderabad)
   - Enter any city name in the search box
   - Click "Search" to get weather information
   - See temperature, conditions, and weather effects

3. **Currency Converter**:
   - Enter amount to convert
   - Select source currency (from)
   - Select target currency (to)
   - Click "Convert" to see the result
   - View recent conversion (last 60 seconds)

4. **Quote Generator**:
   - View random motivational quotes
   - Quotes auto-refresh every 30 seconds
   - Click "New Quote" for instant refresh
   - Click "Like" to save quotes locally
   - View all liked quotes at the bottom

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Port
PORT=3001

# API Ninjas Quotes API Key
API_NINJAS_KEY=your_api_key_here

# Default Weather City
WEATHER_CITY=Hyderabad
```

### API Keys

- **API Ninjas**: Required for quotes API. Get your key from [API Ninjas](https://api-ninjas.com/)
- **Weather & Currency**: No API keys required (using free APIs)

## 🐛 Troubleshooting

### Backend Issues

1. **Port already in use**:
   - Change `PORT` in `.env` file
   - Or kill the process using port 3001

2. **API errors**:
   - Check your internet connection
   - Verify API keys in `.env` file
   - Check server console for detailed error messages

### Frontend Issues

1. **API calls failing**:
   - Ensure backend server is running on port 3001
   - Check `vite.config.js` for proxy configuration
   - Verify CORS is enabled in backend

2. **Styles not loading**:
   - Clear browser cache
   - Restart the development server

## 🌐 Deployment

### Backend Deployment

1. **Vercel/Netlify**:
   - Deploy as serverless function
   - Add environment variables in platform settings

2. **Heroku**:
   ```bash
   heroku create your-app-name
   heroku config:set API_NINJAS_KEY=your_key
   git push heroku main
   ```

### Frontend Deployment

1. **Build the app**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel/Netlify**:
   - Connect your GitHub repository
   - Configure build settings
   - Set environment variables if needed

## 📝 Development Notes

- All API calls are wrapped in try-catch blocks
- Loading states are shown during API calls
- Error messages are displayed to users
- Multiple API fallbacks ensure reliability
- LocalStorage is used for quote persistence

## 🎨 Features Beyond Requirements

- ✅ City search in weather module
- ✅ Weather effects explanation
- ✅ Multiple currency support (10+ currencies)
- ✅ Currency symbols display
- ✅ Recent conversion tracking
- ✅ Auto-refresh quotes (30 seconds)
- ✅ Like/save quotes feature
- ✅ Multiple API fallbacks for quotes

## 📄 License

This project is part of the ByteXL Coding Challenge.

## 👨‍💻 Author

Built as part of the InfoHub Challenge assignment.

---

**Note**: Make sure both the backend (port 3001) and frontend (port 5173) servers are running simultaneously for the application to work properly.

