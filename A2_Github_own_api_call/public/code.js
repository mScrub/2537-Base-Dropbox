

var holdDataSet = [];

function processPokemonData(){



   for (let x in holdDataSet[0]){
    $('main').append(
        `<h4> ${x + ":" + holdDataSet[0][x]} </h4>`
    )
   }
}


async function obtainPokemonData(){
    await $.ajax({
        type: "GET",
        url: `https://infinite-scrubland-78728.herokuapp.com/api/pokemon/1`,
        // success: processPokemonData
        success: function (dataSetResult) {
            holdDataSet = dataSetResult;
            console.log(dataSetResult)
        }
    })
}


// When we visit localhost:5000/public/index.html, we send() to the client
// Once triggered, it'll load Pokemon Data into the array.
function setup() {
    obtainPokemonData();
    $("main").on('click', '.buttonToClick', processPokemonData);

}

jQuery(document).ready(setup)

