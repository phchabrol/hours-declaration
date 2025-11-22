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

**For local development:**
- Node.js 14.15.3 or higher
- npm

**For Docker:**
- Docker
- Docker Compose (optional, but recommended)

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

## Running with Docker

### Using Docker Compose (Recommended)

1. Build and start the container:
```bash
docker-compose up -d
```

2. Access the application at `http://localhost:3000`

3. Stop the container:
```bash
docker-compose down
```

4. Rebuild after code changes:
```bash
docker-compose up -d --build
```

### Using Docker directly

1. Build the Docker image:
```bash
docker build -t hours-declaration .
```

2. Run the container:
```bash
docker run -d -p 3000:80 --name hours-declaration hours-declaration
```

3. Access the application at `http://localhost:3000`

4. Stop the container:
```bash
docker stop hours-declaration
docker rm hours-declaration
```

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

