

const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000; //environment variable

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

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

