import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)  //uses original filename, but this can lead to overwriting issuesique
    }
  })
  
export const upload = multer({
  storage,
})