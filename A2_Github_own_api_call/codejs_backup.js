

holdDataSet = [];

function processPokemonData(){
    $('main').append(
        `<h4> ${holdDataSet['1']._id} </h4>`
    )
//     console.log("Hello World")
//     for(let i = 0; i < holdDataSet.length; i++){
//         $('main').append(
//             `<h4> ${holdDataSet[i].name} </h4>`
//         )
//    }
}


// http://localhost:5000/api/pokemon

async function obtainPokemonData(){
    await $.ajax({
        type: "GET",
        url: `http://localhost:5000/api/pokemon`,
        success: function (dataSetResult) {
            holdDataSet = dataSetResult; 
        }
        // success: function (dataSetResult) {
            // var dataSetResult = dataSetResult;
            // console.log(dataSetResult);
        })
    }


// When we visit localhost:5000/public/index.html, we sendFile() to the client
// Once client gets this, it triggers load 9 pokemon images.
function setup() {
    obtainPokemonData();
    $("main").on('click', '.buttonToClick', processPokemonData);

}

jQuery(document).ready(setup)


// Localhost//public
// to_add = ''

// function processPokeResp(obtained_ajax_data){

//     console.log(obtained_ajax_data.name)
//      to_add += ` <h3> ${obtained_ajax_data.name} </h3>
//       <div class="image_container">
//       <a href="/profile/${obtained_ajax_data.id}">  
//       <img src="${obtained_ajax_data.sprites.other["official-artwork"].front_default}">
//       </a>
//       </div>`
// }

// Main is set to be a grid. 
// async function loadNinePokemonImages() {
//     for (i = 1; i <= 9; i++) {
//         if (i % 3 == 1) {
//             to_add += `<div class="images_group">`
//         }
//         // 1 - Generate random numbers, but only numbers that are rounded down. even 
//         random_pokemon_id =  Math.floor(Math.random() * 30) + 1
//         await $.ajax({
//             type: "GET",
//             url: `https://pokeapi.co/api/v2/pokemon/${random_pokemon_id}/`,
//             success: processPokeResp
//         })
//         if (i % 3 == 0) { 
//             to_add += `</div>`
//         }
//     }
//     jQuery("main").html(to_add)
// }