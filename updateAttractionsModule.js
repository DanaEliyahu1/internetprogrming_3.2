const express = require("express");
const router=express.Router();

const app = express();
app.use(express.json());
var DButilsAzure = require('./DButils');



router.post("/updateFavoriteAttractions",async (req, res) => {
    res.status(200).send( await sqlQuery("INSERT INTO userAttractions(username,attractionName) VALUES('"+req.body.username+"','"+req.body.attractionName+"')"));
    console.log("updateFavoriteAttractions");
});


router.put("/updateMyAttractionSort/:userName/:rankArray",async (req, res) => {
    var arr= req.params.rankArray.split(',');
    for(var i=0; i<arr.length;i++){ 
        await(sqlQuery("UPDATE userAttractions SET rank= "+(i+1)+" WHERE attractionName='"+arr[i]+"'"));
    }
    res.status(200).send("success");
    console.log("Got GET Request");
});


////*************************** */AVRAGE_UPDAE_IN_ATTRACTIONS*****************************************************
router.post("/addRating", async(req, res) => {
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
module.exports=router;