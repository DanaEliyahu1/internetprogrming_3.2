const express = require("express");
const app = express();


//const usersM=require("./usersModule");
//const viewAttreactionsM=require("viewAttractionsModule");
//const updateAttreactionsM=require("updateAttractionsModule");
app.use(express.json());
var DButilsAzure = require('./DButils');
const port = process.env.PORT || 3000; //environment variable


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

app.get("/getFavoriteAttractions/:username", async(req, res) => {
    res.status(200).send(await sqlQuery("SELECT * FROM attractions WHERE attractionName IN"
    +"(SELECT attractionName FROM userAttractions WHERE username='"+req.params.username+"')"));
    console.log("getFavoriteAttractions");
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





app.get("/getAttractionsByName/:attractionName",async (req, res) => {
    res.status(200).send(await sqlQuery("SELECT * FROM attractions WHERE attractionName LIKE'%"+req.params.attractionName+"%'"));
    console.log("getAttractionsByName");
});





app.get("/getMostPopularAttractionForUser/:username", async (req, res) => {
    var attractions=(await sqlQuery("SELECT * FROM attractions  WHERE category IN"
     +"(SELECT categoryName FROM userInterests WHERE username='"+req.params.username+"')ORDER BY rating DESC;"));
  var popularAttractions=[];
  for(var i=0;i<Math.min(4,attractions.length);i++){
      popularAttractions[i]=attractions[i];
  }
  
     res.status(200).send(popularAttractions);
     console.log("getMostPopularAttractionForUser");
 });
 
 
 
 app.put("/viewAttraction/:attractionName", async(req, res) => {
     await(sqlQuery("UPDATE attractions SET views= views+1 WHERE attractionName='"+req.params.attractionName+"'"));
     res.status(200).send(await sqlQuery("SELECT * FROM attractions WHERE attractionName='"+req.params.attractionName+"'"));
     console.log("viewAttraction");
 });

 app.post("/updateFavoriteAttractions",async (req, res) => {
    res.status(200).send( await sqlQuery("INSERT INTO userAttractions(username,attractionName) VALUES('"+req.body.username+"','"+req.body.attractionName+"')"));
    console.log("updateFavoriteAttractions");
});


app.put("/updateMyAttractionSort/:userName/:rankArray",async (req, res) => {
    var arr= req.params.rankArray.split(',');
    for(var i=0; i<arr.length;i++){ 
        await(sqlQuery("UPDATE userAttractions SET rank= "+(i+1)+" WHERE attractionName='"+arr[i]+"'"));
    }
    res.status(200).send("success");
    console.log("Got GET Request");
});


////*************************** */AVRAGE_UPDAE_IN_ATTRACTIONS*****************************************************
app.post("/addRating", async(req, res) => {
    res.status(200).send(await sqlQuery("INSERT INTO reviews (username,rating,review,date)"+
    " VALUES('"+req.body.username+"',"+req.body.rating+",'"+req.body.review+"','"+req.body.date+"')"));
    console.log("addRating");
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

