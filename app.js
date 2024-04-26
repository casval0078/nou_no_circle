// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsK4imQ3uWcK7hyESo6hnDyQ96lsPNCZ8",
  authDomain: "nou-no-circle.firebaseapp.com",
  // other config properties
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Logged in as: ", user.email);
      })
      .catch((error) => {
        console.error("Error: ", error.message);
      });
});
