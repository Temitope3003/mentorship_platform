# Mentorship Platform

A full-stack web application connecting tech mentors with mentees, built to support structured learning, progress tracking, and consistent communication.

## Problem
Finding and maintaining a productive mentorship relationship in tech is difficult without a structured system. This platform organises the entire process from matching through to progress tracking and communication.

## Features
- User registration and authentication with automated login code delivery
- Mentor and mentee profile management
- Mentor-mentee matching system
- Session scheduling and tracking
- Progress monitoring per mentee
- Automated email reminders for upcoming sessions and milestones
- Admin dashboard for platform management
- Power BI dashboard for visualising registration trends, session completion rates, and engagement metrics (in progress)

## My Contribution (Full Stack)
- Built the frontend interface using TypeScript and JavaScript
- Developed the backend API handling user management, session logic, and notification triggers
- Designed and managed the MySQL database schema for users, sessions, progress records, and automated notification state
- Configured Docker for containerised deployment
- Set up CI/CD pipeline using GitHub Actions for automated testing and deployment

## Tech Stack
- Frontend: TypeScript, JavaScript, CSS, HTML
- Backend: TypeScript, Node.js
- Database: MySQL
- DevOps: Docker, GitHub Actions CI/CD
- Data Visualization: Power BI (in progress)

## How to Run
```bash
git clone https://github.com/Temitope3003/mentorship_platform
cd mentorship_platform
docker-compose up
```

## Database Schema Highlights
- Users table: registration, authentication, role assignment
- Sessions table: scheduling, completion tracking, mentor-mentee linkage
- Progress table: milestone tracking per mentee over time
- Notifications table: automated reminder state and delivery logs

## Roadmap
- Power BI dashboard for admin analytics (in progress)
- Mobile responsive improvements
- In-app messaging between mentors and mentees
