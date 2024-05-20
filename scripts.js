/ Firebase設定を貼り付け
const firebaseConfig = {
  apiKey: "AIzaSyDsK4imQ3uWcK7hyESo6hnDyQ96lsPNCZ8",
  authDomain: "nou-no-circle.firebaseapp.com",
  projectId: "nou-no-circle",
  storageBucket: "nou-no-circle.appspot.com",
  messagingSenderId: "756338805186",
  appId: "1:756338805186:web:cb740e035ac611b5baae5b",
  measurementId: "G-TWBV38P13D"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');
    const signUpLink = document.getElementById('signUpLink');
    const loginLink = document.getElementById('loginLink');
    const postForm = document.getElementById('postForm');
    const logoutButton = document.getElementById('logoutButton');

    // ログインフォームの送信イベント
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                document.getElementById('loginPage').style.display = 'none';
                document.getElementById('boardPage').style.display = 'block';
                loadPosts();
            })
            .catch((error) => {
                alert(error.message);
            });
    });

    // サインアップフォームの送信イベント
    signUpForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert('サインアップが成功しました。ログインしてください。');
                signUpForm.style.display = 'none';
                loginForm.style.display = 'block';
            })
            .catch((error) => {
                alert(error.message);
            });
    });

    // サインアップリンククリックイベント
    signUpLink.addEventListener('click', function() {
        loginForm.style.display = 'none';
        signUpForm.style.display = 'block';
    });

    // ログインリンククリックイベント
    loginLink.addEventListener('click', function() {
        signUpForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // 投稿フォームの送信イベント
    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const comment = document.getElementById('comment').value;
        const user = auth.currentUser;
        if (comment && user) {
            db.collection('posts').add({
                uid: user.uid,
                comment: comment,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                document.getElementById('comment').value = '';
                loadPosts();
            })
            .catch((error) => {
                alert(error.message);
            });
        } else {
            alert('コメントを入力してください');
        }
    });

    // ログアウトボタンクリックイベント
    logoutButton.addEventListener('click', function() {
        auth.signOut().then(() => {
            document.getElementById('boardPage').style.display = 'none';
            document.getElementById('loginPage').style.display = 'block';
        });
    });

    // 投稿の読み込み
    function loadPosts() {
        db.collection('posts').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
            const postsDiv = document.getElementById('posts');
            postsDiv.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerText = doc.data().comment;
                postsDiv.appendChild(postDiv);
            });
        });
    }
    
    // 認証状態の変更を監視
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('boardPage').style.display = 'block';
            loadPosts();
        } else {
            document.getElementById('loginPage').style.display = 'block';
            document.getElementById('boardPage').style.display = 'none';
        }
    });
});
