

var holdDataSet = [];

function processPokemonData(){

    // string??
    // console.log(holdDataSet)
    // $('main').append(
    //     `<h4> ${holdDataSet[0].object.object} </h4>`
    // )
    // holdDataSet = JSON.stringify(holdDataSet)

//     console.log("Hello World")
//     for(let i = 0; i < holdDataSet[0].length; i++){
//         $('main').append(
//             `<h4> ${holdDataSet[i]} </h4>`
//         )
//    }

   for (let x in holdDataSet[0]){
    $('main').append(
        `<h4> ${x + ":" + holdDataSet[0][x]} </h4>`
    )
   }
}


// http://localhost:5000/api/pokemon

async function obtainPokemonData(){
    await $.ajax({
        type: "GET",
        url: `http://localhost:5000/api/pokemon/2`,
        // success: processPokemonData
        success: function (dataSetResult) {
            holdDataSet = dataSetResult;
            console.log(dataSetResult)
        }
    })
}


// When we visit localhost:5000/public/index.html, we sendFile() to the client
// Once client gets this, it triggers load 9 pokemon images.
function setup() {
    obtainPokemonData();
    $("main").on('click', '.buttonToClick', processPokemonData);

}

jQuery(document).ready(setup)

