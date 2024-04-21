document.getElementById('signInButton').addEventListener('click', function() {
    const email = document.getElementById('emailField').value;
    const password = document.getElementById('passwordField').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("ログイン成功: " + userCredential.user.email);
        })
        .catch((error) => {
            alert("エラー: " + error.message);
        });
});
