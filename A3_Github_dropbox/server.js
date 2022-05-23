// Server starter.
const express = require('express')
// import of session library. A
var session = require('express-session')
// For saving our session into DB. MongoDBSession
const MongoDBSession = require('connect-mongodb-session')(session);
const https = require('https');
const bodyparser = require("body-parser");
const app = express()

// for our registration model, loaded in EJS. form of POST method,
// Post will give us the username/email/password
// const UserModel = require('./models/user')

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

// body parser for when user hits a button, POST request will be sent to our server, and it'll be caught by app.post('/'), thus we need to catch this request and PARSE it.
// It'll also allow us to use req.body to get names of city name or pokemon name?
// Access to req.body when parsing.
app.use(bodyparser.urlencoded({
    extended: true
}));


// n need to type 
// app.use(express.static('./public'));
// This is super critical if we're not using EJS.
// To serve static pages 
app.use(express.static('public'))


// Importing module, connecting to our local test collections.
// Module to enable us to access mongodb from the server code. (connects us to the db)
const mongoose = require('mongoose');
const {
    Int32
} = require('mongodb');

// may not need topology. Our own Server to send it over.  
// useNewUrlParser: true, useUnifiedTopology: true timelineDB

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
    secret: 'sssshhhhh cook sign',
    saveUninitialized: true,
    resave: true,
    // hold session stoarge
    store: store
}));




// Schema can be imported from models folder... but we made a separte for users
// Schema is set so we can use these in our url?
// These below affect the way our database looks, price for instance. 
// price cannot be paired with Number and String. 
// It also allows us to set custom CRUD ops, or form actions
const pokemonCartSchema = new mongoose.Schema({
    hits: Number,
    time: String,
    name: String,
    price: Number,
    qty: Number,
    total: Number,
});
// Collection ready. JSON object is mySecondDataBase, then collection = timelineevents, documents within.
const cartModel = mongoose.model("pokecarts", pokemonCartSchema);

// User data
const userSchema = new mongoose.Schema([{
    user: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}]);

const UserModel = mongoose.model("users", userSchema)


// app.use is also needed for us to be able to get timeline.html to function. this actually changes home route


// User JSON object, replaceable later w/ DB. for user. A 
// users = {
//     "user1": "pass1",
//     "user2": "pass2",
// }


// Middlware llogger
function logger1(authenticated, user, next) {
    // message 1 of middleware.
    console.log("This global function will always get executed (logger1)");
    // Acts as a signal to end our middleware
    next();
}


// local middleware in routes or global middelwares.
// the below is local, don't need to login to access login page
// login page should be unprotected.

// to authenticate certain page  (our logger 2 sorta?) moving authentication to this point.
// x, y are renamed 
//  --------------

// the function passed is now a global middleware. (declared) a response, cn use it to each route.
// the website hangs and waits for each route that is triggered.
// logger1 middleware is used to keep track which routes were used. Timeline of client accessing our website.
// if we define a 3rd logger or 2nd logger, depends on where you use it.
// logger 1 here is global, and is now shown in each page.
app.use(logger1)

// say we implement logger 3, we will see it in 


// Home Route A
// Sessions between the two aren't shared, so if we have 
// Auth was also added here.
// app.get('/', auth, function (req, res, next)
//


// Home page, trigger auth function.
// Then if authentication is false, redirect to login screen.
// auth
// It seems to be that you need not to use / route, because it'll serve a static html page, when we don't want them to see it. 
app.get('/home', function (req, res) {

    console.log("/Home route got triggered.")
    // res.status(200).sendFile(path.resolve(__dirname, "public", "index.html"));
    if (req.session.isAuthenticated){
        // if user is authenticated, then redirect to search.html
        res.redirect('/search.html')
        // res.send(`'Hi there ${req.session.user}`)
    }
    else{
        // redirect to only login.html page
        res.redirect('/login.html')
    }

    // console.log(req.session)

    // // prints out fine.
    // // user's session id
    // console.log(req.session.id)
    // message 2 of middleware.
    // triggering a message first will not happen unless we put next() in logger/middleware. (torch pass.)
    // home page of auth is set to True, we can revisit this again, and session variables are shared across different pages.
    // So the one if statement below will greet our user.
    // We can only do 1 .send() or res.render() or res.redirect()
    // redirect user to this page   
    // 1 file? only, no proper css?
    // res.redirect('/public/search.html')
    // res.sendFile(__dirname + "/public/search.html", "/public/search.js")

    // temp = ""
    // temp += `Hi ${req.session.user}`
    // temp += "Welcome to the home page!"
    // res.send(temp)
})

app.get('/', function (req, res){
    console.log("test route")
    if (req.session.isAuthenticated){
        // if user is authenticated, then redirect to search.html
        res.redirect('/search.html')
        // res.send(`'Hi there ${req.session.user}`)
    }
    else{
        // redirect to only login.html page
        res.redirect('/index.html')
    }

})

// Post W3 Schools is better, not showing information through URL https://www.w3schools.com/tags/ref_httpmethods.asp
// POST Method VALIDATION ROUTE, check our DB of users collection // a little more secure
// singleUser = null
app.post('/login/validation', function (req, res, next) {
    // send entire projection 1 (4 JSON users)
    UserModel.find({}, function (err, userData) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log("Data -> Hello" + userData)
        }
        // This filtration also runs 4 times
        singleUser = userData.filter((dBObjectEmail) => {
            // Only got the DB Object Email of USERS, and the body email from the sign in PAGE
            if (dBObjectEmail.email == req.body.email && dBObjectEmail.password == req.body.password) {
                // Session is a different collection
                req.session.email = req.body.email
                req.session.isAuthenticated = true
                req.session.password = req.body.password
                console.log("Successful Login!")
                res.redirect('/searchPage')
                console.log("Getting skipped")
            } else {
                req.session.isAuthenticated = false
                // res.redirect('http://localhost:5002/login.html')
                // console.log("Unsuccessful Login!")
                // res.redirect("/public/login.html")
            }
        })
    })
})

// routes we make and visit can cause a redirect.
// auth pulled out
app.get('/searchPage', function (req, res, next) {

    console.log("the callback function of /searchPage is triggered")
    if (req.session.isAuthenticated){
        // if user is authenticated, then redirect to search.html
        res.redirect('/search.html')
        // res.send(`'Hi there ${req.session.user}`)
    }
    else{
        // redirect to only login.html page
        res.redirect('/login.html')
    }
    // we've set a logger 3 local middleware to track this route. calls after 1
    // redirect user to html to choose register or login.
    // It works.. so route to html.
    // res.redirect('/search.html')
    // res.redirect('login')
    // res.send("Please provide the credentials through the URL.")
})




// res.sendFile(__dirname + "/public/search.html");

// function auth(req, res, next) {
//     // if false, then redirect
//     if (req.session.isAuthenticated) {
//         // initialize .auth and .user variables. user is user1 or user2
//         console.log("Auth triggered given logged in")
//         next()
//     } else {
//         // Landing page Redirect
//         req.session.isAuthenticated = false
//         res.redirect('/indexPage') // we get the credential page.
//         // message 3 of middleware because of redirect
//         // This helps us split up another session from the previous user.
//         // redirect the user to a new login page.
//         // render() to login.ejs IF NOT LOGGED IN =3!
//         // login page redirect
//         // app.get("/login", (req, res) => {
//         //     res.render('login')
//         // })
//     }
// }


// search blocker
function searchBlock(req, res, next) {
    if (req.session.isAuthenticated) {
        // initialize .auth and .user variables. user is user1 or user2
        console.log("Search Block triggered given logged in")
        next()
    }
    else{
        console.log("Search Page trigger")
        res.redirect('/')
    }
}





// Render the page first, then utilize post method. 
// Get first then post, to work with the action form.
// app.get("/register", (req, res) => {
//     res.render("register");
// })

// 2nd route to get the user to enter credentials when redirected from above. A 
// req/res/next is a potential middelware due to next argument. last function can exclude next, and just use res.
// x y z e, say x y z all use req,res next.
// client hang if we don't have next set
app.get('/indexPage', logger3, function (req, res, next) {
    // for errors
    // function (err, data) {
    //     if (err) {
    //         console.log("Error " + err);
    //     } else {
    //         console.log("Data " + data);
    //     }
    //     // data send
    //     res.send("Registered New User!");

    // }
    // we've set a logger 3 local middleware to track this route. calls after 1
    console.log("the callback function of /indexPage")
    // redirect user to html to choose register or login.
    res.redirect('/index.html')
    // res.redirect('login')
    // res.send("Please provide the credentials through the URL.")
})




// Middlware llogger 3, local, only gets triggered after login/
function logger3(req, res, next) {
    // message 1 of middleware.
    console.log("This function logger3 got executed");
    // res.sendFile(__dirname + "/public/search.html")
    // Acts as a signal to end our middleware
    next();
}


// Cutted out the .get method, now we wanna check 
// authentication process, we can do redirects too
// Another page that can access session variable are the same sessions, (2+ tabs = 1 session, unless we open a fresh browser) A
// 1 user that is authenticated. html form for user/pw, but we can do it through URL params for the interim
// We can add another route because we don't have a login route yet, specifically a user/pw req. // added above.



// for logoff, just set auth to false, suppose person clicks on logout, then it'll give a new path link.


// ---------------------------- NEW CREATION ROUTES FOR LOGIN/SESSIONS
// Ensure PUT matches to type PUT in register.js
app.put('/register/create', function (req, res) {
    UserModel.create({
        user: req.body.user,
        email: req.body.email,
        password: req.body.password
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        // data send
        res.send("Registered New User!");

    })
})



// CRUD ROUTES FOR SHOP CART--------------------------------------------------- Beginning of A3, timeline SSR (server-side render)

// find the data
app.get('/onlineShopping/getShoppingCartData', function (req, res) {
    cartModel.find({}, function (err, data) {
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
        } else {
            console.log("Data inserted" + data);
        }
        res.send("Insertion is done!");
    })
})



// UPDATE
app.get('/onlineShopping/increaseCardQty/:id/:qty', function (req, res) {
    console.log(req.params.id)
    incrementQtyAsBatch = req.params.qty
    console.log('value of the parameters' + req.params.qty)
    cartModel.updateOne({
        _id: req.params.id
    }, {
        $inc: {
            qty: incrementQtyAsBatch
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(`ID has ${req.params.id} been incremented. `+ data);
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
        $inc: {
            qty: decrementQtyAsBatch
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(`ID has ${req.params.id} been decremented. `+ data);
        }
        res.send(data);
    });
})


// increasePriceValue
app.get('/onlineShopping/increaseCardTotal/:id/:total', function (req, res) {
    cardTotal = req.params.total
    cartModel.updateOne({
        _id: req.params.id
    }, {
        $inc: {
            total: cardTotal
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log(`ID has ${req.params.id} been given new total. `+ data);
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
        } else {
            console.log(`ID has ${req.params.id} been updated. ` + data);
        }
        res.send("Delete is done!");
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