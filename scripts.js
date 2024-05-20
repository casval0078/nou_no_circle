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
    const boardPage = document.getElementById('boardPage');
    const postsDiv = document.getElementById('posts');

    // ログインフォームの送信イベント
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // ログイン成功時にユーザー名を取得
            const user = userCredential.user;
            const userName = user.displayName;
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('boardPage').style.display = 'block';
            loadPosts(userName); // ユーザー名を引数として渡す
        })
        .catch((error) => {
            alert(error.message);
        });
});

    // サインアップフォームの送信イベント
signUpForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value; // 追加
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Firebase Authentication に名前を追加
            updateProfile(auth.currentUser, {
                displayName: name
            }).then(() => {
                alert('サインアップが成功しました。ログインしてください。');
                signUpForm.style.display = 'none';
                loginForm.style.display = 'block';
            }).catch((error) => {
                alert(error.message);
            });
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
postForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const comment = document.getElementById('comment').value;
    const file = document.getElementById('file').files[0]; // 添付ファイルを取得
    const user = auth.currentUser;
    if (comment && user) {
        try {
            let downloadURL = ''; // ダウンロードURL
            if (file) {
                // ストレージに動画ファイルをアップロード
                const storageRef = ref(storage, `files/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                await uploadTask;

                // アップロードした動画ファイルのダウンロードURLを取得
                downloadURL = await getDownloadURL(storageRef);
            }

            // データベースに投稿を追加
            await addDoc(collection(db, 'posts'), {
                uid: user.uid,
                username: user.displayName, // ユーザー名を追加
                comment: comment,
                fileURL: downloadURL, // 動画のダウンロードURLを追加
                timestamp: serverTimestamp()
            });

            // 投稿後にフォームをクリア
            document.getElementById('comment').value = '';
            document.getElementById('file').value = '';

            // 投稿を読み込み
            loadPosts();
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert('コメントを入力してください');
    }
});



  querySnapshot.forEach((doc) => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.innerText = doc.data().comment;
    if (doc.data().imageURL) {
        const imgElement = document.createElement('img');
        imgElement.src = doc.data().imageURL;
        postDiv.appendChild(imgElement);
    }
    postsDiv.appendChild(postDiv);
});


    // ログアウトボタンクリックイベント
    logoutButton.addEventListener('click', function() {
        auth.signOut().then(() => {
            document.getElementById('boardPage').style.display = 'none';
            document.getElementById('loginPage').style.display = 'block';
        });
    });

    // 投稿の読み込み
async function loadPosts(userName) {
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        const postData = doc.data();
        postDiv.innerHTML = `<p><strong>${userName}: </strong>${postData.comment}</p>`; // ユーザー名を表示
        if (postData.fileURL) {
            const fileElement = document.createElement(postData.fileURL.match(/\.(jpeg|jpg|gif|png)$/) ? 'img' : 'video');
            fileElement.src = postData.fileURL;
            if (fileElement.tagName === 'VIDEO') {
                fileElement.controls = true;
            }
            postDiv.appendChild(fileElement);
        }
        postsDiv.appendChild(postDiv);
    });
}

    // 認証状態の変更を監視
    auth.onAuthStateChanged((user) => {
        if (user) {
            // ログイン済みの場合の処理
            boardPage.style.display = 'block';
            loginPage.style.display = 'none';
            loadPosts();
        } else {
            // 未ログインの場合の処理
            boardPage.style.display = 'none';
            loginPage.style.display = 'block';
        }
    });
});
