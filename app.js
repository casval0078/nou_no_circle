// Firebaseの設定情報は前述のステップで既に追加済み

// フォームが送信されたときのイベントリスナーを追加
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();  // フォームのデフォルトの送信を防ぎます

    // メールアドレスとパスワードをフォームから取得
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Firebaseの認証機能を使ってログイン
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // ログイン成功
            console.log('Logged in', userCredential);
        })
        .catch((error) => {
            // ログイン失敗
            console.error('Login failed', error);
            alert('Login failed: ' + error.message);  // エラーメッセージを表示
        });
});
