const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loginValidation  } = require('../validators/validator');

exports.login =  async (req,resp,next) => {
    // validation
    const { error } = loginValidation(req.body);
    if(error) resp.status(400).send(error.details[0].message);

    // check if email  exists
    const user = await User.findOne({ username: req.body.username });
    if(!user) resp.status(400).json({ message: 'username not found' });

    // compare password
    const validPass = await bcrypt.compareSync(req.body.password,user.password);
    if(!validPass) return resp.status(400).json({ message: 'invalid password' });

    const token = jwt.sign({ _id:user._id },process.env.TOKEN_SECRET);

    resp.header('token','Bearer '+token).send(token);
}
