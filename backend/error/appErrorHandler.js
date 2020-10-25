const AppError = require("./AppError")
//error handler middleware
function appErrorHandler(err, req,res ,next){
  console.log(err)
  if(err instanceof AppError){
res.status(err.code).json(err.message)
return
  }
  res.status(500).json('Something went wrong')
}
module.exports =  appErrorHandler