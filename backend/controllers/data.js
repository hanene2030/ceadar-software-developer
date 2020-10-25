const fs = require('fs')
const csv = require('csv-parser')
const file_name = require('../helper')
const AppError = require('../error/AppError')

class DataController{

 data(req, res, next){
  let results1 =[]
 let readStream= fs.createReadStream(file_name)

 readStream.pipe(csv({ })).on('data',(data)=>{ 

 if(data['Headlines']&& data['Time']&&data['Description']){

  results1.push({'Headlines':data['Headlines'] ,'Time': data['Time'] ,'Description':data['Description']})
 }



  }).on("error", (err) => {
    next(AppError.internal(err.message))
    return            
  }).on('end', ()=>{

    const nbPerPage = 50
    const nbPage = req.params.id || 0
    const start = nbPage *  nbPerPage
    const end = nbPerPage + start
  if(results1){
    const resultsPerPage  = results1.slice(start, end)
  
    res.status(200).json(JSON.stringify(resultsPerPage))
    res.end()
  }
   

  })
  readStream.close
 


}



}

module.exports = new DataController()