
const url = "http://localhost:8080/data/All"
function getAllData() {
  const url_Page = url
 
  return fetch(url_Page)
    .then((response) => response.json())
    .catch((error) => console.log(error))
}
 


function drawAppleCircles(){
 

let width = 1200
let height = 700

let canvas = d3.select("#circles")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g").attr("transform","translate(2,2)")

 
    let pack = d3.pack().size([width,height -50]).padding(10)

    d3.json('data.json',function(error, root){
      if (error) throw error;

      root = d3.hierarchy(root)
          .sum(function(d) { return d.size; })
          .sort(function(a, b) { return b.value - a.value; });
      let node = canvas.selectAll(".node")
      .data(pack(root).descendants())
      .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
       .attr("transform", function(d) {
        let x = 0
        let y = 0
      //to deal with the current bug in d3js d.x and d.y =>NAN
         if(d.parent &&d.parent.data != "Apple" && d.name !="2020"&& d.name !="2019" ){
            if(d.parent.data === "2019"){
            x= (Math.round(Math.random() *1000) ) %600 
            y=  (Math.round(Math.random() *1000) ) %350
            }else{
              x=(600+ Math.round(Math.random() *1000) ) %600
              y= (350+ Math.round(Math.random() *1000) ) %350

            }
         }
   
         if(d.name==="2019" ){
          
          x=  Math.round(Math.random() *1000)  %600 
          y=  Math.round(Math.random() *1000)  %350

         }else if(d.name==="2020" ){
          x= 600+ Math.round(Math.random() *1000)  %600 
          y= 350+ Math.round(Math.random() *1000) %350

         }
         
         
         if(x > 100) x -=30
         if(y > 100) y -=30
       // if(isNaN(d.x)){
          return "translate(" + x+ "," + y + ")";
        //}else{
       
          //return "translate(" + d.x + "," + d.y  + ")"
        //}
         })
  
        node.append("title")
        .text(function(d) { 
          return d.data.name  });
  
        node.append("circle")
        .attr("r", function(d) { 
          return isNaN(d.r) ? d.data.value : d.r })
        //  .attr('fill', 'steelblue')
          .attr('opacity',0.25)
          //.attr('stroke','#adadad')
         // .attr('stroke-width','3')
          .attr("fill", d =>{ 

            if(d.data.name==="Apple")    return 'white'
            if(d.data.name==="2020")    return 'red'
            if(d.data.name==="2019")    return 'green'
            
            if(d.children){
              //d.parent.data
            if(d.children[0].data.name === "2020"){
              return 'red'
            }else if( d.children[1].data.name === "2019"){
                  return 'green'
                }
              
                
            }else{

              if(d.parent.data.name ==="2020"){
                return 'red'
              } else if(d.parent.data.name ==="2019"){
                return 'green'
              }
            
            
            }
            })

        node//.filter(function(d) { return !d.children; })
        .append("text")
        .attr("dy", "0.3em")
        .text(function(d) { 
       if(d.data.name==="Apple") return ""
          return d.data.name; });


    })


}

function showBonus(){
  let labelsMonth =[]
  let nbPerMonth =[]
  
    getAllData().then ((data) => {
      let result = JSON.parse(data)
      result.forEach((element ,index )=> {
        let tmp =element.Time.split(' ').reverse()
          let month= tmp[1]
          let year= tmp[0]
    month = month+'/'+year 
      if(labelsMonth.indexOf(month) < 0){
        labelsMonth.unshift(month)
        nbPerMonth.unshift({name : month , val : 1})
  
      }else{
        nbPerMonth.forEach((elt, index)=>{
          if(elt.name === month){
            nbPerMonth[index].val = nbPerMonth[index].val + 1
          }
        })
      }
         
  
      })
       
  let dataChart =[]
  nbPerMonth.forEach(obj=>{
    dataChart.unshift(obj.val)
  })
       
  var config = {
    type: 'line',
    data: {
      labels: labelsMonth,
      datasets: [{
        label: 'Number of lines per month',
        backgroundColor: '#333',
        borderColor: '#333',
        data: dataChart ,
        fill: false,
      }
    ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: ''
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Months'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Nb lines'
          }
        }]
      }
    }
  }
  
       let ctx = document.getElementById('canvasId').getContext('2d')
        let chart = new Chart(ctx, config)
  
    })
  
  }
  
  window.addEventListener("DOMContentLoaded",function(){

  showBonus()
  drawAppleCircles()
  getCloudAfterCovid()
  
  getCloudBeforeCovid()
  })
  function getCloudBeforeCovid (){
    //same nb of line  as getCloudAfterCovid
   getCloud(573, 1146)
  }
  function getCloudAfterCovid (){

    getCloud(0, 572)
  }

const notToShow = ['were','cnbcs','dont','hes','Im','i m','cramers','bell','amid','because','way','reveals','reports','run','shares','portfolio','viewers','through','know','news','where','ahead:','why','year','take','back','500','everything','been','make','next','gives','talks','also','just','before','better','just','calls','week','than','need','right','remix:','ahead','cramer:','day','rally','day','then','own','sits','still','during','backs','best','look','was','cnbc','market','still','i','too','was','end','explains','speed','going','from','now','re','your','answers','callers','rapid','spead','round:','questions','there','time','when','may','think','could','mean','some','very','what','','including','lightning','means','giving','rings','round','stock','stocks','ceo','are','be','told','one','lot','it','have','into','2020','should','how','will', 've','new','up','want','about','these','after', 'here','out','their','over','here','like','good','they','but','can','for','on','you','that','much','me','m','don','people','big','got','isn','do','see','big','let','get','go','if','hit','she','all', 'an','half','not','no','per','our','as', "it\'" ,'with','by', 'more','this','his','is','of','a', 'the', 'to', 'at', 'has', 'its', 'he', 'or', 'so', 'we' , 'it.' , 'off', 'in', 'mad', 'money' ,'host' ,'says','advised' ,"cramer\'s",'cramer','and', "he\'s" ,'s','t','u','jim' ,'said', 'which']
function showBonus3(words , end){
let width = 700 
let height = 500
  
var layout = d3.layout.cloud()
    .size([width, height])
    .words(words.filter(function(e){return e.val > 15 })
    .map(function(d) {
      return {text: d.word, size: d.val*2/3}; 
    }))
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw);

layout.start();

function draw(words, end) {
  let cloud ='#word-cloud1'

 
  if(end  === 753){
    cloud = '#word-cloud2'
  }

  d3.select(cloud).append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height/ 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
      
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}
}


  //Second part
 async function getCloud(start, end ){
 
    var words =[]
    getAllData().then ((data) => {
      let result = JSON.parse(data)
      //30 value related to July2020
     let sample =  result.slice(start,end)
     sample.forEach((element ,index )=> {
        let line = element.Headlines+' '+element.Description


        let lineArr = line.replace(/[^a-zA-Z0-9 ]/g,'').split(' ')

        lineArr.forEach((word)=>{
     if( notToShow.indexOf(word.toLowerCase()) < 0){
         let is_new_word = true
           words.forEach((elt, index)=>{
             if(elt.word === word){
               words[index].val = words[index].val + 1
               is_new_word = false
             }
           
           })//words
           
           if(is_new_word){
        
           words.push({word : word , val : 1  })
          }
        }// && notToShow.indexOf(e.word.toLowerCase()) < 0
        })//lineArr
      
    
      })//sample
    }).then(()=>{  
     
      words.sort(compare)
      showBonus3(words , end)})

  
    
  }

  
function compare(oA, oB) {
  let a = oA.val
  let b = oB.val


  let comparison = 0
  if (a > b) {
    comparison = 1
  } else if (a < b) {
    comparison = -1
  }
  return comparison
}