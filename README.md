# Provision IT project

## Project Overview
**GraphIT** is a full stack project built by 5 students from University of Melbourne, with datasets provided by ProvisionIT

This project consists of:
- Frontend : Built with React, TypeScript, Vite, Tailwindcss, Recharts, and React Router
- Backend : Provides APIs for managing database and serving data for the frontend

## Project Goals:
The main objective of **GraphIT** are:
1. Data Visualisation: Display financial metric and company data through charts
2. Ablity to compare company's preformance side by side 

## Setup for frontend

### React + TypeScript + Vite

This is the frontend for **Provision-IT** project, built with **React**, **TypeScript**, **Vite**, and **TailwindCSS**.  
It includes routing, charts, and integration with the backend API.

---

### Dependencies

Before running the project, make sure the following dependencies are installed:

- Node.js 20+  
- npm (comes with Node.js)  
- TailwindCSS  
- Vite  
- React  
- React Router DOM  
- Axios  
- Recharts  

You can install all frontend dependencies by running:

```bash
npm install
```

### To run:
1. Ensure that the current working directiory is ".../Provision-IT---IT-Project-Group-14\Front-end>". 
2. Once in this directory, run the following command on the terminal. This will start the webpage on localhost (defaulting to port 5173).
   
   ```
   npm run dev
   ```
   
3. Follow the link to the webpage on the terminal.
(Note: The data is connected to the back end so the carousel/search bar/metric selections will not work as intended unless the back end is running at the same time.)

### Testing
The project uses vitest to perform testing.

To run all tests:

```bash
npm run test
```

### Building for production
To build this project, run:

```bash
npm run build
```

### GitHub Actions CI
The project uses GitHub Actions to automatically check the frontend's code:
- Workflow name: Frontend CI - Build and Test

If this CI is used in the future, please ensure that the branches below is changed to fit the branches available on your site
```
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

Note : Please ensure that when running `npm run build` doesn't have any error before using GitHub Actions for testing 

### Folder Structure
```
/Front-end
├── .github/                     # GitHub workflows and CI/CD configurations
├── .vite/                       # Vite cache and build-related files
├── public/                      # Static assets (icons, images, etc.)
├── src/                         # Source code
│   ├── components/              # Reusable UI components   
│   │   ├── Carousel/            
│   │   ├── ComparisonPageComponents/
│   │   ├── filterBusinessPage/
│   │   ├── Footer/
│   │   ├── GraphComponents/
│   │   ├── NavigationBar/
│   │   ├── searchBar/
│   │   ├── SearchPageComponents/
│   │   └── Types/               # Shared TypeScript type definitions
│   ├── assets/                  # Image and static media assets
│   ├── pages/                   # Page-level components (routes)
│   ├── utils/                   # Helper functions and utilities
│   ├── App.css
│   ├── App.tsx                  # Root React component
│   ├── index.css
│   ├── main.tsx                 # App entry point
│   ├── setupTests.ts            # Testing configuration
│   └── vite-env.d.ts            # Vite TypeScript environment declarations
├── eslint.config.js             # ESLint configuration
├── index.html                   # Main HTML template
├── package-lock.json
├── package.json                 # Project dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS setup
├── tsconfig.app.json            # TypeScript config for the app
├── tsconfig.json                # Base TypeScript configuration
├── tsconfig.node.json           # TypeScript config for Node scripts
├── tsconfig.test.json           # TypeScript config for tests
└── vite.config.ts               # Vite build configuration
```

## Setup for Back-end

### 1. Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** ≥ 18
    
    ```bash
    node -v
    ```
    
- **npm** ≥ 9 (comes with Node.js)
    
    ```bash
    npm -v
    ```
    
- **MongoDB** Atlas access (see section 2)

---

### 2. MongoDB Atlas

#### 1. Create a MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign in or create an account.

#### 2. Connect to the database

A. If you are using MongoDB compass

1. Go to connections
2. Add new connection `+`
3. Paste the following connection string, replacing `<username>` and `<password>` with the access details provided
    
    ```
    mongodb+srv://<username>:<password>@test.mgc3oid.mongodb.net/?retryWrites=true
    ```
    
4. Save and connect

B. Online MongoDB portal

1. Go to Database → clusters
2. Select connect and your choice of application tool
3. Follow the given instructions
    1. Remember to replace `<username>` and `<password>` with the access details provided

### 3. Project Setup

#### Step 1 — Clone or create the project folder

```bash
git clone https://github.com/duckhess/Provision-IT---IT-Project-Group-14
```

---

#### Step 2 — Initialize and install dependencies

Execute the following command to change into the back-end folder

```
cd back-end
```

Run:

```bash
npm install
```

This installs all required dependencies and dev tools listed in `package.json`.

---

#### Step 3 — Project Structure

The following structure should be present prior to `npm install` command:

```
db_server/
│
├── src/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── routes/
│   │   └── index.js       # Express routes
│   ├── models/
│   │   └── Example.js     # Mongoose schema example
│   └── controllers/
│       └── exampleController.js
├── tests/  
├── server.js  
├── .env                   # environment variables
├── .eslintrc.json         # eslint config
├── .prettierrc            # prettier config
└── package.json
```

---

### 4. Environment Configuration

Create a `.env` file in the project root:

```
PORT=3000
MONGODB_URL=mongodb+srv://<username>:<password>@test.mgc3oid.mongodb.net/group14
```

This allows your app to connect to MongoDB and run on the defined port.

Replace <username> and <password> in the link above with the access details provided

### 5. Running the Server

#### Start in development mode:

```bash
npm start
```

This uses **nodemon** to automatically restart when you save changes.

#### Run tests:

```bash
npm test
```

For a more detailed guidance on running tests [Testing Tool Guidelines](https://www.notion.so/Testing-Tool-Guidelines-298e839ac929800aac6ffc8bb3b9eab7?pvs=21) 

#### Lint and format code:

```bash
npm run lint
npm run format
```

For a more detailed guidance on the code format [Check Style Tool](https://www.notion.so/Check-Style-Tool-296e839ac92980128705c85fd46190f6?pvs=21) 

### 6. Troubleshooting

| Issue | Cause | Fix |
| --- | --- | --- |
| `Error: Cannot find module` | Missing dependency | Run `npm install` |
| `MongoDB connection failed` | Incorrect URI | Check `.env` and MongoDB service |
| `nodemon not found` | Global not installed | Run `npm install -g nodemon` or use `npm start` |
