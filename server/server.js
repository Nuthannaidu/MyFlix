const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./src/config/db');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

require('./src/config/passport');

const authRoutes = require('./src/routes/auth.routes');
const videoRoutes = require('./src/routes/video.routes');
const { errorHandler } = require('./src/middleware/error.middleware');

const app = express();

// 1. Proxy Trust (Required for Render HTTPS)
app.set('trust proxy', 1);

// 2. CORS (Ensure FRONTEND_URL in Render has NO trailing slash)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Session Store
const sessionStore = new SequelizeStore({ 
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000, 
  expiration: 24 * 60 * 60 * 1000 
});

// 4. Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  name: 'myflix.sid', // Custom cookie name can help avoid conflicts
  cookie: {
    secure: true,      
    sameSite: 'none',  
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// 5. Passport (MUST be after session)
app.use(passport.initialize());
app.use(passport.session());

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Database Sync Error:', err);
});