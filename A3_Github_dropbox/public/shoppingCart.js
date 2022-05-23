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

function increaseCardTotal(incrementObject) {
    // incrementObject.preventDefault();
    // didn't use incrementObject anyway?? 
    // console.log(incrementObject)
    // // console.log("Price of Card" + incrementObject.price)
    incrementObject[0].total = quantity * cardPrice
    // console.log(incrementObject[0].total)

    console.log(quantity)
    console.log(cardPrice)
    if (incrementObject[0].total == incrementObject[0].total){
        $.ajax({
            type: "GET",
            url: `http://localhost:5002/onlineShopping/increaseCardTotal/${idOfAttributeWhichIsClient}/${incrementObject[0].total}`,
            success: () => {}
        })
        loadShoppingCartData();
    }


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
    // so this value targets our class .cardprice, but we used list item to hold the value
    // price = $('.card-price').val();
    // console.log('price is' + price)
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