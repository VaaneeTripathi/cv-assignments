# Computer Vision Assignments

> **Ashoka University | Spring 2026**

This repository showcases assignment submissions for the Computer Vision course at Ashoka University. Each assignment explores fundamental concepts in computer vision, camera work, and image composition through hands-on experimentation and analysis.

## About This Project

This is an interactive web platform built with Jekyll that displays:

- **Problem statements** for each assignment
- **Student submissions** including images and explanations
- **Peer review system** with voting functionality
- **Authentication** using Ashoka University student IDs

## Live Demo

Visit the live site: [cv-assignments](https://vaneetripathi.github.io/cv-assignments/)

## Technical Stack

- **Jekyll** - Static site generator
- **GitHub Pages** - Hosting
- **Firebase** - Authentication and voting system
- **HTML/CSS/JavaScript** - Frontend
- **Markdown** - Content management

## Project Structure

```
cv-assignments/
├── _assignments/          # Assignment markdown files
├── _layouts/             # Jekyll layout templates
│   ├── default.html
│   ├── assignment.html
│   └── home.html
├── assets/              # Static assets
│   ├── css/
│   │   └── style.css   # Custom styling
│   └── js/
│       └── main.js     # Interactive features
├── _config.yml         # Jekyll configuration
├── index.html         # Homepage
└── auth-complete.html # Authentication callback
```

## Authentication

Login is required for voting functionality. Authentication is done using students' Ashoka University IDs. All content is publicly viewable, but voting is restricted to approved students in the current Spring 2026 cohort.

## Local Development

### Prerequisites

- Ruby 2.7+
- Jekyll 4.0+
- Bundler

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/VaaneeTripathi/cv-assignments.git
   cd cv-assignments
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Run the development server**
   ```bash
   bundle exec jekyll serve
   ```

4. **View the site**
   Open your browser to `http://localhost:4000`

### Adding New Assignments

1. Create a new markdown file in `_assignments/` folder:
   ```markdown
   ---
   layout: assignment
   title: "Assignment 1"
   date: 2026-02-15
   assignment_number: 1
   problems:
     - number: 1
       description: "Problem description here"
       images:
         - path: "/assets/images/assignment1/problem1_1.jpg"
           caption: "Image caption"
       explanation: "Your explanation here"
   ---
   
   Assignment overview and introduction.
   ```

2. Add images to `assets/images/assignment{number}/`

3. Commit and push your changes

## License

This repository is for educational purposes as part of the Computer Vision course at Ashoka University. All rights reserved.

---

**Note**: This is a living document and will be updated throughout the semester as new assignments are added and the platform evolves.
