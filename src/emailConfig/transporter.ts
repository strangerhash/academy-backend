const nodeMailer = require('nodemailer');


let Transporter = nodeMailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secureConnection: false,  //true for 465 port
    auth: {
      user: 'test',
      pass: 'Setup@123'
    }
  });


export default Transporter;