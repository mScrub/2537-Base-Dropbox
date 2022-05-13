

// store our pokemon_type_ as a global variable.

pokemon_type_global = " "

function process_search_Pokemon_response(obtained_api_data){
    // the api is an array, so we need a for loop to iterate through the entire object of types.
    for(i = 0; i < obtained_api_data.types.length; i++)
    // Then a condition check of pokemon type from the API call. If it's equal to that name of that type, like bug. Then we will append id's
        if(obtained_api_data.types[i].type.name == pokemon_type_global)
            $("main").append("<p>" + obtained_api_data.id + "</p>") 
}

function display(pokemon_type_){
    // Content resetter. .empty(0)
    $("main").empty();
    // Inject contents into main sector - Thus we instead iterate over the entire 1.1k pokemon count to check if they're true
    pokemon_type_global = pokemon_type_
    for(index_count = 1; index_count < 100; index_count ++){
      $.ajax({
        type: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${index_count}`,
        success: process_search_Pokemon_response
      })  
    }
}

function setup(){

    // Event handler to catch the selected type. 
    // Display all the grass types.
    $("#poke_type").change(()=> {
        poke_type = $("#poke_type option:selected").val();
        // At the same time as we change, we want to display when the menu changes. 
        display($("#poke_type option:selected").val());
        // alert(poke_type)
        // console.log(poke_type)
    })
    // Display function 
}



$(document).ready(setup)