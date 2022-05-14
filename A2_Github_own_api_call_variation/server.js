// Server starter.
const express = require('express')
const app = express()
const https = require('https');
const bodyparser = require("body-parser");



// ejs for dynamic page load of JSON obj
app.set('view engine', 'ejs');

// Listener for Heroku + Local site
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

// body parser for when user hits a button, POST request will be sent to our server, and it'll be caught by app.post('/'), thus we need to catch this request and PARSE it.
// It'll also allow us to use req.body to get names of city name or pokemon name?
app.use(bodyparser.urlencoded({
    extended: true
}));

// CRUD operations May 11
// Importing module, connecting to our local test collections.
// Module to enable us to access mongodb from the server code. (connects us to the db)
const mongoose = require('mongoose');

// may not need topology. Our own Server to send it over.  
// useNewUrlParser: true, useUnifiedTopology: true timelineDB

//  connect(mongodb://localhost:27017/timelineDB)
// remote connector
mongoose.connect("mongodb+srv://tickleMeNot:zAEpyfci29Dta1QM@cluster0.tpmee.mongodb.net/FelixsSecondPokemonDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// Schema is set.
const pokemonSchema = new mongoose.Schema({
    id: Number,
    name: String
});
// Collection ready. JSON object is mySecondDataBase, then collection = timelineevents, documents within.
const eventModel = mongoose.model("pokemons", pokemonSchema);

// http://localhost:5000
// We need our own CRUD ops to be able to manipulate data.

// app.use is also needed for us to be able to get timeline.html to function.
app.use(express.static('./public'));


// Home route /, calls onto public/index.html 
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
})


// CRUD OPS.
// Allowing for specifically ID search params.
app.get('/getPokemon', function (req, res) {
    // console.log("received a request for "+ req.params.city_name);
    // Same mongoDB method, we can change it. we can do .updateMany/updateOne or create
    // 1st {} one is mandatory, find criteria, 2nd {} one is optional (projection), 3rd arg {} (function callback =>)
    // originally in 1st JSON object. name: req.params.city_name
    // id = req.params.id
    eventModel.find({
        // id: id
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        // data send
        console.log("Hello World")
        res.send(data);
    })
})







////---------------------------------- PROFILING at bottom

// specific ID search under profile route. through Query Params
app.get('/profile/:id', function (req, res) {

    // our API key.
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    // copy paste this code of data/end parts.
    combined_object_data = " "
    // HTTPS request, initiated from server
    // HTTPS request is async function.
    // From server.js to API server  - HTTPS is inside node.js as a module.
    // code.js server to API is fine when one wants to use AJAX req.
    https.get(url, function (https_res) {
        // Receive data from PokeAPI
        https_res.on("data", function (JSON_pieces) {
            combined_object_data += JSON_pieces
        })
        // At end of object, then we will do another callback.
        // This callback will trigger and Parse Raw data to JSON.
        https_res.on("end", function () {
            combined_object_data = JSON.parse(combined_object_data)
            // console.log(combined_object_data)

            // Using Selection/Projection, we can obtain new list of data
            // Deeper JSON data access. filtered_and_map_stat is repeatable. for diff stats.
            filtered_and_mapped_stat = combined_object_data.stats.filter((first_obj_) => {
                // condition check from filter if we have 'hp' met.
                return first_obj_.stat.name == "hp"
                // Mapper - Only wanted object if the above is True
                // Applied to an array, so it returns an array.
                // We can chain map to filter.
            }).map(
                (second_object_mapped) => {
                    return second_object_mapped.base_stat
                }
            )
            // So when we have finished the parser.
            // We can now render, and use this data attach it to a new key for profile
            // Sits inside "end" region.
            res.render("profile.ejs", {
                // req.params.id
                // This bottom piece is required for ejs to function
                "id": req.params.id,
                "name": combined_object_data.name,
                // Specific hp acccess, not the sq. brackets.
                "hp": filtered_and_mapped_stat[0],
                // Access JSON Object weight.
                "weight": combined_object_data.weight
            });
        })
    });
})
// Using a different route code followed with two diff public. we get styling applied to EJS
app.use(express.static('./public'));
// app.use('/public', express.static('public'));

