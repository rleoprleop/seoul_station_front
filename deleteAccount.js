// import { getCookie, setCookie } from "./test.js";
document.getElementById("DeleteButton").addEventListener("click", deleteAccount);
document.body.style.zoom = 100 + '%';

var err_msg = document.getElementById("err_msg");
var errDialog = document.getElementById("errDialog");

function closeMsg() {
  errDialog.close();
}

function deleteAccount(){
    var x = document.getElementById("deleteAccount")
    var token = window.sessionStorage.getItem("token")
    // setCookie("userId",userId,0)
    // document.cookie = "userId="+userId
    // setUserId(userId)
    var userPassword=x.pw-blank.value;
    var userId = x.id-blank.value;
    console.log(token)
    let Url='http://ec2-3-37-130-111.ap-northeast-2.compute.amazonaws.com:8081/user/delete-user'
    // let Url='http://localhost:8081/user/delete-user'
    const Data={
      userId:userId,
      userPassword:userPassword,
    }

    const othePram={
      headers: {
        'content-type': 'application/json',
        'Authorization': "Bearer "+token,
        'UserId': userId
      },
      body: JSON.stringify(Data),
      method: 'POST',
    }
    console.log(othePram)
    fetch(Url, othePram)
    .then((data)=>{return data.json()})
    .then((res)=>{console.log(res)//location.href='test.html'
    if(res.code.status==1203){
        //alert("삭제 완료")
        err_msg.innerHTML = "삭제 완료";
        errDialog.showModal();

        sessionStorage.clear()
        window.location.href="login.html"
    }
    else if(res.code.status==1403){
        //alert("비밀번호 확인")
        err_msg.innerHTML = "비밀번호 확인";
        errDialog.showModal();
    }
    else if(res.code.status==1406){
      console.log("refresh")
      refreshAuth()
    } 
    else{
      //alert("다시 확인")
      err_msg.innerHTML = "다시 확인";
      errDialog.showModal();
      // location.reload()
    }
  })
  .catch((error)=>{console.log(error)
    //alert("통신 오류")
    err_msg.innerHTML = "통신 오류";
    errDialog.showModal();
    window.location.reload
    })
}

function refreshAuth(){
    var token = window.sessionStorage.getItem("refreshToken")
    var userId= window.sessionStorage.getItem("userId")
    var refreshToken

    let Url='http://ec2-3-37-130-111.ap-northeast-2.compute.amazonaws.com:8081/user/refresh'
    // let Url='http://localhost:8081/user/refresh'

    const othePram={
      headers: {
        'content-type': 'application/json',
        'Authorization': "Bearer "+token,
        'UserId': userId
      },
      method: 'POST',
    }
    console.log(othePram)
    fetch(Url, othePram)
    .then((data)=>{return data.json()})
    .then((res)=>{console.log(res)//location.href='test.html'
    if(res.code.status==1204){
      console.log("재인증 완료")
      token = res.token.token
      refreshToken = res.token.refreshToken
      window.sessionStorage.setItem("token",token)//토큰
      window.sessionStorage.setItem("refreshToken",refreshToken)//refresh 토큰
      deleteAccount()
    }
    else{
      //alert("재인증 하시오")
      err_msg.innerHTML = "재인증 하시오";
      errDialog.showModal();
      window.location.href="login.html"
    }
  })
  .catch((error)=>{console.log(error)
    //alert("통신 오류")
    err_msg.innerHTML = "통신 오류";
    errDialog.showModal();
    window.location.reload
    })
}