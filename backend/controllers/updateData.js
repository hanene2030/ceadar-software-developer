let csvEditor = require('csv-cell-editor')
const file_name = require('../helper')
const AppError = require('../error/AppError')

class UpdateController{


  data(req, res, next) {
 
   const line = parseInt(req.body.row_id) + 2
    console.log(req.body)
 if(!req.body.headlines &&!req.body.time&&!req.body.description ){
  next(AppError.badRequest('Empty data was sent')) 
  return
 }
 
  
 if(req.body.headlines){
   updateCell('A'+line, req.body.headlines)
 }
  
 if(req.body.description){
  updateCell('C'+line, req.body.description)
 }
  
 if(req.body.time){
  updateCell('B'+line, req.body.time) 
 }
   res.status(201).json({
     message: 'updated'
   })
 }
 
 
 
 }
 function updateCell(cellAdres, val){
  let value = val
  if(/^[a-zA-Z0-9- ]*$/. test(val) == false) {
   
  }

  let options = { fileName: file_name, cellAddress: cellAdres, cellValue: value}
  try {
    csvEditor(options)
  } catch (error) {
    next(AppError.internal('Error while updating csv')) 
    return
  }
    

}
 
 module.exports = new UpdateController()