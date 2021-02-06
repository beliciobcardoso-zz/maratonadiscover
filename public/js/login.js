var providerGoogle = new firebase.auth.GoogleAuthProvider();
var providerGithub = new firebase.auth.GithubAuthProvider();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        window.location.href = "./finance.html"
    } else {
        console.log(user)
    }
});

function google() {
    firebase.auth()
        .signInWithPopup(providerGoogle)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}

function gitHub() {
    firebase.auth()
        .signInWithPopup(providerGithub)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            var token = credential.accessToken;

            // The signed-in user info.
            var user = result.user;
            // ...
            console.log(`Conectando com GitHub`)
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });


}

function login(event) {
    event.preventDefault()
    let user_email = document.getElementById("user_email").value
    let user_password = document.getElementById("user_password").value

    firebase.auth().signInWithEmailAndPassword(user_email, user_password)
        .then((user) => {
            // Signed in

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            switch (errorMessage) {
                case "The password is invalid or the user does not have a password.":
                    alert("A senha é inválida ou o usuário não possui uma senha.")
                    break;
                case "The email address is badly formatted.":
                    alert("O endereço de e-mail está formatado incorretamente.")
                    break;
                case "There is no user record corresponding to this identifier. The user may have been deleted.":
                    alert("Este email não esta cadastrado. Crie uma conta")
                    break;
            }

        });
}


function create(event) {
    event.preventDefault()

    let user_email = document.getElementById("user_email").value
    let user_password = document.getElementById("user_password").value
    let user_password2 = document.getElementById("user_password2").value

    if (user_password.trim() == "") {
        alert("Senha não pode ser em branco")

    } else if (user_password !== user_password2) {
        alert("Senha não coincidir")

    } else if (user_password.length < 8) {
        alert("Senha não pode ter menos de 8 caracteres")
    }
    else {

        firebase.auth().createUserWithEmailAndPassword(user_email, user_password)
            .then((user) => {
                // Signed in
                alert("cadastro criado")
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                switch (errorMessage) {
                    case "The email address is already in use by another account.":
                        alert("O endereço de e-mail já está sendo usado por outra conta.")
                        break;
                    case "The email address is badly formatted.":
                        alert("O endereço de e-mail está formatado incorretamente.")
                        break;
                }
            });
    }

}



