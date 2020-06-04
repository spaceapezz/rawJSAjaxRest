/*
Brian Reza Smith
   */

/*
	functions and helper functions for making http GET, POST, abd DELETE
       	requests using native XMLHttpRequest object. Also, client-side functions specific to 
	rawJSAjaxRest app.
	
	includes the following:

	-getResource(urlString)->promise
		uses promises and only resolves when 
		given http type and request completes. 
		formats response as JSON.
	-updateTable()
		performs GET request on /users/ using getResource()
		and renders response 
		in ugly HTML/CSS table. 
	-getFormObject()->object
		returns data object of all form data with 
		DOM ID as key and associated value as
		value. converts checkbox values to integers
		for use in sql insertion.
	-formObjectToParamString(formObject)->string 
		converts form object made with getFormObject() into a string
		able to be passed during http POST as 
		Content-type: application/x-www-form-urlencoded
		I only used this for testing as I wanted
		to practice passing data as json.

	-submitData(dataObject, urlString)->promise
		will POST argument dataObject as JSON
		where it will either INSERT or UPDATE
		a row in the database, 
		and only resolve/reject when 
		receiving http response. 
	-checkBoxClick()
		submitData(getFormObject(), 'users') 
		updateTable()
	-deleteEntryClick(keyString, valString)
		deleteData(keyString, valString, 'users')
		updateTable()
	-deleteData(keyString, valString, urlString)->promise
		send xmlHttpRequest to
		DELETE to urlString with
	        jsonified body incliuding keyString 
		and valString	
*/
function getResource(resource)
{
	let xhr = new XMLHttpRequest();

	return new Promise((resolve, reject)=>
	{
		//only run if request is complete
		xhr.onreadystatechange = () =>
		{
			if(xhr.readyState !== 4)
			{
				return;
			}
			if(xhr.status >= 200 && xhr.status < 300)
			{
				resolve(xhr);
			}
			else
			{
				reject(`ERROR status: ${xhr.status} statusText: ${xhr.statusText}`);
			}

		}
		//promise will not be resolved or rejected
		//until http request readystate 
		//listener triggers
		// with a readyState besides 4

		//this feels out of order but it is not.

		xhr.open('GET', resource);
		xhr.responseType="json";
		xhr.send();
	})
}


function updateTable()
{
	getResource("users/")
	.then((xhr)=>{
			resultsTable = document.querySelector("#resultsTable")
			resultsTable.innerHTML = "<tr><th>name</th><th>red?</th><th>green?</th><th>blue?</th><th>delete?</th></tr>"
			xhr.response.forEach((row)=>{

				resultsTable.innerHTML += `<th>${row.name} </th> <td>${row.likesRed}</td> <td>${row.likesGreen}</td> <td>${row.likesBlue} </td> <td class="deleteButton" onclick="deleteEntryClick('name', '${row.name}')">x</td></tr>`;
				})
		})
}

function getFormObject()
{
	return {
		//string value so adding quotes for SQL 
		name: "'"+document.querySelector('#nameText').value+"'",
		likesRed: document.querySelector('#redCheck').checked ? 1 :0,
		likesGreen: document.querySelector('#greenCheck').checked ? 1 : 0,
		likesBlue: document.querySelector('#blueCheck').checked ? 1 : 0

	}
}

function formObjectToParamString(formObject)
{
	paramString = "";
	for(key in formObject)
	{
		paramString += `${key}=${formObject[key]}&`;
	}
	//snip off last '&' character
	return paramString.substring(0, paramString.length-1);
}

function submitData(dataObject, urlString)
{
	let xhr = new XMLHttpRequest();


	return new Promise((resolve, reject)=>{
		xhr.onreadystatechange = ()=>{
				if(xhr.readyState !== 4)
				{
					return;
				}
				if(xhr.status >= 200 && xhr.status <300)
				{
					resolve(xhr);
				}
				else
				{
					reject("server error on submission. status: "+xhr.statusText);
				}
			}

			xhr.open('POST', 'users/', true);
			//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
			xhr.send(JSON.stringify(dataObject));	
			})

}

function checkBoxClick()
{
	submitData(getFormObject(), 'users')
	.then(
		//resolved
		()=>{
			updateTable();
		},
		//rejected
		(x)=>{
			console.log(x);
		}
		)
	.catch(
		//error
		()=> {
			console.log("submit promise error");
		}
		)

}

function deleteData(keyString, valString, urlString)
{

	let xhr = new XMLHttpRequest();
	keyValObj = {}
	//in order to set key dynamically 
	//for js object
	//must use square brackets
	keyValObj[keyString] = valString;
	return new Promise((resolve, reject)=>{
		xhr.onreadystatechange = ()=>{
				if(xhr.readyState !== 4)
				{
					return;
				}
				if(xhr.status >= 200 && xhr.status <300)
				{
					resolve(xhr);
				}
				else
				{
					reject("server error on submission. status: "+xhr.statusText);
				}
			}

			xhr.open('DELETE', urlString, true);
			//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
			xhr.send(JSON.stringify(keyValObj));	
			})
}


function deleteEntryClick(keyString, valString)
{
	deleteData(keyString, valString, 'users')
	.then(
		//resolved
		()=>{
			updateTable();
		},
		//rejected
		(x)=>{
			console.log(x);
		}
		)
	.catch(
		//error
		()=> {
			console.log("delete promise error");
		}
		)
}

document.querySelectorAll("input[type='checkbox']").forEach((box)=>{box.addEventListener('click', checkBoxClick)});

updateTable();
