


var DButilsAzure = require('./DButils');


function login(userName,password){
    DButilsAzure.execQuery("SELECT * FROM users")
    .then(function(result){
        res.send(result)
    })
    .catch(function(err){
        console.log(err)
        res.send(err)
    })

}

function getCategories(){

}


function getAtractionByCategory(category){


}
function forgotPassword(userName,answer){

}

function getRandomPopularAttractions(){


}
function register(userName,firstName,lastName,country,city,email,interests,question,answer){

}


function getAttractionsByCategory(attractionName){

}


function updateFavoriteAttractions(userName,attractions){

}



function getFavoriteAttractions(userName){



}

function updateMyAttractionSort(userName){

}
function addRating(userName,rating,review,date){

}

function getMostPopularAttractionForUser(userName){

}

function viewAttraction(attractionName){


}