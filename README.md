# Horse Racing Analyser and Yankee Bet Suggestion

This project contains a simple frontend script that interacts with a backend service to analyse horses using theracingapi.com information, and also fetch Yankee bet suggestions based on the selected course from a dropdown menu (also by using theracingapi).

It was a bit of fun for me to learn more code. Forgive the CSS styling and frontend skills - they obviously need more work! :smiley:

## Requirements

- An open AI account and an API key
- A free account on theracingapi.com website and an API key

For this code to work, you'll need to add your API key info into to .env file (rename .env.example).

## Features

Horse Analyser

- First fetch all racecards for that day
- Select a race from the dropdown and Analyse the race, it will suggest 2 horses based on form/race going and jockey info

Yankee Bet Suggestion

- **Course Selection**: Users can select a course from a dropdown menu - the drop down is populated on page load
- **Fetch Yankee Bet Suggestion**:  The selected course is sent to the backend to fetch a Yankee bet suggestion.
- **Display Suggestion**: The fetched suggestion is displayed on the webpage, with contextual information 
