// Server starter.
const express = require('express')
const app = express()
const https = require('https');
const bodyparser = require("body-parser");

var cors = require('cors')
app.use(cors())

// app.get('/products/:id', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for all origins!'})
// })

// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })



// ejs for dynamic page load of JSON obj
app.set('view engine', 'ejs');

// Listener for Heroku + Local site
const PORT = process.env.PORT || 5000 || 80;
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
const { Int32 } = require('mongodb');

// may not need topology. Our own Server to send it over.  
// useNewUrlParser: true, useUnifiedTopology: true timelineDB

//  connect(mongodb://localhost:27017/timelineDB)
// remote connector
mongoose.connect("mongodb+srv://tickleMeNot:zAEpyfci29Dta1QM@cluster0.tpmee.mongodb.net/mySecondDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// Schema is set.
const timelineSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});
// Collection ready. JSON object is mySecondDataBase, then collection = timelineevents, documents within.
const eventModel = mongoose.model("timelineevents", timelineSchema);



// app.use is also needed for us to be able to get timeline.html to function.
app.use(express.static('./public'));



// -------------------------------------------------------------------------------- Beginning of A2, timeline SSR (server-side render)

// 4 Routes to do different data configurations on our MongoDB
// Copied from MERN demo (REST API section)
// find every single item in the schema or the database (server)
app.get('/timeline/getEvents', function (req, res) {
    eventModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        // data send
        res.send(data);

    })
})


// insert route. to add these items.
// access type of pokemon or does a search.
app.put('/timeline/insert', function (req, res) {
    console.log(req.body);

    eventModel.create({
        text: req.body.text,
        time: req.body.time,
        hits: req.body.hits,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data inserted" + data);
        }
        res.send("Insertion is done!");
    })
        ;
})


app.get('/timeline/increaseHitsCount/:id', function (req, res) {
    console.log(req.params.id)
    eventModel.updateOne({
        _id: req.params.id}, {
        $inc: { hits: 1 }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Hits has been updated. " + data);
        }
        res.send("Update is done!");
    });
})


app.get('/timeline/delete/:id', function (req, res) {
    eventModel.deleteOne({
        _id: req.params.id}, {}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(`ID has ${req.params.id} been updated. ` + data);
        }
        res.send("Delete is done!");
    });
})







app.get('/search', function (req, res) {
    res.sendFile(__dirname + "/public/search.html");

})





app.get('/profile/:id', function (req, res) {

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
                "weight": combined_object_data.weight
            });
        })
    });
})
app.use('/public', express.static('public'));

