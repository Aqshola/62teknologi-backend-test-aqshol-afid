# BUSINESS API
Simple Business API for looking business based on location
Submission for Technical Test Enam Dua Technology


## Feature
- Filter by location, term, latitude, longitude, offset and limit
- Get Business (Create, Update, Delete, Read)
- Business Review (get)

## How To Run
- run `npm install`
- run `npm run start`
- dont forget to setup env

## Tech Stack
- Express JS
- Typescript
- PostgreSQL
- JWT
- Sequelize

## Route
- `/business`  [GET, POST]  get all business and create business
- `/business/:id` [GET, PUT, DELETE] get detail business and update or delete business
- `/business/:id/reviews` [GET] Get Business Reviews

- `/auth/register` [POST] Register new user
- `/auth/login` [POST] Login new user

For using this api, dont forget to add headers `Authorization = Bearer <LOGIN/REGISTER TOKEN>`

Since i'm always working this after office hours, if i had focused time i could add swagger even unit test for backend 
and much better API spec
