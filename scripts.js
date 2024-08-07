// Function to populate the course dropdown
async function populateCourseDropdown() {
  try {
    const response = await fetch("http://localhost:3000/get-course-names");
    const courseNames = await response.json();
    console.log(courseNames);
    const dropdown = document.getElementById("course-dropdown");

    courseNames.forEach((course) => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching course names:", error);
  }
}
document
  .getElementById("fetchRacecards")
  .addEventListener("click", async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/load-todays-racecards"
      );
      const racecards = await response.json();
      const dropdown = document.getElementById("racecardsDropdown");

      // Clear existing options
      dropdown.innerHTML = '<option value="">Select a racecard</option>';

      // Populate dropdown with racecards
      racecards.forEach((racecard) => {
        const option = document.createElement("option");
        option.value = JSON.stringify(racecard); // Store the entire racecard object as a string
        option.textContent = `${racecard.course} - ${racecard.date} - ${racecard.off_time}`;
        dropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching racecards:", error);
    }
  });

document
  .getElementById("analyzeRacecard")
  .addEventListener("click", async () => {
    const dropdown = document.getElementById("racecardsDropdown");
    const selectedRacecard = dropdown.value;

    if (!selectedRacecard) {
      alert("Please select a racecard first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/analyze-racecard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ racecard: JSON.parse(selectedRacecard) }),
      });

      const result = await response.json();
      document.getElementById("analysisResult").textContent = result.analysis;
    } catch (error) {
      console.error("Error analyzing racecard:", error);
    }
  });

let selectedCourse = "";

document
  .getElementById("course-dropdown")
  .addEventListener("change", function () {
    selectedCourse = this.value;
  });

document
  .getElementById("yankee-bet-button")
  .addEventListener("click", async () => {
    console.log("selectedCourse:", selectedCourse);
    try {
      const response = await fetch(
        "http://localhost:3000/get-yankee-bet-suggestion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ course: selectedCourse }),
        }
      );
      const data = await response.json();
      console.log(data);
      document.getElementById("yankee-bet-result").innerText = data.suggestion;
    } catch (error) {
      console.error("Error fetching Yankee bet suggestion:", error);
      document.getElementById("yankee-bet-result").innerText =
        "An error occurred. Please try again.";
    }
  });
populateCourseDropdown();
