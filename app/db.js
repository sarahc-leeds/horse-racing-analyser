const mongo = require('mongodb')

client = new mongo.MongoClient('mongodb://mongoadmin:secret@localhost:27017');

async function connectMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('horseracing');
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        // Optionally, rethrow the error or handle it as needed
        throw error;
    }
}

async function closeMongoConnection() {
    try {
        await client.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Failed to close MongoDB connection', error);
        throw error;
    }
}

module.exports = { connectMongo, closeMongoConnection };

