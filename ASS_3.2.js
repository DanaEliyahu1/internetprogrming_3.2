

const express = require("express");
const app = express();
app.use(express.json());

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


app.get("/getCategories", async (req, res) => {
    res.status(200).send(await sqlQuery("SELECT * FROM categories"));
    console.log("getCategories");
});

app.get("/getAtractionByCategory/:category",async (req, res) => {
   // currCategory=JSON.parse(req.params);
  //var registerobject=await (sqlQuery("SELECT * FROM attractions WHERE category='"+req.params.category+"'")); 
    res.status(200).send(await sqlQuery("SELECT * FROM attractions WHERE category='"+req.params.category+"'"));
    console.log("getAtractionByCategory");
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


app.get("/getRandomPopularAttractions", async (req, res) => {

   var goodAttraction=await (sqlQuery("SELECT * FROM attractions "));
    console.log(goodAttraction);
    goodAttraction=JSON.parse(JSON.stringify(goodAttraction));
    var size= goodAttraction.length;
    if(size<4){
     res.status(200).send(goodAttraction);
    }
    else{ 
          var attractionResult=[];
        for (var i = 0; i<3;i++){
        var random = Math.floor((Math.random()*size));
        var duplicate=false;
        for(var j=0; j<attractionResult.length;j++){
            if(goodAttraction[random]===attractionResult[j]){
            duplicate=true;
            break;
            }
            
        }
            if(duplicate){
                i--;
            }
            else{
                attractionResult[i]=goodAttraction[random];
            }
    
        }

    res.status(200).send(attractionResult);
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



app.get("/getAttractionsByName/:attractionName",async (req, res) => {
    res.status(200).send(await sqlQuery("SELECT * FROM attractions WHERE attractionName LIKE'%"+req.params.attractionName+"%'"));
    console.log("getAttractionsByName");
});

app.post("/updateFavoriteAttractions",async (req, res) => {
    res.status(200).send( await sqlQuery("INSERT INTO userAttractions(username,attractionName) VALUES('"+req.body.username+"','"+req.body.attractionName+"')"));
    console.log("updateFavoriteAttractions");
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/getFavoriteAttractions/:userName", (req, res) => {
    res.status(200).send(getFavoriteAttractions(req.params));
    console.log("Got GET Request");
});

app.put("/updateMyAttractionSort/:userName", (req, res) => {
    res.status(200).send(updateMyAttractionSort(req.params));
    console.log("Got GET Request");
});



app.post("/addRating/:userName/:rating/:review/:date", (req, res) => {
    res.status(200).send(addRating(req.params));
    console.log("Got GET Request");
});



app.get("/getMostPopularAttractionForUser/:userName", (req, res) => {
    res.status(200).send(getMostPopularAttractionForUser(req.params));
    console.log("Got GET Request");
});

app.put("/viewAttraction/:attractionName", (req, res) => {
    res.status(200).send(viewAttraction(req.params));
    console.log("Got GET Request");
});



const port = process.env.PORT || 3000; //environment variable
//var bodyParser=require("")
//app.use(express.json());
//app.use(bodyParser.urlencoded)
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



var DButilsAzure = require('./DButils');



app.get('/select', function(req, res){
    DButilsAzure.execQuery("SELECT * FROM users")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })
})

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

