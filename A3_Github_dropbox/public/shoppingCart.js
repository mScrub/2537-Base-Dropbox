// // async and await for the changes to happen.
// async function changeQty() {
//     // listens to thjis value 

//     // so this value targets our class .cardprice, but we used list item to hold the value
//     price = $('.card-price').val();
//     console.log('price is' + price)
//     quantity = $(this).val();
//     console.log(quantity)
//     idOfAttributeWhichIsClient = this.id
//     if (quantity >= 1) {
//         for (let i = 0; i < quantity; i++) {
//             await $.ajax({
//                 type: "GET",
//                 url: `http://localhost:5002/onlineShopping/increaseCardQty/${idOfAttributeWhichIsClient}`,
//                 success: () => {
//                     $.ajax({
//                         type: "GET",
//                         url: `http://localhost:5002/onlineShopping/getShoppingCartData`,
//                         success: (callbackData) => {
//                             console.log(callbackData)
//                         }
//                     })
//                 }
//             })
//         }
//         loadShoppingCartData();
//     } else if (quantity < 1) {
//         for (let i = 0; i > quantity; quantity++) {
//             await $.ajax({
//                 type: "GET",
//                 url: `http://localhost:5002/onlineShopping/decreaseCardQty/${idOfAttributeWhichIsClient}`,
//                 success: (callbackData) => {
//                     console.log(callbackData)
//                 }
//             })
//         }
//         // only update cart after x number of increments.
//         loadShoppingCartData();
//     }





// remove card feature
function removeCardButton() {
    idOfClient = this.id
    console.log(idOfClient)
    $.ajax({
        type: "GET",
        url: `https://shielded-oasis-91506.herokuapp.com/onlineShopping/deleteCard/${idOfClient}`,
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



// some math..

// if (thisValue )

// console.log(idOfValue)


// console.log(idOfAttribute)
// Gotta use this? rather..?
// currentValue = $(this).val(); 
// console.log(currentValue)

//     var cartItemContainer = document.getElementsByClassName('card-quantity-input')[0].p

// $.ajax({
//     type: "GET",
//     url: `http://localhost:5002/onlineShopping/increaseCardQty/${idOfAttribute}`,
//     success: (callbackData) => {
//         console.log(callbackData)
//         loadShoppingCartData();
//     }
// })

quantity = null
cardPrice = null

// function changeCardTotal(incrementObject) {
//     incrementObject[0].total = quantity * cardPrice
//     $.ajax({
//         type: "GET",
//         url: `https://shielded-oasis-91506.herokuapp.com/onlineShopping/increaseCardTotal/${idOfAttributeWhichIsClient}/${incrementObject[0].total}`,
//         success: () => {}
//     })
//     loadShoppingCartData();
// }

// async and await for the changes to happen.
async function changeQty() {
    cardPrice = $('.card-price').val();
    // quantity = $(this).val().empty(); 
    quantity = $(this).val();
    idOfAttributeWhichIsClient = this.id
    cardTotal = $('.card-total').val();
    incrementTotal = quantity * cardPrice;
    if (quantity >= 0) {
        await $.ajax({
            type: "GET",
            url: `https://shielded-oasis-91506.herokuapp.com/onlineShopping/increaseCardQty/${idOfAttributeWhichIsClient}/${quantity}`,
            success: (object) => {
                loadShoppingCartData();
            }
        }).then($.ajax({
            type: "GET",
            url: `https://shielded-oasis-91506.herokuapp.com/onlineShopping/increaseCardTotal/${idOfAttributeWhichIsClient}/${incrementTotal}`,
            data:{},
            success: (callbackData) => {
                loadShoppingCartData();
                // changeCardTotal(callbackData);
            }
        }))
    } else if (quantity < 1) {
        await $.ajax({
            type: "GET",
            url: `https://shielded-oasis-91506.herokuapp.com/onlineShopping/decreaseCardQty/${idOfAttributeWhichIsClient}/${quantity}`,
            success: () => {
                loadShoppingCartData();
            }
        }).then($.ajax({
            type: "GET",
            url: `https://shielded-oasis-91506.herokuapp.com/onlineShopping/increaseCardTotal/${idOfAttributeWhichIsClient}/${incrementTotal}`,
            success: (callbackData) => {
                loadShoppingCartData();
            }
        }))
    }
}


// took out of span
//                     <span class="card-price" value="${received_data[i].price}"> ${received_data[i].price} </span>
// pay attn to ._id = object id of the ajax request =_=!
async function loadShoppingCartData() {
    $('.big-container-for-cards').empty();
    await $.ajax({
        type: "GET",
        url: `https://shielded-oasis-91506.herokuapp.com/onlineShopping/getShoppingCartData`,
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
                    <input id="${received_data[i]._id}" onfocus="this.value=''" class="card-quantity-input" type="number" value="${received_data[i].qty}"}>
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


function setup() {
    loadShoppingCartData()
    $(".big-container-for-cards").on('click', '.DeleteButton', removeCardButton)
    $(".big-container-for-cards").on('change', '.card-quantity-input', changeQty)
}

$(document).ready(setup)


// old style reload
function updateDiv() {
    location.reload();
}