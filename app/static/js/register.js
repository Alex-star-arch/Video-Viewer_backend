function register() {
    var username = $("#username").val();
    var password = $("#password").val();
    var password2 = $("#ensurepassword").val();
    if (password != password2) {
        alert("两次输入的密码不一致！");
    } else {
        axios.post('/register', {
            username: username,
            password: password
        })
            .then(function (response) {
                    if (response.data.code === 200) {
                        window.location.href = '/';
                    } else {
                        alert(response.data.msg);
                    }
                }
            )
            .catch(function (error) {
                    console.log(error);
                }
            );
    }
}