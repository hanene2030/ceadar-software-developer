const fs = require('fs')
const csv = require('csv-parser')
const file_name = require('../helper')
const AppError = require('../error/AppError')

class AllDataController{
data(req, res, next) {
  let results =[]
  fs.createReadStream(file_name).pipe(csv({ auto_parse: false, // don't convert to native datatypes
  columns: null, // return arrays not objects
  comment: "#",
  delimiter: ",",
  escape: "\"",
  quote: "\"",
  rowDelimiter: "\n",
  skip_empty_lines: true,
  trim: true})).on('data',(data)=>{ 
 

    
 if(data['Headlines']&& data['Time']&&data['Description']){

  results.push({'Headlines':data['Headlines'] ,'Time': data['Time'] ,'Description':data['Description']})
 }
  }).on("error", (err) => {
   // console.log("one error: ", err.message)
    next(AppError.internal(err.message)) 
    return       
  }).on('end', ()=>{
 
      //console.log(results)
   res.status(200).json(JSON.stringify(results))
   res.end()

  })
 

}


}

module.exports = new AllDataController()