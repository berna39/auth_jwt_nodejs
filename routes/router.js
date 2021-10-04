const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const checkAuth = require('../midlewares/checkAuth');
const multer = require('multer');

const storageStudent = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/students/');
    },
    filename: function(req,file,cb){
        var datenow = new Date().toISOString();
        var newfilename = datenow.replace(/:|\./g,'-');
        cb(null,newfilename+'_'+file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg'  || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(new Error('the file format is not allowed'),false);
    }
};

const updloadStudent = multer({ 
    storage: storageStudent,
     limits:{
            fileSize: 1024 * 1024 * 5
        },
    fileFilter: fileFilter
});

router.get('/',async (req,res,next) => {
    res.status(200).json({ message: 'reached' });
});

router.get('/students/findAll',checkAuth,studentController.findAll)
router.post('/students/create',updloadStudent.single('picture'),studentController.createStudent);
router.patch('/students/update/:id',checkAuth,studentController.updateStudent);
router.delete('/students/delete/:id',checkAuth,studentController.deleteStudent);

router.get('/users/findAll',checkAuth,userController.findAll)
router.post('/users/create',userController.createUser);
router.patch('/users/update/:id',checkAuth,userController.updateUser);
router.delete('/users/delete/:id',checkAuth,userController.deleteUser);

router.post('/login',authController.login);

module.exports = router;