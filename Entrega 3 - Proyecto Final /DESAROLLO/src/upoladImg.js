import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './plubic/img')
    },
    filename: (req, file, cb) => {
       // cb(null, `${Date.now()}-${file.originalname}`)
       cb(null, `${req.body.username}.jpeg`)
    }
});

    


const upload = multer({ storage });

export {upload}