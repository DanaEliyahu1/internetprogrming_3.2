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
// do not need this ??
router.post("/updateFavoriteAttractions",async (req, res) => {
    var username=verify(req,res);
    if(username != undefined){
        res.status(200).send( await sqlQuery("INSERT INTO userAttractions(username,attractionName) VALUES('"+username+"','"+req.body.attractionName+"')"));
        console.log("updateFavoriteAttractions");
    }
});


router.put("/updateMyAttractionSort/:rankArray/:dateArray",async (req, res) => {
    var username=verify(req,res);
    if(username != undefined){
        var arr= req.params.rankArray.split(',');
        var dateArr= req.params.dateArray.split(',');
        for(var i=0; i<arr.length;i++){ 
        await(sqlQuery("UPDATE userAttractions SET rank= "+(i+1)+" WHERE attractionName='"+arr[i]+"' and username='"+username+"'"));
        await(sqlQuery("UPDATE userAttractions SET date="+dateArr[i]+" WHERE attractionName='"+arr[i]+"' and username='"+username+"'"));
        }
        res.status(200).send("success");
        console.log("Got GET Request");
    }
    
});


router.post("/addRating", async(req, res) => {
    //reminding the date format is  yyyy-mm-dd
    var username=verify(req,res);
    if(username != undefined){
        res.status(200).send(await sqlQuery("INSERT INTO reviews (username,rating,review,date,attractionName)"+
        " VALUES('"+username+"',"+req.body.rating+",'"+req.body.review+"','"+req.body.date+"','"+req.body.attractionName+"')"));
        var AveregeScore=await sqlQuery("SELECT AVG(rating) FROM reviews WHERE attractionName='"+req.body.attractionName+"'");
        await(sqlQuery("UPDATE attractions SET rating= "+AveregeScore[0]['']+" WHERE attractionName='"+req.body.attractionName+"'"));
        console.log("addRating");
    }
    
});

function sqlQuery(query){
    console.log(query);
    return DButilsAzure.execQuery(query)
    .then(function(result){
            return result;
        })
        .catch(function(err){
            console.log(err)
            return err;
        })
    
}
module.exports=router;