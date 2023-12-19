// import { getCookie, setCookie } from "./test.js";
document.getElementById("SubmitButton").addEventListener("click", register);
document.body.style.zoom = 100 + '%';


var err_msg = document.getElementById("err_msg");
var errDialog = document.getElementById("errDialog");

function closeMsg() {
  errDialog.close();
}

function register(){
    var x = document.getElementById("register")
    var userId=x.userId.value;
    // var nickname=x.nickName.value
    var userPassword=x.userPassword.value;
    console.log(userId)
    const Url='http://ec2-3-37-130-111.ap-northeast-2.compute.amazonaws.com:8081/user/sign-up'
    // const Url='http://localhost:8081/user/sign-up'
    const Data={
      userId:userId,
      userPassword:userPassword
    //   nickName:nickname
    }

    const othePram={
      headers: {
        'content-type': 'application/json',
        //'Authorization': "Bearer "+token
      },
      body: JSON.stringify(Data),
      method: 'POST',
    }
    console.log(othePram)
    fetch(Url, othePram)
    .then((data)=>{return data.json()})
    .then((res)=>{console.log(res)//location.href='test.html'
    if(res.code.status==1201){
        location.replace('login.html')
        console.log(res)
    }
    else{
        //alert(res.code.message)
        err_msg.innerHTML = res.code.message;
        errDialog.showModal();
    }
  })
    .catch((error)=>{
      console.log(error)
    //alert("통신 오류")
    err_msg.innerHTML = "통신 오류";
    errDialog.showModal();
  })
  }

