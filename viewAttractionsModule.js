const express = require("express");
const router=express.Router();

const app = express();
app.use(express.json());
var DButilsAzure = require('./DButils');




router.get("/getFavoriteAttractions/:username", async(req, res) => {
    res.status(200).send(await sqlQuery("SELECT * FROM attractions WHERE attractionName IN"
    +"(SELECT attractionName FROM userAttractions WHERE username='"+req.params.username+"')"));
    console.log("getFavoriteAttractions");
});



router.get("/getCategories", async (req, res) => {
    res.status(200).send(await sqlQuery("SELECT * FROM categories"));
    console.log("getCategories");
});

router.get("/getAtractionByCategory/:category",async (req, res) => {
   // currCategory=JSON.parse(req.params);
  //var registerobject=await (sqlQuery("SELECT * FROM attractions WHERE category='"+req.params.category+"'")); 
    res.status(200).send(await sqlQuery("SELECT * FROM attractions WHERE category='"+req.params.category+"'"));
    console.log("getAtractionByCategory");
});




router.get("/getRandomPopularAttractions", async (req, res) => {

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





router.get("/getAttractionsByName/:attractionName",async (req, res) => {
    res.status(200).send(await sqlQuery("SELECT * FROM attractions WHERE attractionName LIKE'%"+req.params.attractionName+"%'"));
    console.log("getAttractionsByName");
});





router.get("/getMostPopularAttractionForUser/:username", async (req, res) => {
    var attractions=(await sqlQuery("SELECT * FROM attractions  WHERE category IN"
     +"(SELECT categoryName FROM userInterests WHERE username='"+req.params.username+"')ORDER BY rating DESC;"));
  var popularAttractions=[];
  for(var i=0;i<Math.min(4,attractions.length);i++){
      popularAttractions[i]=attractions[i];
  }
  
     res.status(200).send(popularAttractions);
     console.log("getMostPopularAttractionForUser");
 });
 
 
 
 router.put("/viewAttraction/:attractionName", async(req, res) => {
     await(sqlQuery("UPDATE attractions SET views= views+1 WHERE attractionName='"+req.params.attractionName+"'"));
     res.status(200).send(await sqlQuery("SELECT * FROM attractions WHERE attractionName='"+req.params.attractionName+"'"));
     console.log("viewAttraction");
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