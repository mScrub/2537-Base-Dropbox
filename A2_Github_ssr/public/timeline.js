




// several paths for user where https:// is localhost:5000, using server.js's crud ops
function loadEvents(){
    $.ajax({
        type: "GET",
        url: "https://young-everglades-99074.herokuapp.com/timeline/getEvents",
        success: processTimelineData
    })
}



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


function increaseHitsByUser(){
    idOfClient = this.id
    $.ajax({
        type: "GET",
        url: `https://young-everglades-99074.herokuapp.com/timeline/increaseHitsCount/${idOfClient}`,
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
        url: `https://young-everglades-99074.herokuapp.com/timeline/delete/${idOfClient}`,
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