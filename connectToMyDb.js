



var Connection = require('tedious').Connection; 
var Request = require('tedious').Request; 
 
var config = { 
    userName: "{ad}", 
    password: "{Dn123456}", 
    server: "{191.237.232.75}", 
    options: { 
        database: "{Assignment3db}", 
        encrypt: true, 
    } 

}; 
 
var connection = new Tedious.Connection(config); 
connection.on("connect",function(err){ 
    var result = []; 
 
    var request = new Request("select * form student",function(err,count,rows){ 
        console.log(result); 
    }); 
    request.on("row", function (columns) { 
        var item = {}; 
        columns.forEach(function (column) { 
            item[column.metadata.colName] = column.value; 
        }); 
        result.push(item); 
    }); 
}) 