const dotenv = require('dotenv');
const { type } = require('os');
dotenv.config();

const url = 'https://api.theracingapi.com/v1/courses';
const request = require('request');

const headers = {
    'Authorization': 'Basic ' + Buffer.from(process.env.API_USERNAME + ':' + process.env.API_PASSWORD).toString('base64')
  };

const options = {
    url: url,
    headers: headers
};

// Get all the GB courses and return them as a JSON object to be used later on

// Wrap the request call in a promise
function requestPromise(url, options) {
    return new Promise((resolve, reject) => {
      request(url, options, (error, response, body) => {
        if (error) {
          reject(error);
        } else if (response.statusCode !== 200) {
          reject(new Error(`HTTP error! status: ${response.statusCode}`));
        } else {
          resolve(body);
        }
      });
    });
  }
  
  async function getGBCourses(url, options) {
    try {
      // Use the promise wrapper for request
      const body = await requestPromise(url, options);
      const data = JSON.parse(body);
      console.log('data is ', data)
      console.log('data type is ', typeof data)
    } catch (error) {
      console.error('Error fetching GB courses:', error);
      return []; // Return an empty array in case of error
    }
  }


