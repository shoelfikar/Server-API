require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const Router = require('./App/routers/index');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))
app.use('/api/v1/server', Router)
app.use('/api/v1/server/fileStorage',express.static('./fileStorage'))

app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`)
})