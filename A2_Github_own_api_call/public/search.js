
pokemon_type_global = " "
// to add just to show all ookemon
add_them_divs = ''
// For global variable pokemon name storage for comparison
var store_pokemon_name = "";
// Search Indexing 
var searchIndex = [];

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



// On either API calls, we will start to build out an image container
function process_search_Pokemon_response(obtained_api_data){
        // the api is an array, so we need a for loop to iterate through the entire object of types.
        typeForColor = obtained_api_data.types[0].type.name 
        // console.log(typeForColor)
        // // JSON iterator for loop
        for(var x in colors){
            if (typeForColor == x){
                // contain the var.
                bgColorChange = colors[x]
            }
        }

        $("main").append(`
        <div class="image_container"; style="background-color:${bgColorChange}";>
        <h3> ${obtained_api_data.name} </h3> 
        <a href="/profile/${obtained_api_data.id}">  
        <img src="${obtained_api_data.sprites.other["official-artwork"].front_default}">
        </a>
        </div>`)
    // }


}


function processPokeType(obtainedApiToSetType){
    // console.log(obtainedApiToSetType)
    // console.log(obtainedApiToSetType.types[0].type["name"])
    // console.log(obtainedApiToSetType.types[0].type.name)
    if (pokemon_type_global === obtainedApiToSetType.types[0].type.name){
        // console.log("Hello World")
        process_search_Pokemon_response(obtainedApiToSetType)
        // console.log(process_search_Pokemon_response(obtainedApiToSetType))
    }

}

// Initial call of display when option is switched to different types.
// 1st API call is utilized, but by index count.
async function display(pokemon_type_){
        // Content resetter .empty()
        $("main").empty();
        // Implemented the for loop around ajax with async/await to display them in 3x3
        // Inject contents into main sector - Thus we instead iterate over the entire 1.1k pokemon count to check if they're true
        //  3 by (x)
        pokemon_type_global = pokemon_type_
        for(index_count = 1; index_count < searchIndex.length; index_count ++){
            if (index_count % 3 == 1) {
                add_them_divs += `<div class="images_group">`
            }
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${index_count}`,
            success: processPokeType
        })  
        // TS link
        // console.log(`https://pokeapi.co/api/v2/pokemon/${index_count}`)
        }
        if (index_count % 3 == 0) {
            add_them_divs += `</div>`;
        }
        
}
// submitSearch, from search.html
// 2nd API call for when there are queries typed inside and user clicks submit
async function submitSearch(){
    // base case if these don't exist
    if(!$("#searchPokemonName") || !$("#searchPokemonName").val()) {
        return;
    }
    // Obtain value after the person punches in the name
    var store_pokemon_name = $("#searchPokemonName").val();
    // reset our main container of contents after each submission of search.
    $("main").empty();
    // Global Array
    for(let i = 0; i < searchIndex.length; i++){
        // Two data variable parsers, to get a specific part of the URL's index
        let index = searchIndex[i].url.lastIndexOf("mon") + 3;
        let pokeIndex = searchIndex[i].url.substring(index).replace("/", "");
        // Call / replacer again, as to specifically move out fwd. slash
        pokeIndex = pokeIndex.replace("/", "");
        // No double AJAX callers, propogating two images if that was the case.
        if(searchIndex[i].name.includes(store_pokemon_name.toLowerCase()) || pokeIndex == store_pokemon_name){
            await $.ajax({
                type: "GET",
                // Full URL
                url: searchIndex[i].url,
                success: process_search_Pokemon_response
            })  
        }
    }
    console.log(searchIndex[i].url)
}

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

function setup(){
    // 2 options
    // Event handler to catch the selected type. 
    // A Display all the available types. When anything is changed, it'll give it a new value
    $("#poke_type").change(()=> {
        poke_type = $("#poke_type option:selected").val();
        // At the same time as we change, we want to display when the menu changes. 
        // Calls display
        display($("#poke_type option:selected").val());
    })
    // Search function via AJAX query
    initSearch();
}
$(document).ready(setup)