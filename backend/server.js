const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = 3000;
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function startServer() {
    try {
        await client.connect();
        db = client.db('habigachi');
        console.log('Connected successfully to MongoDB');

        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

app.get('/signup', (req, res) => {
    
})

startServer();