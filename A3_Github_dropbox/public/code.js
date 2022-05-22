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


async function loadNinePokemonImages() {
    for (i = 1; i <= 9; i++) { 
        if (i % 3 == 1) { 
            to_add += `<div class="images_group">`
        }
        random_pokemon_id =  Math.floor(Math.random() * 300) + 1
        await $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${random_pokemon_id}/`,
            success: processPokeResp
        })
        if (i % 3 == 0) {
            to_add += `</div>`
        }
    }
    jQuery("main").html(to_add)
}

function setup() {
    loadNinePokemonImages();
}

jQuery(document).ready(setup)