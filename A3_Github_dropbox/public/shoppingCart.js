function removeCardButton(){
    idOfClient = this.id
    $.ajax({
        type: "GET",
        url: `http://localhost:5002/onlineShopping/deleteCard/${idOfClient}`,
        success: (callbackData) => {
            console.log(callbackData)
        }
    })
    processTimelineData();
}


function updateDiv(){
    location.reload();
}

// using the data from our DB.
// Appending these types of data that we have towards our timeline page.
// Added a value changer for cart quantity input.
function processTimelineData(received_data){
    for(i = 0; i <received_data.length; i++){
        $(".big-container-for-cards").append(
            `
            <div class="shoppingBoxItem shop-column">
            <a> <h4> Pokemon Card - ${received_data[i].name} </h4></a>
            </div>
            <div class="shoppingBoxPrice shop-column">
            <a> $${received_data[i].price} </a>
            </div>
            <div class="shoppingBoxQty shop-column">
            <a> <input id=""class="card-quantity-input" type="number" value="${received_data[i].qty}"></a>
            <a><button class="DeleteButton" id=${received_data[i]._id}>Remove</button> </a>
            </div>
            `
        )   
    }
}

{/*<a> <button class="LikeButton" id=${received_data[i]._id}>Like Button!</button> </a>
<a> <button class="DeleteButton" id=${received_data[i]._id}>Delete profile off DB!</button> </a> */}

function changeQty(value){
    idOfClient = this.id
    var original_qty = value 
    console.log(original_qty)

}

// Shopping Cart Load
function loadShoppingCartData(){
    $.ajax({
        type: "GET",
        url: "http://localhost:5002/onlineShopping/getShoppingCartData",
        success: processTimelineData
    })
}

function setup(){
    loadShoppingCartData()
    $(".big-container-for-cards").on('click', '.DeleteButton', removeCardButton)
    // based on event change.
    $(".big-container-for-cards").on('change','.card-quantity-input', changeQty)
    // document.getElementsByClassName("card-quantity-input").addEventListener("change", changeQty(this.value));

    // $(".card-quantity-input").change(() => {
    //     poke_type = $("#poke_type option:selected").val();
    //     display($("#poke_type option:selected").val());
    // })
}
$(document).ready(setup)