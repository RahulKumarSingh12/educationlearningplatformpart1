const express = require('express');
const app=express();
const port=process.env.PORT||8000;
const bcrypt = require('bcryptjs');
const hbs=require('hbs');
const path=require('path');
const partialspath=path.join(__dirname,'./partials');
console.log(partialspath);
const viewspath=path.join(__dirname,'./views');


const con=require('./db/msqldb').con;

app.use('/css',express.static(path.join(__dirname,'./servingfilesforrendering/css/index.css')));
app.use('/images',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/images.jpeg')));
app.use('/education',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/education.jpg')));
app.use('/spotifyjs',express.static(path.join(__dirname,'./frontend/spotify.js')));
app.use('/spotifycss',express.static(path.join(__dirname,'./frontend/spotify.css')));
app.use('/spotifycss1',express.static(path.join(__dirname,'./frontend/utility.css')));
app.use('/homee',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/home.svg')));
app.use('/logoo',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/logo.svg')));
app.use('/music',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/music.svg')));
app.use('/nextsong',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/nextsong.svg')));
app.use('/pause',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/pause.svg')));
app.use('/search',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/search.svg')));
app.use('/playlist',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/playlist.svg')));
app.use('/prevsong',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/prevsong.svg')));
app.use('/nextsong',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/nextsong.svg')));
app.use('/playcircle',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/playcircle.svg')));
app.use('/images1',express.static(path.join(__dirname,'./frontend/download (1).jpeg')));
app.use('/vediopage',express.static(path.join(__dirname,'./servingfilesforrendering/css/vv.jpg')));
app.use('/audiopage',express.static(path.join(__dirname,'./servingfilesforrendering/imagess/images/OIP (1).jpeg')));
console.log(path.join(__dirname,'./servingfilesforrendering/imagess/images/OIP (1).jpeg'));
console.log(path.join(__dirname,'./frontend/songs'));

app.set('view engine','hbs');
app.set("views",viewspath);
hbs.registerPartials(partialspath);



app.get('/' ,(req,res)=>{
    res.render('home');
});

app.get('/home',(req,res)=>{
    res.render('home');
});

app.get('/spotify',(req,res)=>{
    res.render('spotify');
});



//app.get('/signin',(req,res)=>{
//    res.render('register');
//});


app.get('/signin',async (req,res)=>{
    const {firstname,lastname,email,password}=req.query;
    const queryObject={};
    if(firstname){
        queryObject.firstname=firstname;
    }
    if(lastname){
        queryObject.lastname=lastname;
    }
    if(email){
        queryObject.email=email;
    }
    if(password){
        queryObject.password = await bcrypt.hash(password,10);
    }
    console.log(firstname,lastname,email,password);
    console.log(queryObject.firstname,queryObject.lastname,queryObject.email,queryObject.password);

    if(queryObject.firstname!=undefined){
        const values = [queryObject.firstname,  queryObject.email, queryObject.password,queryObject.lastname];
      const sql = "INSERT INTO tabledata (name,  email, password , lastname) VALUES (?, ?,?,?)";
      con.query(sql, values, function (err, result) {
        if (err) {
          console.log(err);
          res.send("Error occurred during database insertion.");
        }
        else {
          console.log(result);
            console.log("1 record inserted");
            res.render('page',{
              name:`${queryObject.firstname}`
            });
          }
     });
    }
    else{
        res.render('register');
    }
});



app.get('/login',async (req, res) => {
    const { email, password } = req.query;

    if (email && password) {
      const query = `SELECT * FROM tabledata WHERE email = ?`;
      const values = [email];
  
      con.query(query, values, function (err, result) {
        if (err) {
          console.log(err);
          res.send("Error occurred during database selection.");
        } else {
          console.log(1);
          if (result.length > 0) {
            console.log(1);
            const dbPassword = result[0].password; // Assuming password field is named 'password' in the database
            console.log(dbPassword);
            console.log(password);
            bcrypt.compare(password, dbPassword, function(err, isMatch) {
              if (err) {
                console.log(err);
                res.send('Error comparing passwords.');
              } else if (isMatch) {
                // Passwords match, user is authenticated
                res.render('page', {
                  name: `${result[0].firstname}`
                });
              } else {
                // Passwords do not match
                res.send('Incorrect email or password.');
              }
            });
          } else {
            // No user found with the provided email
            res.send('No user found with the provided email.');
          }
        }
      });
    } else {
      // Email or password not provided
      res.render('login');
    }
  });


app.listen(port,()=>{
    console.log(`my website is http://localhost:${port}`);
    console.log(`my website is http://localhost:${port}/signin`);
    console.log(`my website is http://localhost:${port}/login`);
    console.log(`my website is http://localhost:${port}/spotify`);
})