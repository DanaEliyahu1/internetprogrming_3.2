const express = require("express");
const router=express.Router();
const jwt=require("jsonwebtoken")

const app = express();
app.use(express.json());
var DButilsAzure = require('./DButils');
var secret="secret123";

function verify (req,res){
    const token = req.header("x-auth-token");
    // no token
    if (!token){
        res.status(401).send("Access denied. No token provided.");
        return undefined;
    } 
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        return req.decoded.id; //move on to the actual function
    } catch (exception) {
        res.status(400).send("Invalid token.");
        return undefined;
    }
return undefined;
}

router.post("/updateFavoriteAttractions",async (req, res) => {
    var username=verify(req,res);
    if(username != undefined){
        res.status(200).send( await sqlQuery("INSERT INTO userAttractions(username,attractionName) VALUES('"+username+"','"+req.body.attractionName+"')"));
        console.log("updateFavoriteAttractions");
    }
    
});


router.put("/updateMyAttractionSort/:userName/:rankArray",async (req, res) => {
    var username=verify(req,res);
    if(username != undefined){
        var arr= req.params.rankArray.split(',');
        for(var i=0; i<arr.length;i++){ 
        await(sqlQuery("UPDATE userAttractions SET rank= "+(i+1)+" WHERE attractionName='"+arr[i]+"'"));
        }
        res.status(200).send("success");
        console.log("Got GET Request");
    }
    
});


////*************************** */AVRAGE_UPDAE_IN_ATTRACTIONS*****************************************************
router.post("/addRating", async(req, res) => {
    var username=verify(req,res);
    if(username != undefined){
        res.status(200).send(await sqlQuery("INSERT INTO reviews (username,rating,review,date)"+
        " VALUES('"+req.body.username+"',"+req.body.rating+",'"+req.body.review+"','"+req.body.date+"')"));
        console.log("addRating");
    }
    
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
module.exports=router;