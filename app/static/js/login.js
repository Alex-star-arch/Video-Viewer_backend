function login(){
    axios.post('/login', {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    })
    .then(function (response) {
        if(response.data.code === 200){
            console.log(response.data.data.token)
            localStorage.setItem('token', response.data.data.token)
            console.log(localStorage.getItem('token'))
            window.location.href = '/index';

        }else{
            alert('用户名或密码错误');
        }
    }
    )
    .catch(function (error) {
        console.log(error);
    }
    );
}