const express = require("express");
const app = express();



app.use(express.json());

//server side fronend
app.use(express.static('D:\\documents\\users\\danaeliy\\Downloads\\ASS_3.3-master/ASS_3.3-master'))

const userRouter=require("./usersModule");
app.use('/private',userRouter);
const viewRouter=require("./viewAttractionsModule");
app.use('/view',viewRouter);
const updateRouter=require("./updateAttractionsModule");
app.use('/update',updateRouter);
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
