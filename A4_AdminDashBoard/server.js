const express = require('express')
var session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(session);
const https = require('https');
const bodyparser = require("body-parser");
const app = express()

var cors = require('cors')
app.use(cors())
// ejs for dynamic page load of JSON obj
app.set('view engine', 'ejs');

// Diff video for Mongoose connector set into a constant.
const connectorForLoginAndPokemon = "mongodb+srv://tickleMeNot:zAEpyfci29Dta1QM@cluster0.tpmee.mongodb.net/A3LoginPokemonDB?retryWrites=true&w=majority"

// Listener for Heroku + Local site
const PORT = process.env.PORT || 5002 || 80;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


// Access to req.body when parsing.
app.use(bodyparser.urlencoded({
    extended: true
}));

// To serve static pages 
app.use(express.static('public'))


// Importing module, connecting to our local test collections.
// Module to enable us to access mongodb from the server code. (connects us to the db)
const mongoose = require('mongoose');
const {
    Int32
} = require('mongodb');


//  connect(mongodb://localhost:27017/timelineDB)
// remote connector / promise is sent to us using .then() to catch.
mongoose.connect(connectorForLoginAndPokemon, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    console.log("MongoDB is connected!")
});

// below mongoose.for session storage
const store = new MongoDBSession({
    uri: connectorForLoginAndPokemon,
    // hook to db when we access our DB, then to this collection is where we store our sessions
    collection: "sessions"
})

// Store must sit under connector. and declaration of variable
// Session handler? for holding users session data  A
// changed resave to false, don't need resave cookie constantly yet?
app.use(session({
    secret: 'sssshhhhh cookie sign',
    saveUninitialized: true,
    resave: true,
    // hold session stoarge
    store: store
}));
// Pokemon Cart Schema
const pokemonCartSchema = new mongoose.Schema({
    hits: Number,
    time: String,
    name: String,
    price: Number,
    qty: Number,
    total: Number,
});
// User database Schema
const userSchema = new mongoose.Schema([{
    userName: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    time: String,
    administrator: Boolean,
}]);

const UserModel = mongoose.model("users", userSchema);
const cartModel = mongoose.model("pokecarts", pokemonCartSchema);


// Middleware Guard

function isUserAuthenticated(req, res, next) {
    // Admin is also authenticated (isAuthenticated as regular user)
    console.log("User authentication triggered.")
    if (req.session.isAuthenticated) {
        console.log("User is authenticated!")
        next();
    } else {
        console.log("User is not authenticated!")
        res.redirect('login.html')
    }
}


// separate middleware for Administrator
function isUserAdmin(req, res, next) {
    console.log(req.session.isAdminAuthenticated)
    if (req.session.isAdminAuthenticated) {
        console.log("Admin is authenticated!")
        next();
    } else {
        console.log('Admin is not authenticated')
        res.redirect('login.html')
    }
}

// Routes to be considered
// ---------------
// MIDDLEWARE
// ---------------

app.get('/searchPage', isUserAuthenticated, function (req, res) {
    console.log("/Search Page got accessed!")
    res.redirect('search.html')
})

app.get('/adminPage', isUserAdmin, function (req, res) {
    console.log("/Admin Page got accessed!")
    res.redirect('adminPage.html')
})


// ---------------------------- NEW CREATION ROUTES FOR LOGIN/SESSIONS
// Ensure PUT matches to type PUT in register.js
app.put('/register/create', function (req, res) {
    UserModel.create({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        // req.body.administrator
        administrator: req.body.administrator
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
            res.status(500).send();
        } else {
            console.log("New user is online " + data);
            res.status(200).send(data);
        }
    })
})


// AUTHENTICATE REGULAR USER
app.post('/login/validation', function (req, res, next) {
    // send entire projection 1 (4 JSON users)
    UserModel.find({}, function (err, userData) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log("Data -> Hello" + userData)
        }
        // userData is what we've found.. in projection after selection {}
        // userData[0] is needed because we're inside an array. 
        // check DB PW and Body PW entered in login.html
        if (userData[0].password == req.body.password) {
            // Status for admin check
            req.session.isAdminAuthenticated = true
            req.session.isAuthenticated = true
            // id from the object the users collection in DB, which is now stored in session
            req.session.userid = userData[0]._id;
            req.session.email = req.body.email;
            req.session.isAdministrator = userData[0].administrator;
            req.session.save()
            console.log("Hitting search page")
            res.status(200).redirect('/searchPage')
        }
    })
})


// AUTHENTICATE ADMIN
app.post('/login/validation/admin', function (req, res, next) {
    UserModel.find({
        administrator: true,
        email: req.body.email
    }, function (err, adminData) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log("Data -> Admin" + adminData[0])
            // res.status(200).send(adminData)
        }
        req.session.isAdminAuthenticated = true
        req.session.isAuthenticated = true
        req.session.email = req.body.email;
        req.session.save()
        req.session.adminDataObj = {
            administrator: req.body.administrator
        }
        // Utilized filter function to iterate each variable in the array.
        let filteredData = adminData.filter((administrator) =>{
            return administrator
        })
        // console.log(filteredData) // be wary of redirect/sends..
        if (filteredData == undefined || filteredData == null || filteredData == '' || filteredData == []){
            res.send('No admin in such database')
        }
        // Filter is a for loop already, check for admin stats
        else if (filteredData[0].administrator == true) {
            // if (req.body.email === adminData[0].email)
            res.send(filteredData)
        }
    })
})

// LOGOUT Ability
app.post("/logout", (req, res) => {
    console.log("Logout triggered!")
    // session destruction and redirect needs to be linked with index
    req.session.destroy(() => {
        res.status(200).redirect('/index.html')
    });
});




// Home page, trigger auth function.
// Then if authentication is false, redirect to login screen.
app.get('/home', function (req, res) {

    console.log("/Home route got triggered.")
    // res.status(200).sendFile(path.resolve(__dirname, "public", "index.html"));
    if (req.session.isAuthenticated) {
        // if user is authenticated, then redirect to search.html
        res.redirect('/search.html')
        // res.send(`'Hi there ${req.session.user}`)
    } else {
        // redirect to only login.html page
        res.redirect('/login.html')
    }
})

app.get('/', function (req, res) {
    console.log("test route")
    if (req.session.isAuthenticated) {
        // if user is authenticated, then redirect to search.html
        res.status(200).redirect('/search.html')
        // res.send(`'Hi there ${req.session.user}`)
    } else {
        // redirect to only login.html page
        res.status(200).redirect('/index.html')
    }

})


// routes we make and visit can cause a redirect.
app.get('/searchPage', function (req, res, next) {

    console.log("the callback function of /searchPage is triggered")
    if (req.session.isAuthenticated) {
        // if user is authenticated, then redirect to search.html
        res.redirect('/search.html')
        // res.send(`'Hi there ${req.session.user}`)
    } else {
        // redirect to only login.html page
        res.redirect('/login.html')
    }
})



// ROUTES FOR OBTAINING USERS for ADMIN DASHBOARD~
app.get('/obtainAllAccounts', function (req, res) {
    // strictly find those who are of false admins
    UserModel.find({}, function (err, users) {
        if (err) {
            console.log('Err' + err)
            res.status(500);
        } else {
            console.log('Data' + users)
            res.status(200).send(users)
        }
    })
})


// First Function to Delete user in DB
app.get('/deleteAcct/:administrator', function (req, res) {
    // adminVariable = req.params.adminparams
    UserModel.deleteOne({
        administrator: req.params.administrator
    }, {}, function (err, data) {
        if (err) {
            console.log("Error " + err);
            res.status(500);
        } else {
            console.log(`ID has ${req.body.administrator} been updated. ` + data);
            res.status(200).send("Delete is done!");
        }
    });
})






// CRUD ROUTES FOR SHOP CART--------------------------------------------------- Beginning of A3, timeline SSR (server-side render)

// find the data
app.get('/onlineShopping/getShoppingCartData', function (req, res) {
    cartModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
            res.status(500);
        } else {
            console.log("Data " + data);
            res.status(200).send(data);
        }
    })
})


// insert route. to add these items.
// CREATE
// In the text field, of the body, we want text
// total stores the amount. Price stays same
app.put('/onlineShopping/insertCardToPurchase', function (req, res) {
    console.log(req.body);
    cartModel.create({
        name: req.body.name,
        price: req.body.price,
        qty: req.body.qty,
        total: req.body.total,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
            res.status(500);
        } else {
            console.log("Data inserted" + data);
            res.status(200).send("Insertion is done!");
        }
    })
})



// UPDATE
app.get('/onlineShopping/increaseCardQty/:id/:qty', function (req, res) {
    console.log(req.params.id)
    incrementQtyAsBatch = undefined;
    incrementQtyAsBatch = req.params.qty
    console.log('value of the parameters' + req.params.qty)
    cartModel.updateOne({
        _id: req.params.id
    }, {
        $set: {
            qty: incrementQtyAsBatch
        }
    }, function (err, data) {
        if (err) {
            res.status(500);
            console.log("Error " + err);
        } else {
            console.log(`ID has ${req.params.id} been incremented. ` + data);
            res.status(200).send(data);
        }
    })
})


// Decrease Card Qty.
app.get('/onlineShopping/decreaseCardQty/:id/:qty', function (req, res) {
    console.log(req.params.id)
    decrementQtyAsBatch = req.params.qty
    cartModel.updateOne({
        _id: req.params.id
    }, {
        $set: {
            qty: decrementQtyAsBatch
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
            res.status(500)
        } else {
            console.log(`ID has ${req.params.id} been decremented. ` + data);
            res.status(200).send(data);
        }
    });
})


// increase/decrease card shop total
app.get('/onlineShopping/increaseCardTotal/:id/:total', function (req, res) {
    cardTotal = req.params.total
    cartModel.updateOne({
        _id: req.params.id
    }, {
        $set: {
            total: cardTotal
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
            res.status(500);
        } else {
            console.log(`ID has ${req.params.id} been given new total. ` + data);
            res.status(200);
        }
    })
})

// Delete via specific object_id in DB
app.get('/onlineShopping/deleteCard/:id', function (req, res) {
    cartModel.deleteOne({
        _id: req.params.id
    }, {}, function (err, data) {
        if (err) {
            console.log("Error " + err);
            res.status(500);
        } else {
            console.log(`ID has ${req.params.id} been updated. ` + data);
            res.status(200).send("Delete is done!");
        }
    });
})


// A1 --------------------------------------------------------------- search.html and profile page of pokemon replaced w/ session.

// profile route linked to a dedicated page.
app.get('/profile/:id', function (req, res) {

    // get Data from API based on id selector
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    // Scroll through data, then utilize filter/map to display them.
    // Useful for dynamic changes.
    console.log(url)
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
// app.use('/public', express.static('public'));