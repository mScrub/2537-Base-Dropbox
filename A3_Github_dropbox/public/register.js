async function CreateNewUser() {
    // grab 3 values.
    SubmittedUsername = $('.username').val()
    SubmittedEmail = $('.email').val()
    SubmittedPassword = $('.password').val()
    await $.ajax({
        url: "http://localhost:5002/register/create",
        type: "PUT",
        // At same time, we can use data and punch in all the grabbed values.
        data: {
            user: SubmittedUsername,
            email: SubmittedEmail,
            password: SubmittedPassword
        },
        // callback
        success: (object) => {
            console.log(object)
        }
    })
}

// Once user visits registration page, they hit submit, it'll trigger this function.
// This funciton will store in the variables we have onto oru database with set schema.

function setup() {
    $('body').on('click', '.RegisterNewUser', CreateNewUser);
}

$(document).ready(setup)