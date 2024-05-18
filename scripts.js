function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username && password) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('boardPage').style.display = 'block';
    } else {
        alert('名前とパスワードを入力してください');
    }
}

function postComment() {
    var comment = document.getElementById('comment').value;

    if (comment) {
        var postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerText = comment;

        document.getElementById('posts').appendChild(postDiv);
        document.getElementById('comment').value = '';
    } else {
        alert('コメントを入力してください');
    }
}

// DOMContentLoadedイベントリスナーを追加して、HTML要素が完全に読み込まれた後にJavaScriptを実行
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        login();
    });

    document.getElementById('postForm').addEventListener('submit', function(event) {
        event.preventDefault();
        postComment();
    });
});
