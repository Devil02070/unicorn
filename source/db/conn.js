const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/unicorn', {
    useNewUrlParser:true,
    useUnifiedTopology: true
    // useCreateIndex:true
}).then(()=>{
    console.log('database connected successfully');
}).catch((e) =>{
    console.log(e);
    // console.log('no connection');
})