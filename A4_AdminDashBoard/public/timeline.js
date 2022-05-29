

// several paths for user where https:// is localhost:5000, using server.js's crud ops
// Reading into our database.
function loadEvents(){
    $.ajax({
        type: "GET",
        url: "https://shielded-oasis-91506.herokuapp.com/onlineShopping/getShoppingCartData",
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
            <h4> Pokemon Name - ${received_data[i].name} </h4>
            <a> Event time - ${received_data[i].time} </a>
            <a id=userHits> Event price - ${received_data[i].price} </a>
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
    quantity = $(this).val();
    idOfAttributeWhichIsClient = this.id 
    $.ajax({
        type: "GET",
        url: `https://shielded-oasis-91506.herokuapp.com/onlineShopping/increaseCardQty/${idOfAttributeWhichIsClient}/${quantity}`,
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
        url: `https://shielded-oasis-91506.herokuapp.com/onlineShopping/deleteCard/${idOfClient}`,
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