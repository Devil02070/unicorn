const mongoose = require('mongoose');

// first define schema
const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date_of_birth:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    }
});

//create collection
const Register = new mongoose.model('Register', StudentSchema);

module.exports = Register;       //
