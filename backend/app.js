const express = require('express')
const path = require('path')
const app = express()

const fs = require('fs')
const csv = require('csv-parser')

var http = require('http').createServer(app)
var io = require('socket.io')(http)

var cors = require("cors");
app.use(cors());

//to get Json from Post
const bodyParser = require('body-parser')


const dataController = require('./controllers/data')
const allDataController =require('./controllers/allData')
const updateController = require('./controllers/updateData')
const file_name = require('./helper')
const appErrHandler = require('./error/appErrorHandler')

 // watch csv changes and notifie all clients 
 fs.watchFile(file_name, {
     persistent: true,
     interval: 1000,
   },
   function(data) {
   
    io.emit('updateScreen', { message: 'FileChanged' })
     console.log('send msg')
   },
 )

//bonus create data.json for circles div
function createJsonCsv (apple){
  let list2020 =[]
  let list2019=[]
    apple.forEach((elt)=>{
    
      if(elt.date ==="2020"){
        if(elt.value>2)
        list2020.push({"name": elt.name, "value" :elt.value})
      }else if(elt.date ==="2019"){
        if(elt.value>2)
        list2019.push({"name": elt.name, "value" :elt.value})
      }
  
    })
  
    let js = {"name": "Apple",
              "value": 100 ,
              "children" : [{
                "name": "2020",
              "value": 75,
              "children" : list2020
  },{"name": "2019",
  "value":75 ,
  "children" : list2019
  }  ]
  }
  return js
  
  }

  app.use((req, res, next)=>{
    let result = []
    let readStream= fs.createReadStream(file_name)

    readStream.pipe(csv({ })).on('data',(data)=>{ 
      result.push(data)
    }).on('end',()=>{
      let appleLinesArr = []
      let apple =[]
      result.forEach((element ,index )=> {
        let line = element.Headlines+' '+element.Description
  
      if(line.toLowerCase().indexOf('apple')>-1){
  
        let tmp =element.Time.split(' ').reverse()
        let year= tmp[0]
         appleLinesArr = line.replace(/[^a-zA-Z0-9 ]/g,'').split(' ')
         appleLinesArr.forEach((word)=>{
           if( notToShow.indexOf(word.toLowerCase()) < 0){
               let is_new_word = true
                 apple.forEach((elt, index)=>{
                   if(elt.name === word && elt.date === year){
                     apple[index].value = apple[index].value + 1
                     is_new_word = false
                   }
                 
                 })//words
                 
                 if(is_new_word){
              
                   apple.push({name : word , value : 1 , date: year })
                }
              }// && notToShow.indexOf(e.word.toLowerCase()) < 0
              })//lineArr
    
      }
    })
   
    fs.writeFile("data.json", JSON.stringify(createJsonCsv (apple)), (err) => {
      if (err) throw err;
      console.log('Data written to file');
  })
   })
   next()
  })

  const notToShow = ['were','cnbcs','dont','hes','Im','i m','cramers','bell','amid','because','way','reveals','reports','run','shares','portfolio','viewers','through','know','news','where','ahead:','why','year','take','back','500','everything','been','make','next','gives','talks','also','just','before','better','just','calls','week','than','need','right','remix:','ahead','cramer:','day','rally','day','then','own','sits','still','during','backs','best','look','was','cnbc','market','still','i','too','was','end','explains','speed','going','from','now','re','your','answers','callers','rapid','spead','round:','questions','there','time','when','may','think','could','mean','some','very','what','','including','lightning','means','giving','rings','round','stock','stocks','ceo','are','be','told','one','lot','it','have','into','2020','should','how','will', 've','new','up','want','about','these','after', 'here','out','their','over','here','like','good','they','but','can','for','on','you','that','much','me','m','don','people','big','got','isn','do','see','big','let','get','go','if','hit','she','all', 'an','half','not','no','per','our','as', "it\'" ,'with','by', 'more','this','his','is','of','a', 'the', 'to', 'at', 'has', 'its', 'he', 'or', 'so', 'we' , 'it.' , 'off', 'in', 'mad', 'money' ,'host' ,'says','advised' ,"cramer\'s",'cramer','and', "he\'s" ,'s','t','u','jim' ,'said', 'which']
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.post('/data', updateController.data)
app.use('/data/All',allDataController.data)
app.use('/data/:id', dataController.data)
app.use('/index.js', (req, res, next) => {
  res.sendFile(path.join(__dirname + "./../frontend/index.js"))
})
app.use('/bonus.js', (req, res, next) => {
  res.sendFile(path.join(__dirname + "./../frontend/bonus.js"))
})
app.use('/d3.layout.js', (req, res, next) => {
  res.sendFile(path.join(__dirname + "./../frontend/d3.layout.js"))
})
app.use('/style.css', (req, res, next) => {
  res.sendFile(path.join(__dirname + "./../frontend/style.css"))
})
app.use('/data.json', (req, res, next) => {
  res.sendFile(path.join(__dirname + "/data.json"))
})
app.use('/socket.io/socket.io.js', (req, res, next) => {
  res.sendFile(path.join(__dirname + "./../node_modules/socket.io-client/dist/socket.io.js"))
})
app.use('/bonus.html', (req, res, next) => {
  res.sendFile(path.join(__dirname + "./../frontend/bonus.html"))
})
app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + "./../frontend/index.html"))
})
app.use(appErrHandler)


http.listen(3000, () => {
  console.log('hello')
})
module.exports = app