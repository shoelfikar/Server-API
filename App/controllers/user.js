const userModel = require('../models/user');
const helper = require('../helpers/response');
const sendEmailconfirm = require('../helpers/sendEmail');
const {genSaltSync, hashSync, compareSync} = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const mustache = require('mustache');
const salt = genSaltSync(10);

const Register = (req, res)=> {
  const {
    full_name,
    username,
    email,
    password,
  } = req.body
  const data = {
    full_name,
    username,
    email,
    password: hashSync(password, salt),
    status: 0,
    created_at : new Date()
  }
  userModel.cekEmail(data.email)
    .then(result => {
        if(result.length === 1) {
          helper.response(res, null, 409,'Email Already taken!')
        }
        userModel.register(data)
          .then((newResult)=> {
            const token = jwt.sign({ user_id: newResult.insertId, email: data.email, full_name: data.full_name, username : data.username, status: data.status}, process.env.SECRET_KEY)
            const html = fs.readFileSync('./template/register.html', 'utf8')
            const renderHtml = mustache.render(html, {nama: data.full_name, token: token, email: data.email})
            const mailOptions = {
              from: process.env.EMAIL,
              to: data.email,
              subject: 'Registrasi Akun',
              html: renderHtml
            }
            const sendEmailRegister = sendEmailconfirm.sendMail(mailOptions)
            if (sendEmailRegister === 'error') {
              return helper.response(res, null, 400, 'Send email failed')
            }
            helper.response(res, newResult, 200, 'Registration success!')
          })
    })
    .catch(() => {
      return helper.response(res, null, 500, 'Something wrong!, check your server')
    })
}


const login = (req, res)=> {
  const {
    email,
    password
  } = req.body
  const data = {
    email,
    password
  }
  userModel.cekEmail(data.email)
  .then((result)=> {
    const cekPassword = compareSync(data.password, result[0].password)
    if(cekPassword){
      if(result[0].status === 0) {
        helper.response(res,null, 403,'please, activated your email')
      }
      const token = jwt.sign({id: result[0].user_id, email: result[0].email, full_name: result[0].full_name, username: result[0].username, status: result[0].status}, process.env.SECRET_KEY, {expiresIn: '1h'})
      const resultNew = {
        id: result[0].user_id,
        token: token
      }
      helper.response(res,resultNew, 200,'Login success!')
    }else{
      helper.response(res,null, 203,'Incorrent Password!')
    }
  })
  .catch(()=> {
    helper.response(res,null, 404,'Email not found, Please register!')
  })
}


const getUserById = (req, res)=> {
  const idUser = req.params.idUser
  userModel.getUserById(idUser)
  .then(result => {
    if(result === undefined){
      helper.response(res,null, 404,`id ${idUser} tidak ditemukan`)
    }else{
      delete result.password
      helper.response(res,result, 200,`data dari user dengan id: ${idUser}`)
    }
  })
  .catch(() => {
    helper.response(res,null, 500,'something wrong!')
  })
}

const updateUser = (req, res)=> {
  const idUser = req.params.idUser
  const {
    full_name,
    email,
    username,
    password
  } = req.body
  userModel.getUserById(idUser)
    .then(result => {
      if(result === undefined) {
        console.log(result)
        return helper.response(res, null, 404, `id ${idUser} not found!`)
      }

      const imageProfil = `http://${req.get('host')}/uploads/${req.file.filename}`
      const user = {
        full_name : full_name || result.full_name,
        email: email || result.email,
        username :username || result.username,
        updated_at : new Date()
      }
      if(imageProfil) {
        console.log(imageProfil)
        user.profil = imageProfil
      }
      if(password) {
        console.log(newPassword)
        const newPassword = hashSync(password, salt)
        user.password = newPassword
      }
      userModel.updateUser(user, idUser)
        .then(() => {
          console.log(user)
          helper.response(res,null, 200,`data dari user dengan id: ${idUser}`)
        })
    })
    .catch((err) => {
      console.log(err)
      helper.response(res,null, 500,'something wrong!')
    })
}



const confirmRegister = (req, res)=> {
  const reqToken = req.query.token
  jwt.verify(reqToken, process.env.SECRET_KEY, (err,result)=> {
    if(err){
      helper.response(res,null, 404,'failed activation, link activation salah', err)
    }else{
      userModel.confirmRegister(result.user_id)
      .then(()=> {
        helper.response(res,result, 200,'activation success', null)
      })
      .catch((err)=> {
        console.log(err)
        helper.response(res,null, 500,'Something wrong, please check your server')
      })
    }
  })
}



const ResetPassword = (req, res)=> {
  const {
    email
  } = req.body
  const data = email
  console.log(data)
  userModel.cekEmail(data)
  .then(result => {
    if(result.length == 0){
      helper.response(res,null, 404,`email: ${data} not found!`)
    }else{
      const token = jwt.sign({id: result[0].user_id, email: result[0].email, full_name: result[0].full_name, username: result[0].username, status: result[0].status}, process.env.SECRET_KEY)
      const html = fs.readFileSync('./template/resetPassword.html', 'utf8')
      const renderHtml = mustache.render(html, {name: result[0].full_name, token: token})
      const mailOptions = {
        from: process.env.EMAIL,
        to: result[0].email,
        subject: 'Reset Password',
        html: renderHtml
      }
      const sendEmailResetPassword = sendEmailconfirm.sendMail(mailOptions)
      if (sendEmailResetPassword === 'error') {
        return helper.response(res, null, 403, 'Send email failed')
      }
      result[0].password = undefined
      helper.response(res, result, 200, 'Please check your email for reset password!')
    }
  })
  .catch((err) => {
    console.log(err)
    helper.response(res,null, 500,'something wrong!')
  })
}



const confirmResetPassword = (req, res)=> {
  const reset = req.params.reset
  const newPassword = req.body
  console.log(newPassword)
  const data = hashSync(newPassword.password,salt)
  jwt.verify(reset, process.env.SECRET_KEY, (err, result)=> {
    if(err){
      console.log(err)
      helper.response(res,null, 403,'token expired!') 
    }else{
      userModel.changePassword(data, result.id)
      .then(newResult => {
        helper.response(res,newResult, 200,'reset password success!') 
      })
      .catch((err) => {
        console.log(err)
        helper.response(res,null, 500,'something wrong!')
      })
    }
  })
}




module.exports = {
  Register,
  login,
  getUserById,
  updateUser,
  confirmRegister,
  ResetPassword,
  confirmResetPassword
}