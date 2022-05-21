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
    res.sendFile(__dirname + "/public/index.html");

})

app.get('/profile/:id', function (req, res) {

    // our API key.
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    combined_object_data = " "
    https.get(url, function (https_res) {
        https_res.on("data", function (JSON_pieces) {
            combined_object_data += JSON_pieces
        })
        https_res.on("end", function () {
            combined_object_data = JSON.parse(combined_object_data)
            filtered_and_mapped_stat = combined_object_data.stats.filter((first_obj_) => {
                return first_obj_.stat.name == "hp"
            }).map(
                (second_object_mapped) => {
                    return second_object_mapped.base_stat
                }
            )
            res.render("profile.ejs", {
                "id": req.params.id,
                "name": combined_object_data.name,
                "hp": filtered_and_mapped_stat[0],
                // Access JSON Object weight.
                "weight": combined_object_data.weight
            });
        })
    });
})
app.use(express.static('./public'));
// app.use('/public', express.static('public'));

