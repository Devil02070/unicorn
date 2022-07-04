const express = require('express');
const app = express();

const path = require('path');
const hbs = require('hbs');


const session = require('express-session');
app.use(session({
    secret: 'unicornsoulcoder',
    resave: false,
    saveUninitialized: false,
}))

require("./db/conn");
const Register = require('./models/registers');

const port = process.env.PORT || 3000;          // when we have to live website. its takes automatically port no.

const static_path = path.join(__dirname,"../public");  
const temp_path = path.join(__dirname,"../templates/views");  
const common_file_path = path.join(__dirname,"../templates/common");   

app.use(express.json());
app.use(express.urlencoded({extended:false}));       // to get form data

app.use(express.static(static_path))
app.set('view engine', 'hbs');
app.set("views", temp_path);
hbs.registerPartials(common_file_path);

//routing
app.get('/', (req,res)=>{
    res.render('login');
});
app.get('/index', (req,res)=>{
    // console.log(req.session);
    if(req.session.email){
        res.render('index',{
            current_user: req.session.name,
            c_user_email: req.session.email
        });
    }else{
        res.redirect('/');
    }
});
app.get('/login', (req,res)=>{
    res.status(200).render('login');
});
app.get('/register', (req,res)=>{
    res.status(200).render('register');
});
app.get("/about",(req,res)=>{
    if(req.session.email){
        res.status(200).render("about");
    }else{
        res.redirect('/');
    }
})
app.get("/inventory",(req,res)=>{
    if(req.session.email){
    res.status(200).render("inventory");
    }else{
        res.redirect('/');
    }
})
app.get("/contact_us",(req,res)=>{
    if(req.session.email){
    res.status(200).render("contact_us");
    }else{
        res.redirect('/');
    }
});
app.get('/account',(req,res)=>{
    if(req.session.email){
        res.render('account',{
            user_id: req.sessionID,
            current_user: req.session.name,
            c_user_email: req.session.email,
            c_user_number: req.session.number
        });
    }else{
        res.redirect('/');
    }
    // res.status(200).render("account");
})
app.get("/user_dashboard",(req,res)=>{
    res.status(200).render("user_dashboard");
})
app.get("/logout", (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/')
        }
    })
})

app.listen(port, ()=>{
    console.log(`Server running at port ${port}`); 
})

//register
app.post("/register", async (req,res)=>{
    try{
        const password = req.body.password;
        const confirm_password = req.body.confirmpassword;

        if(password === confirm_password){
            const Reg_Student = new Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
                confirmpassword: confirm_password,
                date_of_birth: req.body.date_of_birth,
                number: req.body.number,
                gender: req.body.gender
            })
            const registered = await Reg_Student.save();
            res.status(200).render('login',{
                success: "User Registered Successfully.. Please Login.!"
            });
        }else{
            // res.send('Password did not match.')
            res.render('register',{
                password_err: "Password did not match."
            })
        } 
    }
    catch(error){
        const user_name = req.body.name;
        if(user_name !== '' && req.body.email !== '' && req.body.password !== '' && req.body.confirmpassword !== '' && req.body.date_of_birth !== '' && user_name !== '' && req.body.number !== ''){
           // email validation
            const reg_email = req.body.email;
            const check_email = await Register.findOne({email:reg_email});
            const eml = check_email.email;
            if(eml){
                res.render("register",{
                    email_err: "Email Already Registered"
                })
            }
        }else{
            res.render('register',{
                empty_err: "All fields Required"
            });
        }
        // res.status(400).send(error);
    }

}) 


// login
app.post('/login',async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        
        const user_email = await Register.findOne({email:email}); 
        const name = user_email.name;
        if(user_email.password === password){
            // res.send("welcome to dashboard");
            // res.status(200).send("index"); 
            // res.render("index", {
            //     current_user: name
            // });
            sess = req.session;
            sess.name = user_email.name;
            sess.email = user_email.email;
            sess.number = user_email.number;
            res.redirect('/index');
        }else{
            // res.send('Invalid Details');
            res.redirect('/');
            // res.render('login',{
            //     login_err: "Invalid password.."
            // })
        }
    }catch(error){
        res.redirect('/');
        // res.render('login', { 
        //     login_err: "Invalid Details.. Please Register First.!"
        // });
        // res.status(400).send("Invalid email! Please Register First.");
    }
})

