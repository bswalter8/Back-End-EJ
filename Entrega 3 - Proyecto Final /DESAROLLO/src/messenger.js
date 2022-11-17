import { createTransport } from 'nodemailer';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const TEST_EMAIL = 'lucy.kuvalis57@ethereal.email'
//const FROM_GMAIL_MAIL = 'serverApiMail@gmail.com'

/*function createSendMail(mailConfig) {
    const transporter = nodemailer.createTransport(mailConfig);

    return function sendMail({ to, subject, text, html, attachments }) {
        const mailOptions = {
            from: mailConfig.auth.user,
            to,
            subject,
            text,
            html,
            attachments
        };

        return transporter.sendMail(mailOptions);        
    }
}

function createSendMailEthereal() {
    return createSendMail({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: TEST_EMAIL,
            pass: 'zmtaEGJRJTvN7xS43w'
        }
    });
};*/

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

 /*function createSendMailGmail() {
    return createSendMail({
        service: 'gmail',
        port: 587,
        auth: {
            user: FROM_GMAIL_MAIL,
            pass: 'icwukpisbaxsfnfj'
        }
    }); 
}

async function sendMailRegister(req,res, next){
    const Mail  = createSendMailGmail();

    const cuenta = 'bswalter8@gmail.com';
    const asunto = 'Nuevo registro de usuario';
    const mensajeHtml = `
                 username: ${req.body.username},
                email: ${req.body.email},
                adress: ${req.body.adress},
                cellphone: ${req.body.cellphone},
                age: ${req.body.age},
                `;
    const rutaAdjunto = process.argv[4];
     const adjuntos = [];

if (rutaAdjunto) {
    adjuntos.push({ path: rutaAdjunto })
};

    const info = await Mail({
        to: cuenta,
        subject: asunto,
        html: mensajeHtml,
    });

        console.log(info);
        next();
    }


    async function sendMailOrder(req,res, next){
        const Mail  = createSendMailGmail();
    
        const cuenta = 'bswalter8@gmail.com';
        const asunto = 'Nuevo orden de productos';
        const mensajeHtml = `
                    username: ${req.body.username},
                    email: ${req.body.email},
                    productos: ${req.body.productos}
                    `;
        const info = await Mail({
            to: cuenta,
            subject: asunto,
            html: mensajeHtml,
        });
    
            console.log(info);
            next();
        }
*/

        async function sendSmsOrder(req,res, next){

            const accountSid = 'xxxxxxxxxxxxxxxx'
            const authToken = 'xxxxxxxxxxxxxxxxx'
            
            const client = twilio(accountSid, authToken)
            
            try {
               const message = await client.messages.create({
                  body: `Usted ha encargado ${req.body.productos}`,
                  from: '+14156884237',
                  to: req.body.cellphone
               })
               console.log(message)
               next();
            } catch (error) {
               console.log(error)
               next();
            }
           
            }

            async function sendWapsOrder(req,res, next){

                const accountSid = 'xxxxxxxxxxxxxxxx'
                const authToken = 'xxxxxxxxxxxxxxxxx'
                
                const client = twilio(accountSid, authToken)
                
                try {
                   const message = await client.messages.create({
                      body: `Usted ha encargado ${req.body.productos}`,
                      from: '+14156884237',
                      to: '+14156884237'
                   })
                   console.log(message)
                   next();
                } catch (error) {
                   console.log(error)
                   next();
                }
               
                }
    

    

export {sendMailEthereal,sendSmsOrder,sendWapsOrder}

