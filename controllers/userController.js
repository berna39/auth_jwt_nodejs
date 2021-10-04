const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../validators/validator');

module.exports.createUser = async (req,res,next) => {
     // validation
     const { error } = registerValidation(req.body);
     if(error) res.status(400).send(error.details[0].message);
 
     // check if email  exists
     const usernameExists = await User.findOne({ username: req.body.username });
     if(usernameExists) res.status(400).json({ message: 'this username already exists' });

     //hashing password
     const salt = await bcrypt.genSaltSync(10);
     const hashPassword = await bcrypt.hashSync(req.body.password,salt);

    const user = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports.findAll = async (req,res,next) => {
    try {
        users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports.updateUser = async (req,res,next) => {
     //hashing password
     const salt = await bcrypt.genSaltSync(10);
     const hashPassword = await bcrypt.hashSync(req.body.password,salt);

    const user = await User.findById(req.params.id);
    if(!user){
        res.status(404).json({ message: 'this user doesn\'t exist' });
    }else{
        try {
           // if(fs.existsSync(product.picture)) fs.unlinkSync(product.picture)
            const updatedUser = await User.updateOne(
                { _id: req.params.id },
                { $set: {  name: req.body.name, username: req.body.username, password: hashPassword }});

            res.json(updatedUser);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }  
};

module.exports.deleteUser = async (req,res,next) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user) res.status(404).json('user not found');
        const deleteduser= await User.remove({_id: req.params.id});
        res.json(deleteduser);
    }catch(err){
        res.status(500).send(err);
    }
};