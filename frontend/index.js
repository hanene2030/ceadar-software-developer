const socket = io.connect('http://localhost:3000')
	

// handle the event sent with socket.emit()
/**•	If a user makes changes to the csv, these changes should be automatically displayed in the front end. */
socket.on('updateScreen', (data) => {


	cleanTbody()
	showDataPerPage(page)


})

const url = "http://localhost:8080/data"

let page = 0
//pagination
function getData(page) {

  const url_Page = url+"/"+page
  return fetch(url_Page )
    .then((response) => response.json())
    .catch((error) => console.log(error))
}


function line(element, index){
 const row_id = index +page
return `<td><div class="cell" edit_type="click" col_name="time">${element.Time}</div></td><td><div class="cell" edit_type="click" col_name="headlines">${element.Headlines}</div>

  </td><td><div class="cell" edit_type="click" col_name="description">${element.Description}</div>
	 </td>`
	 


}
function show(result  ){

  result.forEach((element ,index )=> {
   
    let tr = document.createElement('tr')
    tr.setAttribute("row_id", index+page)
    tr.innerHTML= line(element,index)
    tbody.appendChild(tr)
  
  })


}
function cleanTbody(){
	while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild)
}
}
function showDataSorted(result){
	cleanTbody()
  show(result)
}
function showDataPerPage(page){
  getData(page).then(
    (data) => {
      let result = JSON.parse(data)
      show(result  )
  })
  
}

//pagination =>detect bottom to upload more data from server  
window.addEventListener('scroll', function(e) {

 if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight ) {
  showDataPerPage(++page)

 }

})


window.addEventListener("DOMContentLoaded",function(){
const tbody = document.getElementById('tbody')
showDataPerPage(page)


})
/**	Without using a library or built-in function, write your own function to sort the data on a particular field. The sorting function you create can be added into the front end or back end. Add in a button to trigger the sorting. The button could have a label such as “sort by <insert field>”. */
let selected = '3'
document.getElementById('sort').addEventListener('click',(e)=>{
  let select = document.querySelector('select')
  sort(select.value)
})
function sort(elt){
  selected = elt
 getData(page).then(
  (data) => {
		let result = JSON.parse(data)
		let msg = document.getElementById('message')
		msg.innerHTML = 'Sort operation started'
		msg.style.color ='red'
    result.sort(compare)
		showDataSorted(result )
		msg.innerHTML ='Sort operation ended'
		msg.style.color ='green'

  })
}
//This function to be able to compare objects inside the data array using properties
function compare(oA, oB) {
  let a = ''
  let b = ''
  if(selected === '0'){
     a = oA.Time.toUpperCase()
     b = oB.Time.toUpperCase()
  }else if(selected === '1'){
    a = oA.Headlines.toUpperCase()
     b = oB.Headlines.toUpperCase()
  }else if(selected === '2'){
    a = oA.Description.toUpperCase()
     b = oB.Description.toUpperCase()
  }
  let comparison = 0
  if (a > b) {
    comparison = 1
  } else if (a < b) {
    comparison = -1
  }
  return comparison
}
/**	This table should be editable, and once changes are made, those changes should be persisted to the original csv file. */
	//make tr editable
	$(document).on('click', '.cell', function(event) 
	{
		event.preventDefault()

	

		//make div editable 
		$(this).closest('div').attr('contenteditable', 'true')
		$(this).addClass('bg-updating').css('padding','5px')

		$(this).focus()
	})	
  // cell data when focusout
	$(document).on('focusout', '.cell', function(event) 
	{
		event.preventDefault()

		if($(this).attr('edit_type') == 'button')
		{
			return false
		}

		var row_id = $(this).closest('tr').attr('row_id')
		
		var row_div = $(this)				
		.removeClass('bg-updating') 
		.css('padding','')

		var col_name = row_div.attr('col_name') 
		var col_val = row_div.html() 

		var arr = {}
		arr[col_name] = col_val

		$.extend(arr, {row_id:row_id})

  
		//save send to nodejs
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      success: handleClabackUpdate,
      data: JSON.stringify(arr)
  })
		 
		
	})	
  function handleClabackUpdate(data, status, xhr){
		console.log('status: ' + status + ', data: ' + data.message)
		//do nothing page will be updated via socket
		page = 0

  }