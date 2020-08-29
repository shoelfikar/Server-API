const express = require('express');
const Router = express.Router()
const userController = require('../controllers/user')
const upload = require('../middleware/uploadFile')

Router
  .get('/activated', userController.confirmRegister)
  .get('/:idUser', userController.getUserById)
  .post('/register', userController.Register)
  .post('/login', userController.login)
  .post('/resetpassword', userController.ResetPassword)
  .post('/confirmresetpassword/:reset', userController.confirmResetPassword)
  .put('/update/:idUser',upload.uploadImage.single('profil'), userController.updateUser)


module.exports = Router