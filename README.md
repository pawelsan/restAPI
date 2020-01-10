# restAPI
> This app is a node.js/express/mongoDB/passport simple REST API connected to OMDb API.
It is deployed [here](https://movieapi2020.herokuapp.com/).

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Resources](#resources)
* [Contact](#contact)

## General info
The purpose of the project is related to my ambition of becoming a professional web developer.

## Technologies
* node - version 10.17.0
* express - version ^4.17.1
* mongoose - version ^5.8.4
* and other, including: bcrypt, passport, and ejs.

## Setup
* Download the source code.
* Run npm install to install the dependencies listed in the package.json.
* Run nodemon server.js to spin up your local server.
* Acquire your personal MongoDb Atlas and OMDb credentials.

## Features
* GETs data requests from (/movies) and (/comments). No API key required.
  - GET /movies fetches a JSON list of all movies already present in the application database.
  - GET /comments fetches a JSON list of all comments present in the application database.
* Provides sign-up and log-in fuctionality. Passwords are bcrypted and hashed.
* Registered users may POST movies or own comments:
  - based on provided movied title, POST /movies fetches other movie details from [OMDb API](http://www.omdbapi.com/) and saves them to app's own database.
  - POST /comments saves comments to application database.

To-do list:
* fetching movie posters to be included among the movie details.

## Status
Project's 1st phase finished.

## Some of the resources used:
Project to a varying extent inspired or based on:
* [Academind](https://www.youtube.com/watch?v=0oXYLzuucwE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q)
* [Traversy Media](https://www.youtube.com/watch?v=0oXYLzuucwE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q)
* [Angela Yu](https://www.udemy.com/course/the-complete-web-development-bootcamp/)

## Contact
Created by [@Paweł Hińcza](https://www.linkedin.com/in/pawe%C5%82-hi%C5%84cza-105926103/) - feel free to contact me!
My other project: [@galacticarchives](https://pawelsan.netlify.com/) - please feel free to use the contact form as well.
