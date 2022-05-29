usersID = '';

let choiceOfAdmin = '';



function logoutClicked() {
    // User hits the logout route from when they click on the btn. match to server.js
    $.ajax({
        url: "http://localhost:5002/logout",
        type: "POST",
        success: () => {
            // both parties of window.location.href is needed
            window.location.href = "http://localhost:5002/index.html"
        }
    })
}

// To allow for admin or not during creation point
function radioSelectedfunction() {
    choiceOfAdministration = $("[name='adminChoice']:checked").val();
    if (choiceOfAdministration == 'yes') {
        // if user selects yes, then set admin choice to be true
        choiceOfAdmin = true;
    } else {
        // else false.
        choiceOfAdmin = false;
    }
}



// Same route as registration
async function FormNewUser() {
    SubmittedUsername = $('.username').val()
    SubmittedEmail = $('.email').val()
    SubmittedPassword = $('.password').val()
    console.log("Hello World")
    console.log(choiceOfAdmin)
    await $.ajax({
        url: "http://localhost:5002/register/create",
        type: "PUT",
        data: {
            userName: SubmittedUsername,
            email: SubmittedEmail,
            password: SubmittedPassword,
            administrator: choiceOfAdmin
        },
        // callback
        success: () => {
            $(".messageToAdmin").append(
                `
                    <div>
                    You've created a new account for a ${SubmittedUsername}
                    </div>
                    `
            )
            searchInitUser();
        }
    })
}



// Delete the User
function DeleteUser() {
    // selecting the property of this id attribute
    adminStatus = $(this).attr(`id`)
    if (adminStatus == 'false') {
        $.ajax({
            url: `http://localhost:5002/deleteAcct/${adminStatus}`,
            type: 'GET',
            success: () => {
                searchInitUser();
            }
        })
    } else {
        alert("This is not possible, you can't delete yourself!")
    }

}


// Obtain users from DB and display
async function searchInitUser() {
    $('#loadInUsers').empty();
    console.log("Triggering search")
    await $.ajax({
        url: 'http://localhost:5002/obtainAllAccounts',
        type: 'GET',
        success: (usersInDB) => {
            for (i = 0; i < usersInDB.length; i++) {
                $("#loadInUsers").append(
                    `
                    <div class="nameOfUser admin-column">
                    <a> <h4> Name of User <input type="text" id="${usersInDB[i].userName}" value="${usersInDB[i].userName}"> </h4></a>
                    </div>
                    <div class="emailOfUser admin-column">
                    <a id="${usersInDB[i].email}">${usersInDB[i].email}</a>
                    </div>
                    <div id="idOfAdmin${usersInDB[i].administrator}" class="adminStatus admin-column">
                    <a> ${usersInDB[i].administrator} </a>
                    <a><button class="DeleteButton" id=${usersInDB[i].administrator}>Remove</button> </a>
                    </div>
                    `
                )
            }
        }
    })
}



function setup() {
    searchInitUser();
    $('body').on('click', '.DeleteButton', DeleteUser);
    $('body').on('click', '.CreateButton', FormNewUser);


    //  Create a user based on click.
    $('.input-group').on('click', radioSelectedfunction)
    // logout
    $("section").on('click', '.logoutBtn', logoutClicked)
}

$(document).ready(setup)