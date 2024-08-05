const dotenv = require('dotenv');
const { url } = require('inspector');
const { type } = require('os');
dotenv.config();
const axios = require('axios');
const { get } = require('request');

const gbCourseUrl = "https://api.theracingapi.com/v1/courses"
const raceCardUrl = "https://api.theracingapi.com/v1/racecards/free"

const headers = {
    'Authorization': 'Basic ' + Buffer.from(process.env.API_USERNAME + ':' + process.env.API_PASSWORD).toString('base64')
  };

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let allCourseIds = [];

// Function to get race course IDs
async function getRaceCourseIDs() {
    try {
        const response = await axios.get(gbCourseUrl, {
            params: {
                region_codes: 'gb'
            },
            headers
        });
        const fetchCourseIds = response.data.courses
        // Get only the IDs from the response and add them to an array
        const allCourseIds = fetchCourseIds.map(course => course.id);
        return allCourseIds;
    } catch (error) {
        console.error('Error fetching race course IDs:', error);
        throw error; // Propagate error to be handled by the caller
    }
}

// Function to get racecards for a specific race course ID
async function getRacecardsForCourses(allCourseIds) {
    try {
        const response = await axios.get(raceCardUrl, {
            params: {
                course_ids: allCourseIds
            },
            headers
        });
        console.log('Response is: ', response);
        return response.data.racecards;
    } catch (error) {
        console.error(`Error fetching racecards for course IDs:`, error);
        throw error; // Propagate error to be handled by the caller
    }
}

// Main function to handle the flow
async function main() {
    try {
        // Step 1: Get race course IDs
        const courseIds = await getRaceCourseIDs();

        // Step 2: Fetch racecards for all course IDs at once
        const racecards = await getRacecardsForCourses(allCourseIds);
 
        // Do something with the racecards
        console.log('Racecards:', racecards);
    } catch (error) {
        console.error('An error occurred during the process:', error);
    }
}

// Execute the main function
main();
