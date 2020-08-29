const mailer = require('nodemailer')

const sendMail = (mailOptions) => {
  const transporter = mailer.createTransport({
    service : 'gmail',
    auth : {
      user : process.env.EMAIL,
      pass : process.env.EMAIL_PASS
    }
  })
  transporter.sendMail(mailOptions, (error, info)=> {
    if(error){
      return new Error ('error')
    }else {
      return 'ok'
    }
  })
}

module.exports = {
  sendMail
}