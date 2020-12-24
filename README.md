## Prerequisites

- [Node js](https://nodejs.org/en/)
- [NPM](https://nodejs.org/)
- Optional: [PM2](https://pm2.keymetrics.io/)

## Getting started

1- Install dependencies by running the following command on your terminal

```bash
npm i
```

2- Start your dev server by running:

```bash
npm run dev
```

## Build for production

In order to compile `typescript` code, and generate the javascript code, you need to run this command:

```bash
npm run build
```

After building the `middle-tier` project, you can start the project in production mode by either running this command:

```bash
npm start
```

Or:

```bash
pm2 start graphql.pm2.json
```

If you have [`pm2`](https://pm2.keymetrics.io/) already started
