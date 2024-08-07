# Yankee Bet Suggestion Frontend

This project contains a simple frontend script that interacts with a backend service to fetch Yankee bet suggestions based on the selected course from a dropdown menu.

## Features

- **Course Selection**: Users can select a course from a dropdown menu.
- **Fetch Yankee Bet Suggestion**: Upon clicking a button, the selected course is sent to the backend to fetch a Yankee bet suggestion.
- **Display Suggestion**: The fetched suggestion is displayed on the webpage.

## How It Works

1. **Course Selection**:

   - The user selects a course from a dropdown menu with the ID `course-dropdown`.
   - The selected course value is stored in the `selectedCourse` variable.

2. **Fetch Suggestion**:

   - When the user clicks the button with the ID `yankee-bet-button`, a POST request is sent to the backend endpoint `http://localhost:3000/get-yankee-bet-suggestion`.
   - The request body contains the selected course in JSON format.

3. **Display Suggestion**:
   - The response from the backend is parsed, and the suggestion is displayed in an element with the ID `yankee-bet-result`.

## Usage

1. Open the HTML file (using live view in VScode)
2. Select a course from the dropdown menu.
3. Click the "Get Yankee Bet Suggestion" button.
4. View the suggestion displayed on the page.
