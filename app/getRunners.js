const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON bodies

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
  // Filter racecards for the specified course
  const filteredRacecards = racecards.filter(
    (racecard) => racecard.course === courseName
  );

  // Extract and aggregate runners
  const allRunners = filteredRacecards.reduce((acc, racecard) => {
    return acc.concat(racecard.runners);
  }, []);

  // Create the new object with course name and aggregated runners
  const result = {
    course: courseName,
    allRunnersfromEveryRace: allRunners,
  };

  return result;
}

async function getCourseNames() {
  try {
    const racecards = await getRacecardsForCourses();
    const courseNames = [
      ...new Set(racecards.map((racecard) => racecard.course)),
    ];
    return courseNames;
  } catch (error) {
    console.error("Error getting course names:", error);
    throw error;
  }
}

async function analyzeRacecard(racecard) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `I have the following racecard details for a race in the UK, take into account the going and jockeys if possible. Don't output the analyse of each runner but just give me a summary at the very end of your top 2 recommended runners which could win, based on the conditions and details given: ${JSON.stringify(
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

  const prompt = `I have all the runners from each racecourse today, and would like to pick a yankee bet which contains 4 horses. Based on the info given on the horse runners of this racecourse, which 4 horses would you suggest should go in a yankee bet and could win? ${JSON.stringify(
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

app.get("/load-todays-racecards", async (req, res) => {
  try {
    const racecards = await getRacecardsForCourses();
    res.json(racecards);
  } catch (error) {
    res.status(500).send("An error occurred while loading racecards.");
  }
});

app.post("/analyze-racecard", async (req, res) => {
  const { racecard } = req.body;
  try {
    const analysis = await analyzeRacecard(racecard);
    res.json({ analysis });
  } catch (error) {
    res.status(500).send("An error occurred while analyzing the racecard.");
  }
});

app.post("/get-yankee-bet-suggestion", async (req, res) => {
  try {
    const racecards = await getRacecardsForCourses();
    console.log(req.body.course);
    const runnersInfo = getRunnersForCourse(racecards, req.body.course);
    const suggestion = await getYankeeBetSuggestion(runnersInfo);
    res.json({ suggestion });
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while getting the Yankee bet suggestion.");
  }
});

app.get("/get-course-names", async (req, res) => {
  try {
    const courseNames = await getCourseNames();
    res.json(courseNames);
  } catch (error) {
    console.error("Error fetching course names:", error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
