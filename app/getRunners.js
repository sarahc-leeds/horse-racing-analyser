const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const { connectMongo, closeMongoConnection } = require('./db');

const raceCardUrl = "https://api.theracingapi.com/v1/racecards/free";
const headers = {
    'Authorization': 'Basic ' + Buffer.from(process.env.API_USERNAME + ':' + process.env.API_PASSWORD).toString('base64')
};

async function getRacecardsForCourses() {
    try {
        const response = await axios.get(raceCardUrl, {
            params: {
                region_codes: 'gb'
            },
            headers
        });
        console.log('Response is: ', response.data.racecards);
        return response.data.racecards;
    } catch (error) {
        console.error(`Error fetching racecards for course IDs:`, error);
        throw error;
    }
}

async function addRacecardIfNew(db, racecard) {
    const collection = db.collection('racecards');
    const query = {
      course: racecard.course,
      date: racecard.date,
      off_time: racecard.off_time,
    };

    const existingRacecard = await collection.findOne(query);

    if (!existingRacecard) {
      await collection.insertOne(racecard);
      console.log('Racecard added to the database');
    } else {
      console.log('Racecard already exists in the database');
    }
}

async function main() {
    try {
        const db = await connectMongo();
        const racecards = await getRacecardsForCourses();
        console.log('Racecards:', racecards);

        for (const racecard of racecards) {
            await addRacecardIfNew(db, racecard);
        }

        console.log('Data written to MongoDB');
    } catch (error) {
        console.error('An error occurred during the process:', error);
    } finally {
        await closeMongoConnection();
    }
}

main();