
// Grab the email and password to check.
async function ValidateUser(){
    UserEmail = $('.eml').val()
    UserPassword = $('.pwd').val()
    await $.ajax({
        url: 'http://localhost:5002/login/validation',
        type: 'POST',
        data: {
            email: UserEmail,
            password: UserPassword
        },
        // redirect
        success: (ifWeNeedObject) => {
            window.location.href = "http://localhost:5002/search.html"
        }
    })
}


function setup() {
    $('body').on('click', '.CheckLogin', ValidateUser);
}

$(document).ready(setup)