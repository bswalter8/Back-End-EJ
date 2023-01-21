import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.join(process.cwd(), './public/img'))
    },
    filename: (req, file, cb) => {
       // cb(null, `${Date.now()}-${file.originalname}`)
       cb(null, `${req.body.username}.jpeg`)
    }
});

    


const upload = multer({ storage });

export {upload}