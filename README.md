<h1 align="center">
  <br>
   Catalog Service
  <br>
</h1>
<h4 align="center">A catalog marketplace service using <a href="https://https://nodejs.org/" target="_blank">Node.js</a>, <a href="https://expressjs.com/" target="_blank">Express</a> and <a href="https://aws.amazon.com/pt/?nc2=h_lg">AWS SQS and SNS</a> services</h4>

<div align='center'>

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-%23000000.svg?style=for-the-badge&logo=express&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

</div>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#motivation">Motivation</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Key Features

- Create, update or delete a category of your catalog
- Create, update or delete a product of your catalog
- When catalog changes (by adding a product, update or delete it), a message will send to the AWS SQS service
- When a consumer consumes this message, the updated catalog is send to the AWS S3
- When you access the catalog endpoint passing the owner of this catalog, you get the updated catalog in JSON.
- All error logs will be displayed in `./logger` folder
  
## Motivation

My biggest challenge developing this project was learn a notification service that listening to a consumer. With this project, I learn the basics of a notification and message services, and how can I implement this using Node and PostgreSQL as well. Also, I learned logging mechanisms, using Pino to create a `.log` file, handle errors properly and validate fields using Joi

## How To Use

- To clone and run this application, you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) and [Docker](https://www.docker.com/get-started/) with [Docker Compose](https://docs.docker.com/compose/install/) installed on your computer. From your command line:

  ```bash
  # Clone this repository
  $ git clone https://github.com/evans-costa/catalog-services.git

  # Go into the repository
  $ cd catalog-services
  ```

  ```bash
  # Install dependencies
  $ npm install
  ```

- Rename the `.env.example` file to `.env` and fill it accordingly:

  ```env
  PORT=

  POSTGRES_USER=
  POSTGRES_PASSWORD=
  POSTGRES_DB=
  POSTGRES_HOST=
  POSTGRES_PORT=
  DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB
  
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  AWS_REGION=
  AWS_TOPIC_ARN=
  AWS_SQS_QUEUE_URL=
  AWS_S3_BUCKET=
  ```

- Run the command to start the server:

  ```bash
  # Run the project
  $ npm run dev
  ```

  This will up a PostgreSQL container on your Docker installation, run the migrations and start the server and the SQS Consumer as well.

- Now you can test it in your favorite API Testing Platform ([Insomnia](https://insomnia.rest/download), [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/))

### Project structure

- <a href="https://github.com/githubanotaai/new-test-backend-nodejs/assets/52219768/504ba448-f128-41db-ae86-18dc19c0dc9d">Click here</a> to see the final project structure diagram.

### API documentation

- The API will be accessible at http://localhost:3000 (or in the port setted in `.env` file)
- You can access the full documentation with all endpoints <a href="https://evans-costa.github.io/catalog-services/">at this link</a>.
  
## Improvements

- [ ] Write tests using Jest

## Credits

This project was taken from <a href="https://github.com/githubanotaai/new-test-backend-nodejs?tab=readme-ov-file">this repo</a> from AnotaAí backend challenge and was made with the following open source packages:

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/pt-br/)
- [Node-Postgres](https://node-postgres.com/)
- [AWS-SDK](https://aws.amazon.com/pt/sdk-for-javascript/)
- [SQS-Consumer](https://www.npmjs.com/package/sqs-consumer)
- [Pino](https://github.com/pinojs/pino)
- [Joi](https://joi.dev/)
  
## License

The MIT License (MIT) 2024 - Evandro Costa. Please have a look at the LICENSE for more details.
