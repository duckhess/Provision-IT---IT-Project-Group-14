# React + TypeScript + Vite Frontend

This is the frontend for **Provision-IT** project, built with **React**, **TypeScript**, **Vite**, and **TailwindCSS**.  
It includes routing, charts, and integration with the backend API.

---

## Dependencies

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

## To run:
1. Ensure that the current working directiory is ".../Provision-IT---IT-Project-Group-14\Front-end>". 
2. Once in this directory, run npm run dev on the terminal. This will start the webpage on localhost (defaulting to port 5173). 
3. Follow the link to the webpage on the terminal.
(Note: The data is connected to the back end so the carousel/search bar/metric selections will not work as intended unless the back end is running at the same time.)

## Testing
The project uses vitest to perform testing.

To run all tests:

```bash
npm run test
```

## Building for production
To build this project, run:

```bash
npm run build
```

## GitHub Actions CI
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
