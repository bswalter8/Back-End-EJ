import { createTransport } from 'nodemailer';
import nodemailer from 'nodemailer';
import config from '../config/config.js';

const TEST_EMAIL = 'lucy.kuvalis57@ethereal.email'
//const FROM_GMAIL_MAIL = 'serverApiMail@gmail.com'


const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: config.server.EMAIL_SERVER,
        pass: config.server.EMAIL_PASS
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



     

export default sendMailEthereal

