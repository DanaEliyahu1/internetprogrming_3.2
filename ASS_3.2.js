const express = require("express");
const app = express();

app.use(express.json());
const userRouter=require("./usersModule");
app.use('/private',userRouter);
const viewRouter=require("./viewAttractionsModule");
app.use('/private',viewRouter);
const updateRouter=require("./updateAttractionsModule");
app.use('/private',updateRouter);
module.exports=app;
//const viewAttreactionsM=require("viewAttractionsModule");
//const updateAttreactionsM=require("updateAttractionsModule");


const port = process.env.PORT || 3000; //environment variable
var DButilsAzure = require('./DButils');


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
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
