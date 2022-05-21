// Server starter.
const express = require('express')
const app = express()


// ejs for dynamic page load of JSON obj
app.set('view engine', 'ejs');
const https = require('https');

// local site
app.listen(process.env.PORT || 5002, function (err) {
    if (err)
        console.log(err);
})

// search function
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/");

})

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
// app.use(express.static('./public'));
app.use('/public', express.static('public'));

