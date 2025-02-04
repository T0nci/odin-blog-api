# Blog API

Blog API is a Jamstack web application where a single author can write, edit and publish blogs, delete comments on blogs and users can read and post comments on published blogs. It's consisting of 3 parts:

- RESTful API back-end(this repository)
- [Client front-end](https://github.com/T0nci/odin-blog-viewer)
- [CMS front-end](https://github.com/T0nci/odin-blog-author)

## What I've learnt

In this project through challenges and struggle I learnt a lot of things:

- writing a RESTful API
- creating and verifying JWTs for authentication
- connecting front-ends to the API
- exploring more testing options(namely `createMemoryRouter`)
- implementing and working with a cloud-based [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) editor(TinyMCE)

## Features

- view all blogs(Client and CMS feature)
- view a blog(Client and CMS feature)
- comment on a blog if the user is logged in(Client feature)
- write, edit and delete blogs(CMS feature)
- delete comments(CMS feature)

## Live Preview

- [Client preview](https://odin-blog-viewer.vercel.app/)
- [CMS preview](https://odin-blog-author.vercel.app/)

## Installation

### Prerequisites

- installed [NodeJS](https://nodejs.org/en)
- installed [PostgreSQL](https://www.postgresql.org/download/)
- created empty PostgreSQL database

### Setup and running locally

1. Clone the repo
   ```bash
   git clone git@github.com:T0nci/odin-blog-api.git
   ```
   The above example is cloning through SSH, this can be done through HTTPS as well
   ```bash
   git clone https://github.com/T0nci/odin-blog-api.git
   ```
2. Install NPM packages
   ```bash
   npm install
   ```
3. Create `.env` file and set the following environment variables with values that follow the instructions
   ```dotenv
   PORT='SELECT A PORT'
   DATABASE_URL='YOUR POSTGRESQL DATABASE URL'
   JWT_SECRET='SET A SECRET THAT IS RANDOM AND AT LEAST 32 CHARACTERS LONG'
   USER_URL='THE URL FROM WHERE USERS WILL MAKE REQUESTS'
   AUTHOR_URL='THE URL FROM WHERE THE AUTHOR WILL MAKE REQUESTS'
   ```
4. Populate your database with tables from the Prisma schema
   ```bash
   npx prisma migrate deploy
   ```
5. Start the server
   ```bash
   node app.js
   ```

The server should be up and running. You can interact with the server through Postman or by setting up the [front-end repos](#blog-api).

## License

[MIT](LICENSE.txt)

[(back to top)](#blog-api)
