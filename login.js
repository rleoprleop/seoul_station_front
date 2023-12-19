// import { getCookie, setCookie } from "./test.js";
document.getElementById("loginButton").addEventListener("click", login);
document.body.style.zoom = 100 + '%';

var err_msg = document.getElementById("err_msg");
var errDialog = document.getElementById("errDialog");

// function closeMsg(errDialog) {
//   errDialog.close();
// }

function login(){
    window.sessionStorage.clear()
    var x = document.getElementById("login")
    var userId=x.userId.value;
    var token
    var refreshToken
    // setCookie("userId",userId,0)
    // document.cookie = "userId="+userId
    // setUserId(userId)
    window.sessionStorage.setItem("userId",userId)
    var userPassword=x.userPassword.value;
    console.log(userId)
    const Url='http://ec2-3-37-130-111.ap-northeast-2.compute.amazonaws.com:8081/user/sign-in'
    // const Url='http://localhost:8081/user/sign-in'

    const othePram={
      headers: {
        'content-type': 'application/json',
        //'Authorization': "Bearer "+token
      },
      body: JSON.stringify({
        userId: userId,
        userPassword: userPassword,
      }),
      method: 'POST',
    }
    console.log(othePram)
    fetch(Url, othePram)
    .then((data)=>{return data.json()})
    .then((res)=>{console.log(res)//location.href='test.html'
    if(res.code.status==1200){
      token = res.token.token
      refreshToken = res.token.refreshToken
      console.log(token, refreshToken);
      window.sessionStorage.setItem("token",token)//토큰
      window.sessionStorage.setItem("refreshToken",refreshToken)//토큰      
      window.sessionStorage.setItem("id",res.user.id)//user의 고유 번호. http요청때 사용(stage)
        location.href = 'index.html'
    }
    else if(res.code.status == 1403){
      //alert("비밀번호 오류")
      err_msg.innerHTML = "비밀번호 오류";
      errDialog.showModal();
      // location.reload()
    }
    else{
      //alert("다시 확인")
      err_msg.innerHTML = "다시 확인";
      errDialog.showModal();
      // location.reload()
    }
  })
    .catch((error)=>{
      console.log(error)
    //alert("통신 오류")
    err_msg.innerHTML = "통신 오류";
    errDialog.showModal();
  })
  }

