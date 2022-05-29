async function CreateNewUser() {
    // grab 3 values.
    SubmittedUsername = $('.username').val()
    SubmittedEmail = $('.email').val()
    SubmittedPassword = $('.password').val()
    // with this route, we can't get data from the server.
    await $.ajax({
        url: "http://localhost:5002/register/create",
        type: "PUT",
        // At same time, we can use data and punch in all the grabbed values.
        data: {
            userName: SubmittedUsername,
            email: SubmittedEmail,
            password: SubmittedPassword
        },
        // callback
        success: () => {
            $("main").append(
                `
                    <div>
                    You've successfully created an account with us! ${SubmittedUsername}
                    </div>
                    `
            )
        }
    })
}

// Once user visits registration page, they hit submit, it'll trigger this function.
// This funciton will store in the variables we have onto oru database with set schema.

function setup() {
    $('body').on('click', '.RegisterNewUser', CreateNewUser);
}

$(document).ready(setup)