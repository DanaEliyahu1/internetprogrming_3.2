
const express = require("express");
const app = express();
app.use(express.json());
var DButilsAzure = require('./DButils');

app.post("/login",async (req, res) => {
    var userRecord= await sqlQuery("SELECT password FROM users WHERE username='"+req.body.username+"'");
    if(userRecord.length>0){

        if(req.body.password===userRecord[0]['password']){
            res.status(200).send(("true"));
            console.log("Login success");
        }
        else{
            res.status(200).send(("false"));
            console.log("Wrong password");
        
        }
    }
    else{
        res.status(200).send(("false"));
            console.log("Wrong username");
    }
      
});

app.post("/forgotPassword",async (req, res) => {
    var currentAnswer=(await sqlQuery("SELECT answer , password FROM users WHERE username='"+req.body.username+"'"));
    if(currentAnswer.length>0 && currentAnswer[0]['answer']===req.body.answer){
      res.status(200).send(currentAnswer[0].password);
    }
    else{
      res.status(200).send(("Wrong answer"));
      console.log("Wrong answer");
    }
  });


  app.post("/register",async ( req, res) => {
    var register=await sqlQuery("INSERT INTO users (username,password,firstName, lastName, country,city,email,question,answer)"
    +"VALUES('"+req.body.username+"','"+req.body.password+"','"+req.body.firstName+"','"+ req.body.lastName+"','"+req.body.country+"','"+req.body.city+"','"+req.body.email+"','"+req.body.question+"','"+req.body.answer+"')");
  
    for(var i=0; i<req.body.interests.length;i++){
        sqlQuery("INSERT INTO userInterests (username,categoryName) VALUES('"+req.body.username+"','"+req.body.interests[i].categoryName+"')");
    }
    res.status(200).send("success");
    console.log("register");
});


function sqlQuery(query){
    return DButilsAzure.execQuery(query)
    .then(function(result){
        //console.log(result);
            return result;
        })
        .catch(function(err){
            console.log(err)
            return err;
        })
    
    
    }


