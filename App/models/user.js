const db = require('../config/db');

const register =  (data)=> {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO users SET ?', data, (err, result) => {
      if(!err) {
        resolve(result)
      }else{
        reject(new Error(err))
      }
    })   
  })
}

const cekEmail = (email)=> {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', email, (err, result) => {
      if(!err){
        resolve(result)
      }else{
        reject(new Error(err))
      }
    })
  })
}


const getUserById = (idUser)=> {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE user_id = ?', idUser, (err, result) => {
      if(!err){
        resolve(result[0])
      }else{
        reject(new Error(err))
      }
    })
  })
}


const updateUser = (data, idUser)=> {
  return new Promise((resolve, reject) => {
    db.query('UPDATE users SET ? WHERE user_id = ?', [data, idUser], (err, result) => {
      if(!err){
        resolve(result)
      }else{
        reject(new Error(err))
      }
    })
  })
}


const confirmRegister = (idUser)=> {
  return new Promise((resolve, reject)=> {
    db.query('UPDATE users SET status = 1 WHERE user_id = ?', idUser, (err, result)=> {
      if(!err){
        resolve(result)
      }else{
        reject(new Error(err))
      }
    })
  })
}


const changePassword = (password,idUser)=> {
  return new Promise((resolve, reject)=> {
    db.query('UPDATE users SET password = ?  WHERE user_id = ?', [password, idUser], (err, result)=> {
      if(!err){
        resolve(result)
      }else{
        reject(err)
      }
    })
  })
}



module.exports = {
  register,
  cekEmail,
  getUserById,
  updateUser,
  confirmRegister,
  changePassword
}