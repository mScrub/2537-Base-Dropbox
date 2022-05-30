

let UserEmail = '';
let UserPassword = '';

// Only way to get past [object, Object] is to use filter first and have it return values from req.
function validateRegUser(regUserObject) {
    console.log(regUserObject)
    if (regUserObject == "No such user in the DB") {
        alert("No such user exists in our database!")
    } else if (regUserObject == "Incorrect Password!") {
        alert("The password is incorrect!")
    }
    else{
        window.location.href = "http://localhost:5002/searchPage"
    }
}

// Grab the email and password to check.
async function ValidateUser() {
    UserEmail = $('.eml').val()
    UserPassword = $('.pwd').val()
    await $.ajax({
        url: 'http://localhost:5002/login/validation',
        type: 'POST',
        data: {
            email: UserEmail,
            password: UserPassword,
        },
        success: validateRegUser
    })
}

// window.location.href = "http://localhost:5002/searchPage"
// // redirects don't happen after ajax call..

// processObjectData to be called a "2nd time" once they've filtered data to redirect properly.
function processObjectData(adminObject) {
    // console.log(adminObject + "Hey this is supposed to work!")
    if (adminObject[0].administrator == true) {
        alert("Admin page hit")
        window.location.href = "http://localhost:5002/adminPage"
    } else if (adminObject == 'No admin in such database') {
        alert("You're not an admin!")
    }
}

// Check Admin
async function ValidateAdmin() {
    UserEmail = $('.eml').val()
    UserPassword = $('.pwd').val()
    await $.ajax({
        url: 'http://localhost:5002/login/validation/admin',
        type: 'POST',
        data: {
            email: UserEmail,
            password: UserPassword,
        },
        // redirect
        success: processObjectData
    })
}

function setup() {
    $('body').on('click', '.CheckLogin', ValidateUser);
    $('body').on('click', '.CheckLoginAdmin', ValidateAdmin);
}

$(document).ready(setup)