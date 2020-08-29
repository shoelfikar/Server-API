const express = require('express')
const Router = express.Router()
const flickr = require('./flickr')
const user = require('./user')


Router
  .use('/flickr', flickr)
  .use('/user', user)
  .get('/', (req, res)=> {
    res.json({
      message: 'Hello from REST API',
      author: 'sulfikardi'
    })
  })


module.exports = Router