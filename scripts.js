// Firebase設定を貼り付け
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
    const name = document.getElementById('name').value; // 名前の入力値を取得
    const user = auth.currentUser;
    if (comment && name && user) {
        addDoc(collection(db, 'posts'), {
            uid: user.uid,
            name: name, // 名前をデータベースに保存
            comment: comment,
            timestamp: serverTimestamp()
        })
        .then(() => {
            document.getElementById('comment').value = '';
            document.getElementById('name').value = ''; // 投稿後に名前フィールドをクリア
            loadPosts();
        })
        .catch((error) => {
            alert(error.message);
        });
    } else {
        alert('名前とコメントを入力してください');
    }
});

    // ログアウトボタンクリックイベント
logoutButton.addEventListener('click', function() {
    auth.signOut().then(() => {
        // ログアウト後、ログインフォームの入力フィールドをクリアする
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('boardPage').style.display = 'none';
        document.getElementById('loginPage').style.display = 'block';
    });
});

    // 投稿の読み込み
function loadPosts() {
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = ''; // 既存の投稿をクリアする

    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            // 投稿者の名前とコメントを表示
            postDiv.innerHTML = `<strong>${doc.data().name}:</strong> ${doc.data().comment}`;
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
