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

function createNewUser (user) {
    const html = `
        <p>${user.login}</p>
        <p>${user.name}</p>
        <img src=${user.avatar_url} alt="${user.login}'s image" />
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

function updateGitHubUsers () {
    usernames.forEach (username => {
        getGitHubUsersFromCache (username)
            .then (user => {
                if (user !== null)
                    createNewUser (user);
            });
    })
}

function init () {
    console.log ("init");
    if (localStorage.getItem ("usernames"))
        usernames = localStorage.getItem ("usernames").split (",");
    updateGitHubUsers ();
}

init ();