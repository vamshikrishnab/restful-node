// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDatabase} = require('./database/mongo');
const {insertAd, getAds} = require('./database/ads');
const {deleteAd, updateAd} = require('./database/ads');

const {  errorResponse } = require("./helpers");

// defining the Express app
const app = express();

// defining an array to work as the database (mock)
const ads = [
  {title: 'Hello, world!'}
];

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));



app.get('/', async (req, res) => {
    res.send(await getAds());
  });


// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});



app.post('/', async (req, res) => {
  try {
    const newAd = req.body;
    await insertAd(newAd);
    res.send({ message: 'New ad inserted.' });
  } catch (err) {
    errorResponse(req, res, err.message)
  }
});
  
  // endpoint to delete an ad
app.delete('/:id', async (req, res) => {
  try {
    await deleteAd(req.params.id);
    res.send({ message: 'Ad removed.' });
  } catch (err) {
    errorResponse(req, res, err.message)
  }
});
  
  // endpoint to update an ad
  app.put('/:id', async (req, res) => {
   try {
    const updatedAd = req.body;
    await updateAd(req.params.id, updatedAd);
    res.send({ message: 'Ad updated.' });
   } catch(err) {
    errorResponse(req, res, err.message);
   }
  });


  startDatabase().then(async () => {
    await insertAd({title: 'Hello, from the in-memory database!'});
  
    // start the server
    app.listen(3001, async () => {
      console.log('listening on port 3001');
    });
  });