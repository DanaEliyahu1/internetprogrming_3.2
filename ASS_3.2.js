

const express = require("express");
const app = express();


app.post("/login/:userName/:password", (req, res) => {
 //   currUser=JSON.parse(req.params);
    userRecord=sqlQuery("SELECT username,password FROM users WHERE username='"+currUser.username+"'");
    if(userRecord.length>=0){
        if(currUser.password===password){
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


app.get("/getCategories", (req, res) => {
    res.status(200).send(sqlQuery("SELECT * FROM categories"));
    console.log("getCategories");
});

app.get("/getAtractionByCategory/:category", (req, res) => {
   // currCategory=JSON.parse(req.params);
    res.status(200).send(sqlQuery("SELECT * FROM attractions WHERE category='"+req.params.category+"'"));
    console.log("getAtractionByCategory");
});

app.post("/forgotPassword/:userName/:answer", (req, res) => {
  currentAnswer=(sqlQuery("SELECT answer , password FROM users WHERE username='"+req.params.username+"'"));
  if(currentAnswer.answer===req.params.answer){
    res.status(200).send(currentAnswer.password);
  }
  else{
    res.status(200).send(("Wrong answer"));
    console.log("Wrong answer");
  }
});


app.get("/getRandomPopularAttractions", (req, res) => {
    goodAttraction=(sqlQuery("SELECT * FROM attractions WHERE reating >= 4"));
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
    -
});

app.post("/register/:userName/:firstName/:lastName/:country/:city/:email/:interests/:question/:answer", (req, res) => {
    res.status(200).send(register(req.params));
    console.log("Got  Request");
});



app.get("/getRandomPopularAttractions", (req, res) => {
    res.status(200).send(getRandomPopularAttractions());
    console.log("Got GET Request");
});
app.get("/getAttractionsByCategory/:attractionName", (req, res) => {
    res.status(200).send(getAttractionsByCategory(req.params));
    console.log("Got GET Request");
});

app.post("/updateFavoriteAttractions/:userName/:attractions", (req, res) => {
    res.status(200).send(updateFavoriteAttractions(req.params));
    console.log("Got  Request");
});

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
    DButilsAzure.execQuery(query)
.then(function(result){
    //console.log(result);
        return result;
    })
    .catch(function(err){
        console.log(err)
        return err;
    })


}

