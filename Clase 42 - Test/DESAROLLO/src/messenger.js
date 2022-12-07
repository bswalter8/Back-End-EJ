import { createTransport } from 'nodemailer';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const TEST_EMAIL = 'lucy.kuvalis57@ethereal.email'
//const FROM_GMAIL_MAIL = 'serverApiMail@gmail.com'


const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: TEST_EMAIL,
        pass: 'zmtaEGJRJTvN7xS43w'
    }
});

async function sendMailEthereal(toEmail,subject,body){
    const mailOptions = {
        from : 'Servidor',
        to: toEmail,
        subject: subject,
        html: body
    }
    try{
       
        const info = await transporter.sendMail(mailOptions)
        console.log(info)
    } catch(error ){
        console.log(error);
    }

}


async function sendSms(body, cellphone, whats){

    const accountSid = 'AC65ebb58e9628eb88cf6e58a453c28335'
    const authToken = '8a75201842ddbc5df1fd5caa2c1c64b1'
    const whatspp = 'whatsapp:+14155238886'
    const smsServer = '+15138452856'
    

    const client = twilio(accountSid, authToken)
    
    try {
       const message = await client.messages.create({
          body: `Usted ha encargado ${body}`,
          from: `${whats? 'whatsapp'+whatspp : smsServer}`,
          to: `${whats? 'whatsapp'+cellphone : cellphone}`
       })
       console.log(message)
       next();
    } catch (error) {
       console.log(error)
    }
   
    }
     

export {sendMailEthereal,sendSms}

