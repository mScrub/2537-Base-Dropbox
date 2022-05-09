// Localhost//public
to_add = ''

function processPokeResp(obtained_ajax_data){
     to_add += ` <h3> ${obtained_ajax_data.name} </h3>
      <div class="image_container">
      <a href="/profile/${obtained_ajax_data.id}">  
      <img src="${obtained_ajax_data.sprites.other["official-artwork"].front_default}">
      </a>
      </div>`
}

// Main is set to be a grid. 
async function loadNinePokemonImages() {
    for (i = 1; i <= 9; i++) { // 9 iterations, but only for values not evenly divisible by 3.
        if (i % 3 == 1) { // only when i= 1, 4, 7, 2, 5, and 8 --> Speaks back to index.html
            // open div for 6. 
            to_add += `<div class="images_group">`
        }
        
        // 1 - Generate random numbers, but only numbers that are rounded down. even 
        // There are about 1100 pokemon
        random_pokemon_id =  Math.floor(Math.random() * 300) + 1

        // 2- init a AJAX request to pokeapi.co to be able to obtain these images. 
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${random_pokemon_id}/`,
            success: processPokeResp
        })

        // Making a complete 3x3 image, rather than a stack
        // 3 image groups aligned in equal indentation, otherwise 
        if (i % 3 == 0) { 
            to_add += `</div>`
        }
    }
    // Select the to_add string param, add this to main in index.html
    jQuery("main").html(to_add)
}

function setup() {
    loadNinePokemonImages();
}

jQuery(document).ready(setup)