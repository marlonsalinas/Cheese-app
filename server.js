// Dependencies
// .env variables
require('dotenv').config();
// Port and MONGODB_URL from .env
const { PORT = 3000, MONGODB_URL } = process.env;
// Express
const express = require('express');
// App object
const app = express();
// Mongoose import
const mongoose = require('mongoose');
// Middleware import
const cors = require('cors');
const morgan = require('morgan');

// Database connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// Connection events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Models
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    iamge: String,
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

// Middleware
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan('dev')); // logging
app.use(express.json()); // parse json bodies

// Routes
// Test Route
app.get('/', (req, res) => {
    res.send('Cheese Lab');
});

// Cheese index route
app.get('/cheese',  async (req,res) => {
    try {
        // send all people
        res.json(await Cheese.find({}));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// Cheese create route
app.post('/cheese', async (req, res) => {
    try {
        // send all people
        res.json(await Cheese.create(req.body));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// Cheese delete route
app.delete('/cheese/:id', async (req, res) => {
    try {
        // send all people
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// Cheese update route
app.put('/cheese/:id', async (req, res) => {
    try {
        // send all people
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// Listener
app.listen(PORT, () => console.log('Listening on PORT ' + PORT));