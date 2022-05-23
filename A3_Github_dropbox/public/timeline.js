


// Timeline.js reads the database values
// Also allows for Updating and Deleting (CRUD)
// Only permissible because of routes.

// several paths for user where https:// is localhost:5000, using server.js's crud ops
// Reading into our database.
function loadEvents(){
    $.ajax({
        type: "GET",
        url: "http://localhost:5002/onlineShopping/getShoppingCartData",
        success: processTimelineData
    })
}


// using the data from our DB.
// Appending these types of data that we have towards our timeline page.
function processTimelineData(received_data){
    for(i = 0; i <received_data.length; i++){
        $(".historicalData").append(
            `
            <div class="userInfoContainer" id=UserContainer>
            <h4> Event text - ${received_data[i].text} </h4>
            <a> Event time - ${received_data[i].time} </a>
            <a id=userHits> Event hits - ${received_data[i].hits} </a>
            <a> <button class="LikeButton" id=${received_data[i]._id}>Like Button!</button> </a>
            <a> <button class="DeleteButton" id=${received_data[i]._id}>Delete profile off DB!</button> </a>
            </div>
            `
        )   
    }

}


// Removal of data or Qty etc..
function increaseHitsByUser(){
    // grab the id of the client from timeline.html, and it's specific to the id 
    // Or it's the id of the user in DB?
    idOfClient = this.id 
    $.ajax({
        type: "GET",
        url: `http://localhost:5000/onlineShopping/increaseCardQty/${idOfClient}`,
        success: (callbackData) => {
            console.log(callbackData)
        }
    })
    updateDiv();
}


function deleteClientData(){
    idOfClient = this.id
    $.ajax({
        type: "GET",
        url: `http://localhost:5000/onlineShopping/deleteCard/${idOfClient}`,
        success: (callbackData) => {
            console.log(callbackData)
        }
    })
    updateDiv();
}


function updateDiv(){
    location.reload();
}


function setup(){
    loadEvents()
    $(".historicalData").on('click','.LikeButton', increaseHitsByUser)
    $(".historicalData").on('click', '.DeleteButton', deleteClientData)


}
$(document).ready(setup)