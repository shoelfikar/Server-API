const express = require('express');
const Router = express.Router()
const flickr = require('../controllers/flickr');


Router
  .post('/flickr', flickr.getPhotos)


module.exports = Router;