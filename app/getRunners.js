const express = require("express");
const {
  getRacecardsForCourses,
  getRunnersForCourse,
  getCourseNames,
  analyzeRacecard,
  getYankeeBetSuggestion,
} = require("./utils");

const router = express.Router();

router.get("/load-todays-racecards", async (req, res) => {
  try {
    const racecards = await getRacecardsForCourses();
    res.json(racecards);
  } catch (error) {
    res.status(500).send("An error occurred while loading racecards.");
  }
});

router.post("/analyze-racecard", async (req, res) => {
  const { racecard } = req.body;
  try {
    const analysis = await analyzeRacecard(racecard);
    res.json({ analysis });
  } catch (error) {
    res.status(500).send("An error occurred while analyzing the racecard.");
  }
});

router.post("/get-yankee-bet-suggestion", async (req, res) => {
  try {
    const racecards = await getRacecardsForCourses();
    const runnersInfo = getRunnersForCourse(racecards, req.body.course);
    const suggestion = await getYankeeBetSuggestion(runnersInfo);
    res.json({ suggestion });
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while getting the Yankee bet suggestion.");
  }
});

router.get("/get-course-names", async (req, res) => {
  try {
    const courseNames = await getCourseNames();
    res.json(courseNames);
  } catch (error) {
    console.error("Error fetching course names:", error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
});

module.exports = router;
