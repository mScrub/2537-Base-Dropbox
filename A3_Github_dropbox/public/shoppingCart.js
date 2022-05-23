// remove card feature
function removeCardButton() {
    idOfClient = this.id
    console.log(idOfClient)
    $.ajax({
        type: "GET",
        url: `http://localhost:5002/onlineShopping/deleteCard/${idOfClient}`,
        success: (callbackData) => {
            console.log(callbackData)
            loadShoppingCartData();
        }
    })
}




// using the data from our DB.
// Appending these types of data that we have towards our timeline page.
// Added a value changer for cart quantity input.

{
    /*<a> <button class="LikeButton" id=${received_data[i]._id}>Like Button!</button> </a>
    <a> <button class="DeleteButton" id=${received_data[i]._id}>Delete profile off DB!</button> </a> */
    // if we out scope, we select what to delete etc, hence we grab an entire container etc.
}



quantity = null
cardPrice = null

function increaseCardTotal(incrementObject) {
    incrementObject[0].total = quantity * cardPrice
    // console.log(incrementObject[0].total)

    console.log(quantity)
    console.log(cardPrice)
    $.ajax({
        type: "GET",
        url: `http://localhost:5002/onlineShopping/increaseCardTotal/${idOfAttributeWhichIsClient}/${incrementObject[0].total}`,
        success: () => {}
    })
    loadShoppingCartData();



    // .then($.ajax({
    //     type: "GET",
    //     url: `http://localhost:5002/onlineShopping/getShoppingCartData`,
    //     success: (callbackData) => {
    //         // loadShoppingCartData();
    //         // increaseCardTotal(callbackData);
    //         // in this function, we then want to update the card price. 
    //         // console.log(callbackData)
    //     }
    // }))

}

// old style reload
function updateDiv() {
    location.reload();
}

// async and await for the changes to happen.
async function changeQty() {
    cardPrice = $('.card-price').val();
    quantity = $(this).val();
    console.log(quantity)
    idOfAttributeWhichIsClient = this.id
    if (quantity >= 0) {
        await $.ajax({
            type: "GET",
            url: `http://localhost:5002/onlineShopping/increaseCardQty/${idOfAttributeWhichIsClient}/${quantity}`,
            success: () => {}
            // empty success.
        }).then($.ajax({
            type: "GET",
            url: `http://localhost:5002/onlineShopping/getShoppingCartData`,
            success: (callbackData) => {
                // loadShoppingCartData();
                increaseCardTotal(callbackData);
                // in this function, we then want to update the card price. 
                // console.log(callbackData)
            }
        }))
    } else if (quantity < 1) {
        await $.ajax({
            type: "GET",
            url: `http://localhost:5002/onlineShopping/decreaseCardQty/${idOfAttributeWhichIsClient}/${quantity}`,
            success: () => {}
        }).then($.ajax({
            type: "GET",
            url: `http://localhost:5002/onlineShopping/getShoppingCartData`,
            success: (callbackData) => {
                // decrementPriceValue(callbackData);
                // loadShoppingCartData();
                // in this function, we then want to update the card price. 
                // change price downwards.
            }
        }))
    }
}


// took out of span
//                     <span class="card-price" value="${received_data[i].price}"> ${received_data[i].price} </span>
// pay attn to ._id = object id of the ajax request =_=!
// Shopping Cart Load, placement is also key, if we redefine another function
// That function in itself will not be able to do real time delete
async function loadShoppingCartData() {
    $('.big-container-for-cards').empty();
    await $.ajax({
        type: "GET",
        url: "http://localhost:5002/onlineShopping/getShoppingCartData",
        success: (received_data) => {
            for (i = 0; i < received_data.length; i++) {
                $(".big-container-for-cards").append(
                    `
                    <div class="shoppingBoxItem shop-column">
                    <a> <h4> Pokemon Card - ${received_data[i].name} </h4></a>
                    </div>
                    <div class="shoppingBoxPrice shop-column">
                    <li id="${received_data[i]._id}" class="card-price" type="number" value="${received_data[i].price}"}>$${received_data[i].price}</li>
                    </div>
                    <div class="shoppingBoxQty shop-column">
                    <input id="${received_data[i]._id}" class="card-quantity-input" type="number" value="${received_data[i].qty}"}>
                    </div>
                    </div>
                    <div class="shoppingBoxTotal shop-column">
                    <li id="${received_data[i]._id}" class="card-total" type="number" value="${received_data[i].total}"}>$${received_data[i].total}</li>
                    <a><button class="DeleteButton" id=${received_data[i]._id}>Remove</button> </a>
                    </div>
                    `
                )
            }
        }
    })
}


//  class="card-price" id="${received_data[i]._id}



function setup() {
    loadShoppingCartData()
    $(".big-container-for-cards").on('click', '.DeleteButton', removeCardButton)
    // based on event change.
    // target container, target id, event changer
    // var cartItemContainer = document.getElementsByClassName('card-quantity-input')[0].value
    // console.log(cartItemContainer)

    $(".big-container-for-cards").on('change', '.card-quantity-input', changeQty)
    // document.getElementsByClassName("card-quantity-input").addEventListener("change", changeQty(this.value));
}

$(document).ready(setup)


// old style reload
function updateDiv() {
    location.reload();
}