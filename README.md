# Introduction

A React.js frontend application for an online voting system used by IADT Students' Union's for official officer elections.

RESTful API backend server can be found in a separate repository [here](https://github.com/kaific/iadtsu-elections-server).

## Languages & Libraries

JavaScript, [Node.js](https://nodejs.org/), [React.js](https://www.npmjs.com/package/react), [Axios](https://www.npmjs.com/package/axios), [JSONWebToken (JWT)](https://www.npmjs.com/package/jsonwebtoken)

## Background

A project originally put together out of necessity ahead of the 2021 IADTSU by-elections. Following a hasty implementation and initial launch, the backend and frontend went through small improvements based on user feedback.

The system facilitated 4 separate elections over a period of 2 years.

In years prior, the student body's votes were cast at in-person stations using paper ballots and student ID verification. The need for this application arose due to the second state-wide lockdown during the COVID-19 outbreak in Ireland. The students' union's officer elections were to occur within a fast-approaching timeframe specified by its constitution.

In lieu of a suitable, internal alternative, time constraints and a limited budget, a web application was developed as a side project by the Vice President for Welfare & Equality at the time (the owner of this repository).

# Setup

[Node.js](https://nodejs.org) v18 or higher is recommended to run this app.

From the root `/` directory:

1. Using a chosen CLI, install the necessary packages:
   ```console
   npm install
   ```
2. Run the app in development mode:
   ```console
   npm run dev
   ```
3. The app will be served to [http://localhost:3000](http://localhost:3000)
4. To build the app for production to the `/dist` directory:
   ```console
   npm run build
   ```
5. Refer to [Vite's documentation](https://vitejs.dev/guide/) for additional setup/development information.
