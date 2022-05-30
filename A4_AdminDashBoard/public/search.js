var now = new Date(Date.now());
var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

pokemon_type_global = " "
add_them_divs = ''
var store_pokemon_name = "";
var searchIndex = [];
var searchIndexLinkTwo = [];


const colors = {
    fire: '#FBBF77',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eceda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
}


// Change it to call another function?
function processPokeType(obtainedApiToSetType) {
    // console.log(obtainedApiToSetType.types[0].type.name)
    if (pokemon_type_global === obtainedApiToSetType.types[0].type.name) {
        process_search_Pokemon_response(obtainedApiToSetType)
    }
}

// old API call type.
async function display(pokemon_type_) {
    $("main").empty();
    pokemon_type_global = pokemon_type_
    for (index_count = 1; index_count < 1126; index_count++) {
        if (index_count % 3 == 1) {
            add_them_divs += `<div class="images_group">`
        }
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${index_count}`,
            success: processPokeType
        })
    }
    if (index_count % 3 == 0) {
        add_them_divs += `</div>`;
    }
}


// Parsing through our searchIndex.
async function submitSearch() {

    if (!$("#searchPokemonName") || !$("#searchPokemonName").val()) {
        return;
    }
    var store_pokemon_name = $("#searchPokemonName").val();
    // insertSearchEventToTimeLine(store_pokemon_name);
    $("main").empty();
    for (let i = 0; i < searchIndex.length; i++) {
        let index = searchIndex[i].url.lastIndexOf("mon") + 3;
        let pokeIndex = searchIndex[i].url.substring(index).replace("/", "").replace("/", "");
        if (searchIndex[i].name.includes(store_pokemon_name.toLowerCase()) || pokeIndex == store_pokemon_name) {
            await $.ajax({
                type: "GET",
                url: searchIndex[i].url,
                success: process_search_Pokemon_response
            })
        }
    }
}

// A1 grab AJAX from specific API link via initialization
async function initSearch() {
    await $.ajax({
        type: "GET",
        url: `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`,
        success: function (result) {
            searchIndex = result.results;
            console.log(searchIndex);
        }
    })
}


// Appending pokemon images for display.
function process_search_Pokemon_response(obtained_api_data) {
    console.log(obtained_api_data)
    var bgColorChange = ""
    typeForColor = obtained_api_data.types[0].type.name
    for (var x in colors) {
        if (typeForColor == x) {
            bgColorChange = colors[x]
        }
    }
    $("main").append(`
            <div class="image_container" style="background-color:${bgColorChange}">
                <div class=OuterDiv>
                    <span>
                    <button class="shop-item-button">Add to Cart!</button>
                    </span>
                    <h3 class="shop-pokemon-name"> ${obtained_api_data.name} </h3> 
                    <a href="/profile/${obtained_api_data.id}">  
                    <img src="${obtained_api_data.sprites.other["official-artwork"].front_default}">
                    </a>
                    <span>
                    Price: <span class="shop-pokemon-price">${obtained_api_data.weight}</span>
                    </span>
                </div>
            </div>
            `)
}


function insertPokeMonToDB(retrievePokeName, retrieveCost) {
    let nameOfPokemon = retrievePokeName
    let priceOfPokemon = retrieveCost
    console.log(priceOfPokemon)
    $.ajax({
        url: "https://localhost:5002/onlineShopping/insertCardToPurchase",
        // Putting data pokemon name and qty into the database after Schema
        type: "PUT",
        data: {
            name: `${nameOfPokemon} `,
            price: `${priceOfPokemon}`,
            qty: 0,
            total: 0,
        },
        success: function () {}
    })
}

// only need name, price
function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var pokeName = shopItem.getElementsByClassName('shop-pokemon-name')[0].innerHTML
    var price = shopItem.getElementsByClassName('shop-pokemon-price')[0].innerHTML
    insertPokeMonToDB(pokeName, price)
}


function logoutClicked(){
// User hits the logout route from when they click on the btn. match to server.js
    $.ajax({
        url:"http://localhost:5002/logout",
        type: "POST",
        success: () => {
            // both parties of window.location.href is needed
            window.location.href="http://localhost:5002/index.html"
        }
    })
}



function setup() {

    initSearch();
    // trigger based on type switch.
    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        display($("#poke_type option:selected").val());
        // trigger based on event of search or type switcher.
        insertTypeEventToTheTimeLine(poke_type);
    })
    $("main").on('click', '.shop-item-button', addToCartClicked)

    $("nav").on('click', '.logoutBtn', logoutClicked)
    // var addToCartButtons = document.getElementsByClassName('.shop-item-button')
    // for (var i = 0; i < addToCartButtons.length; i++) {
    //     var button = addToCartButtons[i]
    //     button.addEventListener('click', addToCartClicked)
}
$(document).ready(setup)