function register(){
    var username = $("#username").val();
    var password = $("#passwd").val();
    var password2 = $("#ensurepasswd").val();
    if(password != password2){
        alert("两次输入的密码不一致！");
    }else{
        axios.post('/register', {
            username: username,
            password: password
        })
        .then(function (response) {
            if(response.data == 'success'){
                window.location.href = 'login.html';
            }else{
                alert('注册失败！');
            }
        }
        )
        .catch(function (error) {
            console.log(error);
        }
        );
    }
}