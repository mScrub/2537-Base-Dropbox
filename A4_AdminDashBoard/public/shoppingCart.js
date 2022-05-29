
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


quantity = null
cardPrice = null

// async and await for the changes to happen.
async function changeQty() {
    cardPrice = $('.card-price').val();
    quantity = $(this).val();
    idOfAttributeWhichIsClient = this.id
    if (quantity === 1){
        quantity += 1;
    }
    if (quantity === -1){
        quantity -= 1;
    }
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