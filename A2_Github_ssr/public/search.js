
var now = new Date(Date.now());
var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

pokemon_type_global = " "
add_them_divs = ''
var store_pokemon_name = "";
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


function process_search_Pokemon_response(obtained_api_data){

    typeForColor = obtained_api_data.types[0].type.name 
    for(var x in colors){
        if (typeForColor == x){
            bgColorChange = colors[x]
        }
    }
            $("main").append(`
            <div class="image_container" style="background-color:${bgColorChange}">
            <h3> ${obtained_api_data.name} </h3> 
            <a href="/profile/${obtained_api_data.id}">  
            <img src="${obtained_api_data.sprites.other["official-artwork"].front_default}">
            </a>
            </div>`)
}

// A1 
function processPokeType(obtainedApiToSetType){
    console.log(obtainedApiToSetType.types[0].type.name)
    if (pokemon_type_global === obtainedApiToSetType.types[0].type.name){
        process_search_Pokemon_response(obtainedApiToSetType)
    }

}

async function display(pokemon_type_){
        $("main").empty();
        pokemon_type_global = pokemon_type_
        for(index_count = 1; index_count < 1123; index_count ++){
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

async function submitSearch(){

    if(!$("#searchPokemonName") || !$("#searchPokemonName").val()) {
        return;
    }
    var store_pokemon_name = $("#searchPokemonName").val();
    insertSearchEventToTimeLine(store_pokemon_name);
    $("main").empty();
    for(let i = 0; i < searchIndex.length; i++){
        let index = searchIndex[i].url.lastIndexOf("mon") + 3;
        let pokeIndex = searchIndex[i].url.substring(index).replace("/", "");
        pokeIndex = pokeIndex.replace("/", "");
        if(searchIndex[i].name.includes(store_pokemon_name.toLowerCase()) || pokeIndex == store_pokemon_name){
            await $.ajax({
                type: "GET",
                url: searchIndex[i].url,
                success: process_search_Pokemon_response
            })  
        }
    }
}



// A1 
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


// A2
function insertSearchEventToTimeLine(store_pokemon_name){
    $.ajax({
        url:"https://young-everglades-99074.herokuapp.com/timeline/insert",
        type: "PUT",
        data: {
            text: `Client has searched for a pokemon that's Name or ID is: ${store_pokemon_name} `,
            time: `at time ${now}`,
            hits: 1
        },
        success: function(){
        }
    })
}


function insertTypeEventToTheTimeLine(poke_type){
    $.ajax({
        url:"https://young-everglades-99074.herokuapp.com/timeline/insert",
        type: "PUT",
        data: {
            text: `Client has searched for type ${poke_type}`,
            time: `at time ${now}`,
            hits: 1
        },
        success: function(){
        }
    })
}


function setup(){

    $("#poke_type").change(()=> {
        poke_type = $("#poke_type option:selected").val();
        display($("#poke_type option:selected").val());
        insertTypeEventToTheTimeLine(poke_type);
    })
    initSearch();
}
$(document).ready(setup)