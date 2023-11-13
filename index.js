const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(cors());

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new  Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  })
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use((err, req, res) => {
  console.error(err.stack);
  req.status(500).json({
    message: isProduction ? "An error was found while fetching the thought" : err.message })
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
