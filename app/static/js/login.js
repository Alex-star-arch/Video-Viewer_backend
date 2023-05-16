function login(){
    axios.post('/login', {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    })
    .then(function (response) {
        if(response.data == 'success'){
            window.location.href = 'index.html';
        }else{
            alert('Invalid email or password');
        }
    }
    )
    .catch(function (error) {
        console.log(error);
    }
    );
}