const axios = require('axios');
// const { connectMongo, closeMongoConnection }  = require('./db');

// connectMongo().then(async (db) => {
//   const collection = db.collection('runners');
//   await getRacecardsForCourses(collection);
//   console.log('Data written to MongoDB');
//   await closeMongoConnection();
// });

const options = {
  method: 'GET',
  url: 'https://greyhound-racing-uk.p.rapidapi.com/racecards',
  headers: {
    'x-rapidapi-key': 'b0cc41379emsh37fb746cafa1d9ep188726jsn48045172296e',
    'x-rapidapi-host': 'greyhound-racing-uk.p.rapidapi.com'
  }
};

async function getRacecardsForCourses() {
  try {
      const response = await axios.request(options);
      response.data.forEach(async (racecard) => {
        const raceDateTime = new Date(racecard.date + 'Z');
        const currentDateTime = new Date(new Date().getTime() + 60 * 60 * 1000);
        let futureRacecards = [];
      
        if (raceDateTime > currentDateTime) {
          futureRacecards.push(racecard.dogTrack, racecard.date);
        }
      });
      console.log(futureRacecards)
      return futureRacecards;
  } catch (error) {
      console.error(error);
  }
}

getRacecardsForCourses();
