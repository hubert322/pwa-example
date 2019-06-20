let usernames = [];

$("#username").keyup (event => {
    if (event.keyCode == 13)
        $("#submit").click ();
});

$("#submit").click (() => {
    const username = $("#username").val ();

    $("#username").val ("");

    $.ajax ({
        method: "GET",
        url: `https://api.github.com/users/${username}`,
    })
    .then (user => {
        console.log (user);
        if (!usernames.includes (user.login)) {
            createNewUser (user);
            usernames.push (user.login);
            localStorage.setItem ("usernames", usernames);
        }
    })
    .catch (error => console.log (error));
});

$("#notification").click (() => {
    Notification.requestPermission ()
        .then (result => {
            if (result === "granted")
                randomUserNotification ();
        });
});

function randomUserNotification () {
    if (usernames.length == 0)
        return;

    let username = usernames[Math.floor (Math.random () * usernames.length)];
    let notification = new Notification (username);
    setTimeout (randomUserNotification, 5000);
}

function createNewUser (user) {
    const html = `
        <div id=${user.login}>
            <p class="login">${user.login}</p>
            <p class="name">${user.name}</p>
            <img class="img" src=${user.avatar_url} alt="${user.login}'s image" />
        </div>
    `
    $("#users").append (html);
}

function getGitHubUsersFromCache (username) {
    if (!("caches" in window))
        return null;
    
    const url = `https://api.github.com/users/${username}`;
    console.log (url);
    return caches.match (url)
        .then (response => {
            console.log (response);
            if (response)
                return response.json ();
            return null;
        })
        .catch (error => {
            console.log ("Error getting data from cache", error);
            return null;
        });
}

function getGitHubUsersFromNetwork (username) {
    return $.ajax ({
        method: "GET",
        url: `https://api.github.com/users/${username}`,
    })
    .then (user => {
        return user;
    })
    .catch (error => {
        return null;
    })
}

function updateUser (user) {
    if ($(`#${user.login}`).length == 0) {
        console.log ("Create New User", user.login);
        createNewUser (user);
    }
    // else {
    //     let updatedAt = $(`#${user.login}`).find (".updatedAt");
    //     if (updatedAt.text () < user.updated_at) {
    //         $(`#${user.login}`).find (".login").text (user.login);
    //         $(`#${user.login}`).find (".name").text (user.name);
    //         $(`#${user.login}`).find (".updatedAt").text (user.updated_at);
    //         $(`#${user.login}`).find (".img").text (user.img);
    //     }
    // }
}

function updateGitHubUsers () {
    usernames.forEach (username => {
        getGitHubUsersFromCache (username)
            .then (user => {
                if (user !== null) {}
                    updateUser (user);
            });
        // getGitHubUsersFromNetwork (username)
        //     .then (user => {
        //         if (user !== null)
        //             updateUser (user);
        //     })
            
    })
}

function init () {
    console.log ("init");
    if (localStorage.getItem ("usernames"))
        usernames = localStorage.getItem ("usernames").split (",");
    updateGitHubUsers ();
}

init ();