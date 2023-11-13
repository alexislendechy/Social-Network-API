const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3006;
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


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
