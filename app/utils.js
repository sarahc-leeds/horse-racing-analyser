const axios = require("axios");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const raceCardUrl = "https://api.theracingapi.com/v1/racecards/free";
const headers = {
  Authorization:
    "Basic " +
    Buffer.from(
      process.env.API_USERNAME + ":" + process.env.API_PASSWORD
    ).toString("base64"),
};

async function getRacecardsForCourses() {
  try {
    const response = await axios.get(raceCardUrl, {
      params: {
        region_codes: "gb",
      },
      headers,
    });
    return response.data.racecards;
  } catch (error) {
    console.error(`Error fetching racecards for course IDs:`, error);
    throw error;
  }
}

function getRunnersForCourse(racecards, courseName) {
  const filteredRacecards = racecards.filter(
    (racecard) => racecard.course === courseName
  );

  const allRunners = [];
  const offTimes = [];

  filteredRacecards.forEach((racecard) => {
    allRunners.push(...racecard.runners);
    offTimes.push(racecard.off_time);
  });

  return {
    course: courseName,
    allRunnersfromEveryRace: allRunners,
    offTimes: offTimes,
  };
}

async function getCourseNames() {
  try {
    const racecards = await getRacecardsForCourses();
    return [...new Set(racecards.map((racecard) => racecard.course))];
  } catch (error) {
    console.error("Error getting course names:", error);
    throw error;
  }
}

async function analyzeRacecard(racecard) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `I have the following racecard details for a race in the UK, take into account the going and jockeys if possible. Don't output the analysis of each runner but just give me a summary at the very end of your top 2 recommended runners which could win, based on the conditions and details given. Try not to pick the favourite. Also give me the reason why you think these could be in with a good chance: ${JSON.stringify(
    racecard
  )}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing racecard with OpenAI:", error);
    throw error;
  }
}

async function getYankeeBetSuggestion(runnersInfo) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `I have all the runners from a racecourse today, and would like to pick a yankee bet which contains 4 horses. Based on the info given on the horse runners of this racecourse and other information you have, which 4 horses would you suggest should go in a yankee bet and could win? Can you also return what race time they're in. ${JSON.stringify(
    runnersInfo
  )}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error getting Yankee bet suggestion with OpenAI:", error);
    throw error;
  }
}

module.exports = {
  getRacecardsForCourses,
  getRunnersForCourse,
  getCourseNames,
  analyzeRacecard,
  getYankeeBetSuggestion,
};
