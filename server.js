import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import staffRoutes from './routes/staff';
import clientRoutes from './routes/client';
import leadRoutes from './routes/lead';
import calendarRoutes from './routes/calendar';
import Staff from './models/staff';
import Client from './models/client';
import Lead from './models/lead';
import Calendar from './models/calendar';

// Routes
app.use('/staff', staffRoutes);
app.use('/client', clientRoutes);
app.use('/lead', leadRoutes);
app.use('/calendar', calendarRoutes);


// Connect to Staff MongoDB
mongoose.connect(process.env.MONGODB_URI_Staff, { useNewUrlParser: true })
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.log(err);
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + process.env.MONGODB_URI_Staff);
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

// Connect to Client MongoDB
mongoose.connect(process.env.MONGODB_URI_Client, { useNewUrlParser: true })
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.log(err);
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + process.env.MONGODB_URI_Client);
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

// Connect to Lead MongoDB
mongoose.connect(process.env.MONGODB_URI_Lead, { useNewUrlParser: true })
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.log(err);
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + process.env.MONGODB_URI_Lead);
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

// Connect to Calendar MongoDB
mongoose.connect(process.env.MONGODB_URI_Calendar, { useNewUrlParser: true })
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.log(err);
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ' + process.env.MONGODB_URI_Calendar);
});

mongoose.connection.on('error', (err) => {
    console.log(err);
}); 

//Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});    