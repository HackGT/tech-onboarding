# HackGT Tech Onboarding

Welcome to the HackGT tech onboarding project. This will serve as an introduction to TypeScript/JavaScript, Node.js, MongoDB, and React.

This README has the following sections:

- [Installation](#Installation)
- [Learning Links](#Learning-Links)
- [Setup](#Setup)
- [Development Guide](#development-guide)

Please follow the installation instructions in order, since later tools may depend on installing previous tools first.

## Installation

### Homebrew

If you're on macOS or Linux, you should first install Homebrew. It's essentially a package manager for your computer (you'll need it to install tools like MongoDB).

[Here](https://brew.sh/) are the installation instructions. Test that its installed by typing in `brew --version`

### Node.js and npm

You can download Node.js [here](https://nodejs.org/en/). Select the button saying "Recommended For Most Users".

npm stands for Node Package Manager, though it's name is confusing since it can also be used on the frontend. npm is automatically distributed with Node.js.

To check that you have Node and npm installed, run these commands in your terminal.

- `node -v`
- `npm -v`

If these commands return a number like `v14.21.0` you're good to go.

### yarn

To install Yarn, go [here](https://classic.yarnpkg.com/en/docs/install). After installing, test that it's installed by running `yarn --version`.

### MongoDB

[Here](https://docs.mongodb.com/manual/administration/install-community/) are the installation instructions for MongoDB Community Edition. Check that it's installed by running `mongo --version`.

### MongoDB Compass

MongoDB Compass is a GUI for your MongoDB database that allows you to easily interact with it and view data. Download it [here](https://www.mongodb.com/try/download/compass)

### Postgres

PostgreSQL is a structured database that we use in some of our projects. To install Postgres, use the command `brew install postgresql@14` if on Mac or follow the instructions [here](https://www.postgresql.org/download). Check that it's installed by running `psql --version`.

After it's installed, run `brew services start postgresql@14` to start postgres. You can verify that Postgres is running in Postico by testing your connection to `localhost:5432`

### Postico

Postico is a GUI for your Postgres database that allows you to view/edit data similar to MongoDB Compass. Download it [here](https://eggerapps.at/postico2/) (Note, it's only available for Mac). On windows, you can use [pgAdmin](https://www.pgadmin.org/).

### VSCode

The easiest code editor to get started with is VSCode. Please don't use Sublime :). You can download it [here](https://code.visualstudio.com/download).

Some VSCode extensions that are extremely useful:

- Github Copilot (free with .edu email)
- Prettier

### Postman

Postman is an app that allows you to test your backend code by sending different types of requests. You can download it [here](https://www.postman.com/downloads/).

Postman will be your best friend when working with APIs, so it's important to get familiar with it. Refer to [this](https://github.com/HackGT/api/wiki/3.-Authentication#development) for guidance on how to use Postman with our APIs.

## Learning Links

On most coding projects, you'll likely be using a wide number of tools, frameworks, and languages, and you'll constantly be learning new ones as projects rise and fall in popularity. As such, here are some cool resources to help you learn the tools we use at HackGT.

### JavaScript and TypeScript

- Modern JavaScript Tutorial [https://javascript.info/](https://javascript.info/)
- JavaScript tutorial [https://www.tutorialrepublic.com/javascript-tutorial/](https://www.tutorialrepublic.com/javascript-tutorial/)
- TypeScript for new programmers [https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### React

- Amazing slides made my Tim Aveni, HackGT alum [https://tja.io/hackgt5/slides/](https://tja.io/hackgt5/slides/)
- A great getting started guide with React [https://www.taniarascia.com/getting-started-with-react/](https://www.taniarascia.com/getting-started-with-react/)
- Honestly, the official React docs are great themselves [https://reactjs.org/docs/hello-world.html](https://reactjs.org/docs/hello-world.html)

### Node.js and Express.js

- Node.js/Express overview [https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)
- In depth Node.js [https://nodejs.dev/learn](https://nodejs.dev/learn)
- Official Express getting started [https://expressjs.com/en/starter/hello-world.html](https://expressjs.com/en/starter/hello-world.html)

### MongoDB and Mongoose

- MongoDB tutorial [https://www.freecodecamp.org/news/learn-mongodb-a4ce205e7739/](https://www.freecodecamp.org/news/learn-mongodb-a4ce205e7739/)
- Mongoose introduction [https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/](https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/)

### Postgres and Postico
- Postgres CLI commands and tutorial [https://www.postgresql.org/docs/14/tutorial-start.html](https://www.postgresql.org/docs/14/tutorial-start.html)
- Postgres Connection Strings [StackOverflow Link](https://stackoverflow.com/a/52718093)

## Setup

### Git

When developing this onboarding project, please make a new branch with your first name, and use that branch for development. For example, make a branch with `git branch rahul`, and check it out with `git checkout rahul`. As you make commits, you can push to the repo with `git push`.

**Important** Please do not push any commits on the main branch, only push commits on your specific branch!

### Getting Started

1. `yarn install` (Install dependencies from package manager)
2. `yarn start` (Start frontend client)

Navigate to [localhost:3000](localhost:3000) to see the frontend client for the project.

## Development Guide

### Hexlabs Development Resources

- [Hexlabs API Docs](https://docs.hexlabs.org)
- [Hexlabs API Wiki](https://github.com/HackGT/api/wiki)
- [Hexlabs Frontend Docs](https://frontend.hexlabs.org/)

### Step 1

Take a look around the repo! Specifically, look at `App.tsx`. You don't have to know exactly how everything works, but just try to see how
we handle authentication and our api interactions setup.

### Step 2

Take a look at the `src/components` folder. Be sure to read through all the comments in all the files to get a better understanding of what's going on in the codebase. You'll be making changes to these files to complete the project. A great resource to use when working on any frontend project is our [frontend docs](https://frontend.hexlabs.org). In addition, take a look at the USERS service in the [api](https://github.com/HackGT/api) repo to familiarize yourself with the routes and our other frontend projects like [registration](https://github.com/HackGT/registration2) that makes API calls similar to what you will be implementing in Step 3.

### Step 3

Now that you have a better understanding of the codebase, it's time to start working on the project! The goal of this project is to create a simple Hexlabs profile viewer. Each of these tasks should be linked with a corresponding comment starting with `TODO` in the codebase.

- [ ] `UserData.tsx` Configure the api call to get the user data from the backend api
- [ ] `UserData.tsx` Use the existing api call but add in a filter for only people whose phone number starts with 470
- [ ] `UserData.tsx` Add a button that allows you to sort the users by their first name
- [ ] `UserCard.tsx` Create a modal that shows the user's full name, email, and phone number when you click on the user card
- [ ] `UserCard.tsx` Create a modal that retrieves all of the hexathons that a user has an application for.
- [ ] `App.tsx` Add the Header and Footer frontend components from our `hexlabs-core` [package](https://frontend.hexlabs.org).

Side note: Use the [chakra-ui](https://chakra-ui.com/getting-started) package for frontend components you'd like to use, like buttons for instance - we use Chakra UI extensively on the frontend.

Note that the last two tasks are a bit more difficult than the others! Feel free to put your own creative spin on the project. If you have any ideas for cool features, feel free to implement them! We love to see new ideas on tech team and we want to see how you think!
