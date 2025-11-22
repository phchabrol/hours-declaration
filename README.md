# Hours Declaration Website

A web application for declaring and tracking working hours for employees (Meline and Cel).

## Features

- **Employee Selection**: Choose between Meline and Cel
- **Calendar View**: Navigate through months and view all dates
- **Hours Input**: Click on any date to enter hours worked
- **Monthly Totals**: View total hours declared for each employee per month
- **Data Persistence**: 
  - Automatic saving to browser localStorage
  - Export/Import functionality for JSON file backup

## Getting Started

### Prerequisites

- Node.js 14.15.3 or higher
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (usually `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. Select an employee (Meline or Cel) by clicking their button
2. Navigate between months using the arrow buttons
3. Click on any date in the calendar to select it
4. Enter the number of hours worked and click "Save Hours"
5. View the monthly total at the bottom of the page
6. Use "Export Data" to download a JSON backup of all data
7. Use "Import Data" to load a previously exported file

## Data Storage

- Data is automatically saved to browser localStorage
- Dates with hours are highlighted in green
- Today's date has an orange border
- You can export your data as a JSON file for backup

## Technology Stack

- React 18
- Vite 2.0.5
- Modern CSS with gradient design

## GitHub Setup

To connect this repository to GitHub:

1. Create a new repository on GitHub (don't initialize with README, .gitignore, or license)

2. Add the remote and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

