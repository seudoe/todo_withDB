console.log('Hello');

let LOGIN = true;
document.querySelector('.switchTo-login').onclick = () => {
    console.log('switching to login')
    LOGIN = true;
    document.querySelector('.register').style.display = 'none';
    document.querySelector('.login').style.display = 'block';
}
document.querySelector('.switchTo-register').onclick = () => {
    console.log('switching to register')
    LOGIN = false;
    document.querySelector('.register').style.display = 'block';
    document.querySelector('.login').style.display = 'none';
}

// localStorage.setItem('localEmail', JSON.stringify({email : 'Email'}));

// const local = JSON.parse(localStorage.getItem('localEmail')); 

let emailInp = document.querySelector('.emailInp');
let passInp = document.querySelector('.passwInp');

let loginButton = document.querySelector('.login-button');

let current_user = {};

loginFunc = () => {
    if(!authenticate(emailInp.value, passInp.value).status){
        document.querySelector('.incorrect').innerHTML = authenticate(emailInp.value, passInp.value).tip;
        console.log('Authentication Failed: ', authenticate(emailInp.value, passInp.value).tip)
        return ;
    }
    console.log('Sending: ');
    console.log({
        email : emailInp.value,
        pass : passInp.value
    });
    fetch('/login', {
        method: 'POST',
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            action : 1, 
            email : emailInp.value,
            pass : passInp.value
        })
    })
    .then((response) => {
        return response.json();
    })
    .then ((data) => {
        if(data){
            if(data.status === 0){
                console.log('U r right , clearing .incorrect msg');
                document.querySelector('.incorrect').innerHTML = ``;
                window.location.href = '/home';
                current_user = {
                    email : emailInp.value
                }
                // ----------------------------------------------------
                localStorage.setItem('localEmail', JSON.stringify(current_user));
            }
            else if(data.status === 1 || data.status === 2){
                console.log('OnLogin: data.status: ',data.status)
                document.querySelector('.incorrect').innerHTML = (data.status === 1)?`Incorrect Email or Password`:`User Doesnt Exist`;
            }
        }
    })
    .catch((error) => {
        console.log('Error ----------------\n  ',  error);
    })
}
loginButton.onclick = loginFunc;
passInp.addEventListener('keydown', e => {
    if(e.key == 'Enter') loginFunc();
})
emailInp.addEventListener('keydown', e => {
    if(e.key === 'Enter') passInp.focus();
})


let emailInp2 = document.querySelector('.emailInp2');
let passInp2 = document.querySelector('.passwInp2');
let registerButton = document.querySelector('.register-button');

registerFunc = () => {
    if(!authenticate(emailInp2.value, passInp2.value).status){
        document.querySelector('.incorrectR').innerHTML = authenticate(emailInp2.value, passInp2.value).tip;
        console.log('Authentication Failed: ', authenticate(emailInp2.value, passInp2.value).tip)
        return ;
    }


    console.log('trying to register: ');
    console.log({
        email : emailInp2.value,
        pass : passInp2.value
    });
    fetch('/login', {
        method: 'POST',
        headers : {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            action : 0, 
            email : emailInp2.value,
            pass : passInp2.value
        })
    })
    .then((response) => {
        return response.json();
    })
    .then ((data) => {
        if(data){
            if(data.status === 0){
                console.log('registered');
                document.querySelector('.incorrect').innerHTML = ``;
                window.location.href = '/home';
                current_user = { 
                    email : emailInp2.value
                }
                // ----------------------------------------------------
                localStorage.setItem('localEmail', JSON.stringify(current_user));
            }
            else if(data.status === 1 ){
                console.log('during registe, user already exists')
                document.querySelector('.incorrectR').innerHTML = `User already exists`;
            }
            else if(data.status === 2){
                document.querySelector('.incorrectR').innerHTML = `Didnt add Sorry , server erorr`;
            }
        }
    })
    .catch((error) => {
        console.log('Error ----------------\n ', error);
    })
}
registerButton.onclick = registerFunc;
passInp2.addEventListener('keydown', e => {
    if(e.key == 'Enter') registerFunc();
})
emailInp2.addEventListener('keydown', e => {
    if(e.key === 'Enter') passInp2.focus();
})

function authenticate(email, pass){
    if(email.trim().length === 0  || pass.trim().length === 0){
        return {
            status : false,
            tip : 'Please enter values'
        };
    }
    for(let i=0; i<email.length; i++){
        if(email[i] === ' ') return {
            status : false,
            tip : 'Email cannnot contain space'
        };
    }
    for(let i=0; i<pass.length; i++){
        if(pass[i] === ' ') return {
            status : false,
            tip : 'Password cannnot contain space'
        };;
    }
    if(pass.length < 8){
        return {
            status : false,
            tip : 'Min length of pass is 8'
        }
    }

    return {
        status: true,
        tip : 'Hooray!'
    }
}






let resetButtons = document.querySelectorAll('.reset-button');
resetButtons[0].onclick = () => {
    console.log('resetting login values');
    emailInp.value = ``
    passInp.value = ``
};
resetButtons[1].onclick = () => {
    console.log('resetting registering values');
    emailInp2.value = ``
    passInp2.value = ``
};



