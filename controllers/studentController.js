const Student = require('../models/Student');

module.exports.createStudent = async (req,res,next) => {
    const student = new Student({
        name: req.body.name,
        age: req.body.age,
        picture: req.file.path
    });

    try {
        const savedStudent = await student.save();
        res.status(200).json(savedStudent);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports.findAll = async (req,res,next) => {
    try {
        students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports.updateStudent = async (req,res,next) => {

    const student = await Student.findById(req.params.id);
    if(!student){
        res.status(404).json({ message: 'this student doesn\'t exist' });
    }else{
        try {
            if(fs.existsSync(student.picture)) fs.unlinkSync(student.picture)
            const updatedStudent = await User.updateOne(
                { _id: req.params.id },
                { $set: {  name: req.body.name, age: req.body.age }});

            res.json(updatedStudent);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }  
};

module.exports.deleteStudent = async (req,res,next) => {

    try{
        const student = await Student.findById(req.params.id);
        if(!student) res.status(404).json('student not found');
        const deletedStudent = await Student.remove({_id: req.params.id});
        res.json(deletedStudent);
    }catch(err){
        res.status(500).send(err);
    }
};