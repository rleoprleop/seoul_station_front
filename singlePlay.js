let canvas, ctx;
let fps = 60;
let gameActivated = false;

var err_msg = document.getElementById("err_msg");
var errDialog = document.getElementById("errDialog");

function closeMsg() {
  errDialog.close();
}

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

canvas.width = 1920;
canvas.height = 960;

document.body.style.zoom = 100 + '%';

createFillArray = function(len, n) {
    return new Array(len).fill(n);
}

var gameOver = document.getElementById('gameOver');
var gameClear = document.getElementById('gameClear');

//처음부터 진행할지 저장된 부분부터 진행할지 결정
var gameScreen = document.getElementById('gameScreen');
var newGameButton = document.getElementById('newGameButton');
var loadGameButton = document.getElementById('loadGameButton');
var chooseSavePoint = document.getElementById('chooseSavePoint');


newGameButton.addEventListener('click', ()=>{
    //선택 화면 가리기
    chooseSavePoint.style.display = 'none';
    currentStageNum = 0; //맨 처음 스테이지로
    stageSet(currentStageNum, 3)
    //게임 화면 띄우기
    gameScreen.style.display = "inline";
    gameActivated = true;
    console.log('button clicked')
    animate();
})

loadGameButton.addEventListener('click', ()=>{
    //선택 화면 가리기
    chooseSavePoint.style.display = 'none';
    currentStageNum = 0; //저장 되어있던 스테이지로
    //게임 화면 띄우기
    gameScreen.style.display = "inline";
    gameActivated = true;
    animate()
})

function stageSet(currentStageNum, healthCount){
    let userId=sessionStorage.getItem("userId")
    let id = sessionStorage.getItem("id")
    let token = sessionStorage.getItem("token")
    let Url='http://ec2-3-37-130-111.ap-northeast-2.compute.amazonaws.com:8081/stage/set'
    // let Url='http://localhost:8081/stage/set'

    const othePram={
        headers: {
            'content-type': 'application/json',
            'Authorization': "Bearer "+token,
            'UserId': userId
          },
      body: JSON.stringify({
        id: id,
        health: healthCount,
        stage: currentStageNum
      }),
      method: 'POST',
    }
    console.log(othePram)
    fetch(Url, othePram)
    .then((data)=>{return data.json()})
    .then((res)=>{console.log(res)//location.href='test.html'
    if(res.code.status==1206){
        healthCount = res.player.health
        currentStageNum = res.player.stage
    }
    else if(res.code.status==1406){
      console.log("refresh")
      refreshAuth()
    } 
  })
    .catch((error)=>{
      console.log(error)
    //alert("통신 오류")
    err_msg.innerHTML = "통신 오류";
    errDialog.showModal();
    })
}

function stageGet(){
    let userId=sessionStorage.getItem("userId")
    let id = sessionStorage.getItem("id")
    let token = sessionStorage.getItem("token")
    let Url='http://ec2-3-37-130-111.ap-northeast-2.compute.amazonaws.com:8081/stage/get'
    // let Url='http://localhost:8081/stage/get'

    const othePram={
        headers: {
            'content-type': 'application/json',
            'Authorization': "Bearer "+token,
            'UserId': userId
          },
      body: JSON.stringify({
        userId: userId,
        id: id
      }),
      method: 'POST',
    }
    console.log(othePram)
    fetch(Url, othePram)
    .then((data)=>{return data.json()})
    .then((res)=>{console.log(res)//location.href='test.html'
    if(res.code.status==1207){
        healthCount = res.player.health
        currentStageNum = res.player.stage
    }
    else if(res.code.status==1406){
      console.log("refresh")
      refreshAuth()
    } 
  })
    .catch((error)=>{
      console.log(error)
    //alert("통신 오류")
    err_msg.innerHTML = "통신 오류";
    errDialog.showModal();
    })
}

function refreshAuthGet(){
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
      stageGet()
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
  function refreshAuthSet(){
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
      stageSet()
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

function audioStop(audio) { // 오디오 멈춤 함수 -> stop역할
    audio.pause();
    audio.currentTime = 0;
}

//////////////////////////////stage Information
var stageInfo = document.getElementById('stageInfo');

const arr_stageName = ["   명동역 승강장 입구 ->", "   명동역 승강장 ->", "   명동역 - 회현역 통로 ->", "<- 회현역 승강장   ", "   회현역 승강장 입구 ->",
"   회현역 - 서울역 사이 열차 ->", "서울역"];

//////////////////////////////text dialogue 

var dialogueWindow = document.getElementById('dialogueWindow');
var dialogueText = document.getElementById('dialogueText');
var portrait = document.getElementById('portrait');

//대화가 있는 스테이지인지 확인하는 정보 -> 1이면 대화 있음
var checkStageNum = 0; // 0부터 시작

const arr_dialogueCheck = [1, 0, 0, 0, 0, 0, 0];//임시로 첫번째 0
const arr_textIndex = [0, 0, 0, 0, 0, 0, 0];
const arr_dialogues = [
    ["원재: 서울역 까지 앞으로 2개 남았군...", 
 "원재: 보호소에 있는 보급품도 거의 다 떨어졌어.",
 "원재: 서울역에 대량의 보급품이 방치돼 있다는 정보가 있어. 반드시 내가 가져와야 해.",
 "원재: 한 번 해보자고...",
 "- 좀비는 플레이어 공격에 상관 없이 계속 공격하는 특성이 있습니다.",
 "- 공격하는 타이밍에 맞춰 방어를 성공하면 좀비의 행동이 잠시 느려집니다.",
 "- 방어에 성공한다면 공격이 더 수월해집니다.",
 "- 'a', 'd' 키로 움직입니다. 'f'키를 눌러 공격합니다",
 "'r' 키를 누르면 방어가 활성화 됩니다.",
 "- 맵 진행 방향은 스테이지 정보의 화살표 방향입니다."], // stage 0
 [], //stage 1 대화 없음
 [], //stage 2 대화 없음
 [], //stage3 대화 없음
 [], //stage4 대화 없음
 [], //stage5 대화 없음
 []];

var textIndex = 0;
var dialogueOnGoing = false;
var dialogueFinished = false;

var talking = false;

function checkStageChanged(checkStageNum, stageNum) {
    if (stageNum > checkStageNum) {
        dialogueFinished = false;
        checkStageNum++;
    }
}

var player1_talking = new Audio('./sfx/dialogue/player1_talking.mp3');
player1_talking.volume = 0.5;
var player2_talking = new Audio('./sfx/dialogue/player2_talking.mp3');
player2_talking.volume = 0.5;
var instruction_talking = new Audio('./sfx/dialogue/instruction_talking.mp3');
instruction_talking.volume = 0.5;

 function textAnimation(tag, text) {
    tag.innerHTML='';
    dialogueOnGoing = true;
    
    for(let i=0; i < text.length; i++) {
        
        if (i == 0) { // 초상화 확인
            if (text[i] == '원') {
                portrait.src = "img/dialogue/player1.png";
                player1_talking.play();
            }
            else if (text[i] == '-') {
                portrait.src = "img/dialogue/instructionPortrait.png";
                instruction_talking.play();
            }
        }
        setTimeout(function(){
            talking = true;
            if (i == text.length - 1) {
                talking = false;
            }
            tag.innerHTML += text[i];
        } , (i+1)*50);
    }
    
}

document.addEventListener('keydown', function(e) {
    if (e.key ==='x' && dialogueOnGoing == true && talking == false) {
        if (textIndex < arr_dialogues[checkStageNum].length - 1) {
            textIndex++;
            textAnimation(dialogueText, arr_dialogues[checkStageNum][textIndex]);
        }
        else {
            textIndex = 0;
            dialogueFinished = true;
            dialogueOnGoing = false;
            dialogueWindow.style.display = "none";
        }
        
    }
})

/////////////////////////////audio files - 소리는 중복 실행 할 수 없기 때문에, 배열로 여러 객체를 생성해줘야 함.


//players
var arr_playerWalkingSfx = [];

for (let i = 0; i < 1; i++) {//플레이어가 1명이므로 2개 생성
    var playerWalking = new Audio('./sfx/player/WalkingTest.mp3');
    playerWalking.loop = true; //걷는 소리는 걷는동안 계속 반복 되어야 함
    arr_playerWalkingSfx.push(playerWalking);
}

var arr_playerAttackSfx = [];

for (let i = 0; i < 1; i++) {//플레이어가 1명이므로 2개 생성
    var playerAttack = new Audio('./sfx/player/playerAttack.mp3');
    arr_playerAttackSfx.push(playerAttack);
}

//NormalZombie
var normalZombieTotalNum = 9;

var arr_normalZombieMoving1Sfx = [];//왼쪽으로 움직일때 내는 소리

for (let i = 0; i < normalZombieTotalNum; i++) { 
    var normalZombieMoving1 = new Audio('./sfx/NormalZombie/NormalZombie_moving1.mp3');
    normalZombieMoving1.volume = 0.5;
    arr_normalZombieMoving1Sfx.push(normalZombieMoving1);
}

var arr_normalZombieMoving2Sfx = [];//오른쪽으로 움직일때 내는 소리

for (let i = 0; i < normalZombieTotalNum; i++) { 
    var normalZombieMoving2 = new Audio('./sfx/NormalZombie/NormalZombie_moving2.mp3');
    normalZombieMoving2.volume = 0.5;
    arr_normalZombieMoving2Sfx.push(normalZombieMoving2);
}

var arr_normalZombieAttackSfx = []; // 공격소리

for (let i = 0; i < normalZombieTotalNum; i++) { 
    var normalZombieAttack = new Audio('./sfx/NormalZombie/NormalZombie_attack.mp3');
    normalZombieAttack.volume = 0.5;
    arr_normalZombieAttackSfx.push(normalZombieAttack);
}

//RunningZombie
var runningZombieTotalNum = 3;

var arr_runningZombieWalking1Sfx = [];

for (let i = 0; i < runningZombieTotalNum; i++) { 
    var runningZombieWalking1 = new Audio('./sfx/RunningZombie/RunningZombie_walking1.mp3');
    arr_runningZombieWalking1Sfx.push(runningZombieWalking1);
}

var arr_runningZombieWalking2Sfx = [];

for (let i = 0; i < runningZombieTotalNum; i++) { 
    var runningZombieWalking2 = new Audio('./sfx/RunningZombie/RunningZombie_walking2.mp3');
    arr_runningZombieWalking2Sfx.push(runningZombieWalking2);
}

var arr_runningZombieAttackSfx = []; // 공격소리

for (let i = 0; i < runningZombieTotalNum; i++) { 
    var runningZombieAttack = new Audio('./sfx/RunningZombie/RunningZombie_attack.mp3');
    runningZombieAttack.volume = 0.5;
    arr_runningZombieAttackSfx.push(normalZombieAttack);
}

var arr_runningZombieRunningSfx = []; // 뛰는소리

for (let i = 0; i < runningZombieTotalNum; i++) { 
    var runningZombieRunning = new Audio('./sfx/RunningZombie/RunningZombie_running.mp3');
    runningZombieRunning.volume = 0.5;
    arr_runningZombieRunningSfx.push(runningZombieRunning);
}

//CrawlingZombie
var crawlingZombieTotalNum = 3;

var arr_crawlingZombieMoving1Sfx = [];//왼쪽으로 움직일때 내는 소리

for (let i = 0; i < crawlingZombieTotalNum; i++) { 
    var crawlingZombieMoving1 = new Audio('./sfx/CrawlingZombie/CrawlingZombie_moving1.mp3');
    arr_crawlingZombieMoving1Sfx.push(crawlingZombieMoving1);
}

var arr_crawlingZombieMoving2Sfx = [];//오른쪽으로 움직일때 내는 소리

for (let i = 0; i < crawlingZombieTotalNum; i++) { 
    var crawlingZombieMoving2 = new Audio('./sfx/CrawlingZombie/CrawlingZombie_moving2.mp3');
    arr_crawlingZombieMoving2Sfx.push(crawlingZombieMoving2);
}

var arr_crawlingZombieAttackSfx = []; // 공격소리

for (let i = 0; i < crawlingZombieTotalNum; i++) { 
    var crawlingZombieAttack = new Audio('./sfx/CrawlingZombie/CrawlingZombie_attack.mp3');
    crawlingZombieAttack.volume = 0.5;
    arr_crawlingZombieAttackSfx.push(crawlingZombieAttack);
}

var arr_crawlingZombieSpitSfx = []; // 원거리 공격 소리

for (let i = 0; i < crawlingZombieTotalNum; i++) { 
    var crawlingZombieSpit = new Audio('./sfx/CrawlingZombie/CrawlingZombie_spit.mp3');
    crawlingZombieSpit.volume = 0.5;
    arr_crawlingZombieSpitSfx.push(crawlingZombieSpit);
}

//BossZombie
var BossZombieNormalAttackSfx = new Audio('./sfx/BossZombie/BossZombieNormalAttack.mp3');
var BossZombieCombo1Sfx = new Audio('./sfx/BossZombie/BossZombieCombo1.mp3');
var BossZombieCombo2Sfx = new Audio('./sfx/BossZombie/BossZombieCombo2.mp3');
var BossZombieCombo3Sfx = new Audio('./sfx/BossZombie/BossZombieCombo3.mp3');
var BossZombieLandingSfx = new Audio('./sfx/BossZombie/BossZombieLanding.mp3');

//hit sound
var hitSfx = new Audio('./sfx/hit.mp3');

/////////////////////////////img files

//player 1
var img_Idle_full = new Image();
img_Idle_full.src = './img/Player_idle.png'

var img_Idle_full_left = new Image();
img_Idle_full_left.src = './img/Player_idle_left.png'

var img_Walking_full = new Image();
img_Walking_full.src = './img/Player_walking.png'

var img_Walking_full_left = new Image();
img_Walking_full_left.src = './img/Player_walking_left.png'

var img_Middle_Attack_full = new Image();
img_Middle_Attack_full.src = './img/Player_attack.png'

var img_Middle_Attack_full_left = new Image();
img_Middle_Attack_full_left.src = './img/Player_attack_left.png'

var img_Block = new Image();
img_Block.src = './img/Player_block.PNG'

var img_Block_left = new Image();
img_Block_left.src = './img/Player_block_left.png'

var img_Player_attacked = new Image();
img_Player_attacked.src = './img/Player_attacked.png'

var img_Player_attacked_left = new Image();
img_Player_attacked_left.src = './img/Player_attacked_left.png'

var img_Player_grabbed = new Image();
img_Player_grabbed.src = './img/Player_grabbed.png'

var img_Player_grabbed_left = new Image();
img_Player_grabbed_left.src = './img/Player_grabbed_left.png'

//BackGrounds
var img_bg_tutorial = new Image();
img_bg_tutorial.src = './img/BackGrounds/bg_tutorial.png'

var img_bg_station_1 = new Image();
img_bg_station_1.src = './img/BackGrounds/bg_station_1.png'

var img_bg_rail = new Image();
img_bg_rail.src = './img/BackGrounds/bg_rail.png'

var img_bg_station_2 = new Image();
img_bg_station_2.src = './img/BackGrounds/bg_station_2.png'

var img_bg_convenienceStore = new Image();
img_bg_convenienceStore.src = './img/BackGrounds/bg_convenienceStore.png'

var img_bg_innerCart = new Image();
img_bg_innerCart.src = './img/BackGrounds/bg_innerCart.png'

var img_bg_finalStage = new Image();
img_bg_finalStage.src = './img/BackGrounds/bg_finalStage.png'

var bgArray = [img_bg_tutorial, img_bg_station_1, img_bg_rail, img_bg_station_2, img_bg_convenienceStore,
    img_bg_innerCart, img_bg_finalStage];

//utils
var img_Player_health = new Image();
img_Player_health.src = './img/Player_healthBar.png'

var img_Zombie_health = new Image();
img_Zombie_health.src = './img/Zombie_healthBar.png'

var img_attack_warning = new Image();
img_attack_warning.src = './img/Attack_warning.png'

var img_interaction_instruction = new Image();
img_interaction_instruction.src = './img/Interaction_instruction.png'

var img_RangedAttack_warning = new Image();
img_RangedAttack_warning.src = './img/RangedAttack_warning.png'

var img_RangedAttack_falling = new Image();
img_RangedAttack_falling.src = './img/RangedAttack_falling.png'

var img_Boss_fallingWarning = new Image();
img_Boss_fallingWarning.src = './img/Boss_fallingWarning.png'

//zombies
var img_Zombie_idle = new Image();
img_Zombie_idle.src = './img/Zombie_idle.png'

var img_Zombie_idle_left = new Image();
img_Zombie_idle_left.src = './img/Zombie_idle_left.png'

var img_Zombie_attack = new Image();
img_Zombie_attack.src = './img/Zombie_attack.png'

var img_Zombie_attack_left = new Image();
img_Zombie_attack_left.src = './img/Zombie_attack_left.png'

var img_Zombie_walking = new Image();
img_Zombie_walking.src = './img/Zombie_walking.png'

var img_Zombie_walking_left = new Image();
img_Zombie_walking_left.src = './img/Zombie_walking_left.png'

var img_Zombie_stunned = new Image();
img_Zombie_stunned.src = './img/Zombie_stunned.png'

var img_Zombie_stunned_left = new Image();
img_Zombie_stunned_left.src = './img/Zombie_stunned_left.png'

var img_Zombie_death = new Image();
img_Zombie_death.src = './img/Zombie_death.png'

var img_Zombie_death_left = new Image();
img_Zombie_death_left.src = './img/Zombie_death_left.png'

//StuckedZombie

var img_StuckedZombie_attack = new Image();
img_StuckedZombie_attack.src = './img/StuckedZombieAttack.png'

var img_StuckedZombie_stunned = new Image();
img_StuckedZombie_stunned.src = './img/StuckedZombieStunned.png'

var img_StuckedZombie_death = new Image();
img_StuckedZombie_death.src = './img/StuckedZombieDeath.png'

//runningZombie
var img_RunningZombie_idle = new Image();
img_RunningZombie_idle.src = './img/RunningZombie_idle.png'

var img_RunningZombie_idle_left = new Image();
img_RunningZombie_idle_left.src = './img/RunningZombie_idle_left.png'

var img_RunningZombie_attack = new Image();
img_RunningZombie_attack.src = './img/RunningZombie_attack.png'

var img_RunningZombie_attack_left = new Image();
img_RunningZombie_attack_left.src = './img/RunningZombie_attack_left.png'

var img_RunningZombie_walking = new Image();
img_RunningZombie_walking.src = './img/RunningZombie_walking.png'

var img_RunningZombie_walking_left = new Image();
img_RunningZombie_walking_left.src = './img/RunningZombie_walking_left.png'

var img_RunningZombie_stunned = new Image();
img_RunningZombie_stunned.src = './img/RunningZombie_stunned.png'

var img_RunningZombie_stunned_left = new Image();
img_RunningZombie_stunned_left.src = './img/RunningZombie_stunned_left.png'

var img_RunningZombie_death = new Image();
img_RunningZombie_death.src = './img/RunningZombie_death.png'

var img_RunningZombie_death_left = new Image();
img_RunningZombie_death_left.src = './img/RunningZombie_death_left.png'

var img_RunningZombie_running = new Image();
img_RunningZombie_running.src = './img/RunningZombie_running.png'

var img_RunningZombie_running_left = new Image();
img_RunningZombie_running_left.src = './img/RunningZombie_running_left.png'

var img_RunningZombie_grabbing = new Image();
img_RunningZombie_grabbing.src = './img/RunningZombie_grabbing.png'

var img_RunningZombie_grabbing_left = new Image();
img_RunningZombie_grabbing_left.src = './img/RunningZombie_grabbing_left.png'

//CrawlingZombie
var img_CrawlingZombie_idle = new Image();
img_CrawlingZombie_idle.src = './img/CrawlingZombie_idle.png'

var img_CrawlingZombie_idle_left = new Image();
img_CrawlingZombie_idle_left.src = './img/CrawlingZombie_idle_left.png'

var img_CrawlingZombie_attack = new Image();
img_CrawlingZombie_attack.src = './img/CrawlingZombie_attack.png'

var img_CrawlingZombie_attack_left = new Image();
img_CrawlingZombie_attack_left.src = './img/CrawlingZombie_attack_left.png'

var img_CrawlingZombie_rangedAttack = new Image();
img_CrawlingZombie_rangedAttack.src = './img/CrawlingZombie_rangedAttack.png'

var img_CrawlingZombie_rangedAttack_left = new Image();
img_CrawlingZombie_rangedAttack_left.src = './img/CrawlingZombie_rangedAttack_left.png'

var img_CrawlingZombie_walking = new Image();
img_CrawlingZombie_walking.src = './img/CrawlingZombie_walking.png'

var img_CrawlingZombie_walking_left = new Image();
img_CrawlingZombie_walking_left.src = './img/CrawlingZombie_walking_left.png'

var img_CrawlingZombie_stunned = new Image();
img_CrawlingZombie_stunned.src = './img/CrawlingZombie_stunned.png'

var img_CrawlingZombie_stunned_left = new Image();
img_CrawlingZombie_stunned_left.src = './img/CrawlingZombie_stunned_left.png'

var img_CrawlingZombie_death = new Image();
img_CrawlingZombie_death.src = './img/CrawlingZombie_death.png'

var img_CrawlingZombie_death_left = new Image();
img_CrawlingZombie_death_left.src = './img/CrawlingZombie_death_left.png'

//BossZombie

var img_BossZombie_idle = new Image();
img_BossZombie_idle.src = './img/BossZombie_idle.png';

var img_BossZombie_idle_left = new Image();
img_BossZombie_idle_left.src = './img/BossZombie_idle_left.png';

var img_BossZombie_walking = new Image();
img_BossZombie_walking.src = './img/BossZombie_walking.png';

var img_BossZombie_walking_left = new Image();
img_BossZombie_walking_left.src = './img/BossZombie_walking_left.png';

var img_BossZombie_attack = new Image();
img_BossZombie_attack.src = './img/BossZombie_attack.png';

var img_BossZombie_attack_left = new Image();
img_BossZombie_attack_left.src = './img/BossZombie_attack_left.png';

var img_BossZombie_comboAttack = new Image();
img_BossZombie_comboAttack.src = './img/BossZombie_comboAttack.png';

var img_BossZombie_comboAttack_left = new Image();
img_BossZombie_comboAttack_left.src = './img/BossZombie_comboAttack_left.png';

var img_BossZombie_jump = new Image();
img_BossZombie_jump.src = './img/BossZombie_jump.png';

var img_BossZombie_jump_left = new Image();
img_BossZombie_jump_left.src = './img/BossZombie_jump_left.png';

var img_BossZombie_land = new Image();
img_BossZombie_land.src = './img/BossZombie_land.png';

var img_BossZombie_land_left = new Image();
img_BossZombie_land_left.src = './img/BossZombie_land_left.png';

var img_BossZombie_death = new Image();
img_BossZombie_death.src = './img/BossZombie_death.png';

var img_BossZombie_death_left = new Image();
img_BossZombie_death_left.src = './img/BossZombie_death_left.png';

var img_BossZombie_healthBar = new Image();
img_BossZombie_healthBar.src = './img/BossHealthBar.png';

//draw functions

function PlayerAttack(player) {//player 1 그림
    if (player.attackCount == 3) {//3번째 컷에서 공격 소리 재생
        arr_playerAttackSfx[0].play();
    }
    if (player.vel.lookingRight == true) {
        ctx.drawImage(img_Middle_Attack_full, player.width * player.attackCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
    }

    else if (player.vel.lookingRight == false) {
        ctx.drawImage(img_Middle_Attack_full_left, player.width * player.attackCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
    }
}


function drawPlayer(player) { //player 1 그림
        ctx.drawImage(img_Player_health, player.width * (player.healthMax - player.healthCount), 0, player.width, player.height, player.x, player.y + player.canvasLength, player.canvasLength, player.canvasLength);
        if (player.vel.attacking_motion == true) { //공격 하는 경우 -> 움직일 수 없음
            PlayerAttack(player);
        }

        //플레이어가 몬스터에게 맞은 경우 -> 맞은 모션
        else if(player.damaged == true) {
            if (player.vel.lookingRight == true) { //오른쪽을 보고있다가 맞은 경우
                if (player.damagedCount < 60) {
                    if (player.damagedCount <= 30) {
                        ctx.drawImage(img_Player_attacked, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                    }
                    else {
                        ctx.drawImage(img_Player_attacked, 500, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                    }
                }
                else if (damagedCount == 60) {
                    ctx.drawImage(img_Player_attacked, 500, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
            }

            else if(player.vel.lookingRight == false) { //왼쪽을 보고 있다가 맞은 경우
                if (player.damagedCount < 60) {
                    if (player.damagedCount <= 30) {
                        ctx.drawImage(img_Player_attacked_left, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                    }
                    else {
                        ctx.drawImage(img_Player_attacked_left, 500, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                    }
                }
                else if (player.damagedCount == 60) {
                    ctx.drawImage(img_Player_attacked_left, 500, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
            }
        }

        else if (player.grabbed == true) { //잡혀 있는 경우
            ctx.fillStyle = 'black';
            ctx.fillRect(player.x + 23, player.y - 42, 154, 9);

            ctx.fillStyle = 'gray';
            ctx.fillRect(player.x + 25, player.y - 40, 150, 5);

            ctx.fillStyle = 'green';
            ctx.fillRect(player.x + 25, player.y - 40, player.interactionPressCount, 5);

            ctx.drawImage(img_interaction_instruction, player.interactionCut * 250, 0, 250, 250, player.x + 70, player.y - 30, 60, 60);
            if (player.vel.lookingRight == true) {
                ctx.drawImage(img_Player_grabbed, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
            }
            else {
                ctx.drawImage(img_Player_grabbed_left, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
            }
        }

        // 공격중이 아닌 경우
        else {
            if (player.vel.blocking == true) {
                ctx.fillStyle = 'blue';
                if(player.vel.lookingRight == true) { //오른쪽 보고있는 경우 -> 오른쪽 방어
                    ctx.drawImage(img_Block, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }

                else if (player.vel.lookingRight == false) { //왼쪽 보고있는 경우 -> 왼쪽 방어
                    ctx.drawImage(img_Block_left, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
            }

            else if (player.vel.moving == true) { //걷는 경우
                arr_playerWalkingSfx[0].play();
                if (player.vel.lookingRight == true) { //오른쪽을 보고있는 경우
                    ctx.drawImage(img_Walking_full, player.width * player.walkingCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
        
                else { // 왼쪽을 보고있는 경우
                    ctx.drawImage(img_Walking_full_left, player.width *player.walkingCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
            }
    
            else { // 가만히 서 있는 경우
                audioStop(arr_playerWalkingSfx[0]);
                if (player.vel.lookingRight == true) { //오른쪽을 보고있는 경우
                    ctx.drawImage(img_Idle_full, player.width * player.idleCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
        
                else { // 왼쪽을 보고있는 경우
                    ctx.drawImage(img_Idle_full_left, player.width * player.idleCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
            }
        }
}
//임시로 1만
function drawbg(BackGround, currentStageNum) {
    ctx.drawImage(bgArray[currentStageNum], BackGround.bg_x * 2, 0, BackGround.bg_length * (canvas.width / canvas.height), BackGround.bg_length, 0, 0, canvas.width, canvas.height);
}

function drawStuckedZombie(zombie, currentStageNum) {
    if (zombie.stageNum == currentStageNum) {
        if (zombie.stunned == false && zombie.dead == false) {
            ctx.drawImage(img_StuckedZombie_attack, zombie.width * zombie.attackCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
        }
        else if (zombie.stunned == true && zombie.dead == false) {
            ctx.drawImage(img_StuckedZombie_stunned, zombie.width * zombie.stunCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
        }
        else if (zombie.dead == true) {
            if (zombie.deathCut == 0) {
                hitSfx.play();
            }
            ctx.drawImage(img_StuckedZombie_death, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
        }
    }
}

function drawNormalZombie(zombie, currentStageNum) {
    if (zombie.stageNum == currentStageNum) {
        if (zombie.hitCheck == true && zombie.dead == false) {
            hitSfx.play();
        }
        //공격 경고 알림
        if (zombie.vel.attacking == true) {
            if (zombie.attackRandomNum >= 2 || zombie.dead == true) {// 일반 공격 혹은 사망한 상태
                ctx.drawImage(img_attack_warning, 0, 0, 250, 250, zombie.x + 70, zombie.y - 50, 60, 60);
            }
    
            else if (zombie.attackRandomNum >= 0) {// 가드 불가 공격
                ctx.drawImage(img_attack_warning, 250, 0, 250, 250, zombie.x + 70, zombie.y - 50, 60, 60);
            }
        }
        //zombie 체력바
        ctx.drawImage(img_Zombie_health, zombie.width * (zombie.healthMax - zombie.healthCount), 0, zombie.width, zombie.height, zombie.x, zombie.y + zombie.canvasLength, zombie.canvasLength, zombie.canvasLength);
        if (zombie.dead == false) {
            if (zombie.vel.moving == false) { //움직이지 않는 경우
                if (zombie.stunned == true) {//기절한 경우
                    if (zombie.vel.lookingRight == true) {//오른쪽 기절
                        ctx.drawImage(img_Zombie_stunned, zombie.width * zombie.stunAnimaitonCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {
                        ctx.drawImage(img_Zombie_stunned_left, zombie.width * zombie.stunAnimaitonCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
                //텀이 끝나고 공격하고 있는 중인 경우
                else if (zombie.vel.attacking == true && zombie.waitCount == 60) {
                    if (zombie.attackCount == 1) {
                        arr_normalZombieAttackSfx[zombie.sfxIndex].play();
                    }
                    if (zombie.vel.lookingRight == true) {//오른쪽 공격
                        ctx.drawImage(img_Zombie_attack, zombie.width * zombie.attackCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {//왼쪽 공격
                        ctx.drawImage(img_Zombie_attack_left, zombie.width * zombie.attackCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
                //가만히 서 있는 경우
                else {
                    if (zombie.vel.lookingRight == true) { // 오른쪽
                        ctx.drawImage(img_Zombie_idle, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else { //왼쪽
                        ctx.drawImage(img_Zombie_idle_left, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
            }
            else {//움직이는 경우
                if (zombie.vel.lookingRight == true) {//오른쪽 걷기
                    if (zombie.walkingCut == 1 && zombie.x < 1900 && zombie.x > 10) {
                        arr_normalZombieMoving1Sfx[zombie.sfxIndex].play();
                    }
                    ctx.drawImage(img_Zombie_walking, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                }
                else {
                    if (zombie.walkingCut == 1 && zombie.x < 1900 && zombie.x > 10) {
                        arr_normalZombieMoving2Sfx[zombie.sfxIndex].play();
                    }
                    ctx.drawImage(img_Zombie_walking_left, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                }
            }
        }
        else { //죽는 경우
            if (zombie.deathCut == 0) {
                hitSfx.play();
            }
            if (zombie.lookingRight == true) {
                ctx.drawImage(img_Zombie_death, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
            else {
                ctx.drawImage(img_Zombie_death_left, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
        }
    }


    
}

function drawRunningZombie (zombie, currentStageNum) {

    if (zombie.stageNum == currentStageNum) {
        if (zombie.hitCheck == true && zombie.dead == false) {
            hitSfx.play();
        }
        //공격 경고 알림
        if (zombie.vel.attacking == true) {
            if (zombie.attackRandomNum >= 6 || zombie.dead == true) {// 일반 공격 혹은 사망한 상태
                ctx.drawImage(img_attack_warning, 0, 0, 250, 250, zombie.x + 70, zombie.y - 50, 60, 60);
            }
    
            else if (zombie.attackRandomNum < 6) {// 잡기 공격
                ctx.drawImage(img_attack_warning, 500, 0, 250, 250, zombie.x + 70, zombie.y - 50, 60, 60);
            }
        }

        //zombie 체력바
        ctx.drawImage(img_Zombie_health, zombie.width * (zombie.healthMax - zombie.healthCount), 0, zombie.width, zombie.height, zombie.x, zombie.y + zombie.canvasLength, zombie.canvasLength, zombie.canvasLength);
        if (zombie.dead == false) {
            if (zombie.vel.moving == false) { //움직이지 않는 경우
                if (zombie.stunned == true) {//기절한 경우
                    if (zombie.vel.lookingRight == true) {//오른쪽 기절
                        ctx.drawImage(img_RunningZombie_stunned, zombie.width * zombie.stunAnimaitonCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {
                        ctx.drawImage(img_RunningZombie_stunned_left, zombie.width * zombie.stunAnimaitonCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }

                //특정 플레이어를 잡고 있는 경우
                else if (zombie.grabbing == true) {
                    if (zombie.vel.lookingRight == true) {//오른쪽 잡기
                        ctx.drawImage(img_RunningZombie_grabbing, 0, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {//왼쪽 잡기
                        ctx.drawImage(img_RunningZombie_grabbing_left, 0, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
                //텀이 끝나고 공격하고 있는 중인 경우
                else if (zombie.vel.attacking == true && zombie.waitCount == 60 && zombie.grabbing == false) {
                    if (zombie.attackCount == 1) {
                        arr_runningZombieAttackSfx[zombie.sfxIndex].play();
                    }
                    if (zombie.vel.lookingRight == true) {//오른쪽 공격
                        ctx.drawImage(img_RunningZombie_attack, zombie.width * zombie.attackCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {//왼쪽 공격
                        ctx.drawImage(img_RunningZombie_attack_left, zombie.width * zombie.attackCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
                //가만히 서 있는 경우
                //else if (zombie.vel.attacking == false && zombie.grabbing == false) {
                else {
                    if (zombie.vel.lookingRight == true) { // 오른쪽
                        ctx.drawImage(img_RunningZombie_idle, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else { //왼쪽
                        ctx.drawImage(img_RunningZombie_idle_left, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
            }
            else {//움직이는 경우
                if (zombie.vel.lookingRight == true ) {

                    if (zombie.running == true) {//오른쪽 뛰기
                        arr_runningZombieRunningSfx[zombie.sfxIndex].play();
                        ctx.drawImage(img_RunningZombie_running, zombie.width * zombie.runningCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {//오른쪽 걷기
                        if (zombie.walkingCut == 1 && zombie.x < 1900 && zombie.x > 10) {
                            arr_runningZombieWalking1Sfx[zombie.sfxIndex].play();
                        }
                        ctx.drawImage(img_RunningZombie_walking, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
                else {
                    if (zombie.running == true) {//왼쪽 뛰기
                        arr_runningZombieRunningSfx[zombie.sfxIndex].play();
                        ctx.drawImage(img_RunningZombie_running_left, zombie.width * zombie.runningCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {//왼쪽 걷기
                        if (zombie.walkingCut == 1 && zombie.x < 1900 && zombie.x > 10) {
                            arr_runningZombieWalking2Sfx[zombie.sfxIndex].play();
                        }
                        ctx.drawImage(img_RunningZombie_walking_left, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
            }
        }
        else { //죽는 경우
            if (zombie.deathCut == 0) {
                hitSfx.play();
            }
            if (zombie.lookingRight == true) {
                ctx.drawImage(img_RunningZombie_death, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
            else {
                ctx.drawImage(img_RunningZombie_death_left, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
        }
    }

}

function drawCrawlingZombie(zombie, currentStageNum) {
    if (zombie.stageNum == currentStageNum) { //해당 스테이지일 경우 그리기
        if (zombie.hitCheck == true && zombie.dead == false) {
            hitSfx.play();
        }
        //체력바
        ctx.drawImage(img_Zombie_health, zombie.width * (zombie.healthMax - zombie.healthCount), 0, zombie.width, zombie.height, zombie.x, zombie.y + zombie.canvasLength, zombie.canvasLength, zombie.canvasLength);
        if (zombie.dead == false) {
            ////////////좀비 애니메이션
            if (zombie.vel.moving == false) {
                if (zombie.spitting == true && zombie.rangedAttackWaitCount >= 60 && zombie.rangedAttackWaitCount <= 90) {//발사모션
                    if (zombie.spittingCut == 1) {
                        arr_crawlingZombieSpitSfx[zombie.sfxIndex].play();
                    }
                    if (zombie.vel.lookingRight == true) {//오른쪽 보고있는 경우
                        ctx.drawImage(img_CrawlingZombie_rangedAttack, zombie.width * zombie.spittingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {//왼쪽
                        ctx.drawImage(img_CrawlingZombie_rangedAttack_left, zombie.width * zombie.spittingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
    
                else if (zombie.spitting == false && zombie.vel.attacking == true && zombie.waitCount == 60) { // 근거리 공격
                    if (zombie.attackCount == 1) {
                        arr_crawlingZombieAttackSfx[zombie.sfxIndex].play();
                    }
                    if (zombie.vel.lookingRight == true) {//오른쪽 보고있는 경우
                        ctx.drawImage(img_CrawlingZombie_attack, zombie.width * zombie.attackCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {//왼쪽
                        ctx.drawImage(img_CrawlingZombie_attack_left, zombie.width * zombie.attackCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }

                else if (zombie.stunned == true) {//기절한 경우
                    if (zombie.vel.lookingRight == true) {//오른쪽 기절
                        ctx.drawImage(img_CrawlingZombie_stunned, zombie.width * zombie.stunAnimaitonCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {
                        ctx.drawImage(img_CrawlingZombie_stunned_left, zombie.width * zombie.stunAnimaitonCount, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }

                else {// 그냥 서 있는 경우
                    if (zombie.vel.lookingRight == true) { // 오른쪽
                        ctx.drawImage(img_CrawlingZombie_idle, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else { //왼쪽
                        ctx.drawImage(img_CrawlingZombie_idle_left, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
            }

            

            else if (zombie.vel.moving == true){//움직이는 경우
                if (zombie.vel.lookingRight == true) {//오른쪽 걷기
                    if (zombie.walkingCut == 1 && zombie.x < 1900 && zombie.x > 10) {
                        arr_crawlingZombieMoving1Sfx[zombie.sfxIndex].play();
                    }
                    ctx.drawImage(img_CrawlingZombie_walking, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                }
                else {
                    if (zombie.walkingCut == 1 && zombie.x < 1900 && zombie.x > 10) {
                        arr_crawlingZombieMoving2Sfx[zombie.sfxIndex].play();
                    }
                    ctx.drawImage(img_CrawlingZombie_walking_left, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                }
            }
            //////////// 발사체 애니메이션
            if (zombie.rangedAttackWaitCount > 90 && zombie.rangedAttackWaitCount < 140) {//경고 표시
                ctx.drawImage(img_RangedAttack_warning, 0, 0, zombie.width, zombie.height, zombie.rangedAttackTarget - 100, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
            else if (zombie.rangedAttackWaitCount >= 140 && zombie.rangedAttackWaitCount < 150) {//투사체 떨어지는 첫번째 컷
                ctx.drawImage(img_RangedAttack_falling, 0, 0, zombie.width, zombie.height, zombie.rangedAttackTarget - 100, zombie.y - 100, zombie.canvasLength, zombie.canvasLength);
            }
            else if (zombie.rangedAttackWaitCount == 150) {//그 이후의 투사체 떨어지는 컷들
                ctx.drawImage(img_RangedAttack_falling, zombie.width * zombie.poisonFallingCut, 0, zombie.width, zombie.height, zombie.rangedAttackTarget - 100, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
        }
        else {//죽는 경우
            if (zombie.deathCut == 0) {
                hitSfx.play();
            }
            if (zombie.lookingRight == true) {
                ctx.drawImage(img_CrawlingZombie_death, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
            else {
                ctx.drawImage(img_CrawlingZombie_death_left, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
        }
    }
}

function drawBossZombie(zombie, currentStageNum) {
    if (zombie.stageNum == currentStageNum) {

        if (zombie.hitCheck == true && zombie.dead == false) {
            hitSfx.play();
        }
        //공격 경고 알림
        if (zombie.vel.attacking == true) {
            if (zombie.attackRandomNum <= 6 || zombie.dead == true) {// 일반 공격 혹은 사망한 상태
                ctx.drawImage(img_attack_warning, 0, 0, 250, 250, zombie.x + 70, zombie.y - 50, 60, 60);
            }
    
            else if (zombie.attackRandomNum > 6) {// 연속 공격
                ctx.drawImage(img_attack_warning, 250, 0, 250, 250, zombie.x + 70, zombie.y - 50, 60, 60);
            }
        }
        //zombie 체력바
        ctx.drawImage(img_BossZombie_healthBar, zombie.width * (zombie.healthMax - zombie.healthCount), 0, zombie.width, zombie.height, zombie.x, zombie.y + zombie.canvasLength, zombie.canvasLength, zombie.canvasLength);
        if (zombie.dead == false) {
            if (zombie.vel.moving == false) { //움직이지 않는 경우
                //텀이 끝나고 공격하고 있는 중인 경우
                if (zombie.vel.attacking == true && zombie.waitCount == 120) {
                    if (zombie.attackRandomNum <= 6) { //일반 공격
                        if (zombie.attackCut == 1) {
                            BossZombieNormalAttackSfx.play();
                        }
                        if (zombie.vel.lookingRight == true) {//오른쪽 공격
                            ctx.drawImage(img_BossZombie_attack, zombie.width * zombie.attackCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                        }
                        else {//왼쪽 공격
                            ctx.drawImage(img_BossZombie_attack_left, zombie.width * zombie.attackCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                        }
                    }
                    else if (zombie.attackRandomNum > 6) { // 연속 공격
                        if (zombie.comboAttackCut == 0 && zombie.waitCount == 120) {
                            BossZombieCombo1Sfx.play();
                        }
                        if (zombie.comboAttackCut == 4) {
                            BossZombieCombo2Sfx.play();
                        }
                        if (zombie.comboAttackCut == 8) {
                            BossZombieCombo2Sfx.play();
                        }

                        if (zombie.vel.lookingRight == true) {//오른쪽 공격
                            ctx.drawImage(img_BossZombie_comboAttack, zombie.width * zombie.comboAttackCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                        }
                        else {//왼쪽 공격
                            ctx.drawImage(img_BossZombie_comboAttack_left, zombie.width * zombie.comboAttackCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                        }
                    }
                    
                }
                //가만히 서 있는 경우
                else {
                    if (zombie.vel.lookingRight == true) { // 오른쪽
                        ctx.drawImage(img_BossZombie_idle, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else { //왼쪽
                        ctx.drawImage(img_BossZombie_idle_left, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
            }
            else {//움직이는 경우
                if (zombie.moveRandNum >= 8) {// 공중 이동
                    if (zombie.vel.lookingRight == true) {//오른쪽
                        if (zombie.jumpCount < 60) {//점프 동작
                            if (zombie.jumpCount < 10) {
                                ctx.drawImage(img_BossZombie_jump, zombie.width * zombie.jumpCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                            }
                            else if (zombie.jumpCut < 20) {
                                ctx.drawImage(img_BossZombie_jump, zombie.width * zombie.jumpCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 250, zombie.canvasLength, zombie.canvasLength);
                            }

                            else if (zombie.jumpCount < 30) {
                                ctx.drawImage(img_BossZombie_jump, zombie.width * zombie.jumpCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 450, zombie.canvasLength, zombie.canvasLength);
                            }
                            else {
                                ctx.drawImage(img_BossZombie_jump, zombie.width * zombie.jumpCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 450, zombie.canvasLength, zombie.canvasLength);
                            }
                        }
                        else if (zombie.jumpCount == 60 && zombie.delayCount == 60 && zombie.fallingWarningCount < 150) { // 경고 표시
                            ctx.drawImage(img_Boss_fallingWarning, 0, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                        }
                        else if (zombie.fallingCount < 90 && zombie.fallingWarningCount == 150) { //착지
                            if (zombie.fallingCount < 10) {
                                ctx.drawImage(img_BossZombie_land, zombie.width * zombie.landCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 450, zombie.canvasLength, zombie.canvasLength);
                            }
                            else if (zombie.fallingCount < 20) {
                                ctx.drawImage(img_BossZombie_land, zombie.width * zombie.landCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 250, zombie.canvasLength, zombie.canvasLength);
                            }
                            else if (zombie.fallingCount < 90) {
                                if (zombie.fallingCount == 30) {
                                    BossZombieLandingSfx.play();
                                }
                                ctx.drawImage(img_BossZombie_land, zombie.width * zombie.landCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                            }
                        }
                    }
                    else {//왼쪽
                        if (zombie.jumpCount < 60) {//점프 동작
                            if (zombie.jumpCount < 10) {
                                ctx.drawImage(img_BossZombie_jump_left, zombie.width * zombie.jumpCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                            }
                            else if (zombie.jumpCut < 20) {
                                ctx.drawImage(img_BossZombie_jump_left, zombie.width * zombie.jumpCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 250, zombie.canvasLength, zombie.canvasLength);
                            }

                            else if (zombie.jumpCount < 30) {
                                ctx.drawImage(img_BossZombie_jump_left, zombie.width * zombie.jumpCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 450, zombie.canvasLength, zombie.canvasLength);
                            }
                            else {
                                ctx.drawImage(img_BossZombie_jump_left, zombie.width * zombie.jumpCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 450, zombie.canvasLength, zombie.canvasLength);
                            }
                        }
                        else if (zombie.jumpCount == 60 && zombie.delayCount == 60 && zombie.fallingWarningCount < 150) { // 경고 표시
                            if ((zombie.fallingWarningCount / 30) % 2 == 0) {
                                ctx.drawImage(img_Boss_fallingWarning, 0, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                            }
                        }
                        else if (zombie.fallingCount < 90 && zombie.fallingWarningCount == 150) { //착지
                            if (zombie.fallingCount < 10) {
                                ctx.drawImage(img_BossZombie_land_left, zombie.width * zombie.landCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 450, zombie.canvasLength, zombie.canvasLength);
                            }
                            else if (zombie.fallingCount < 20) {
                                ctx.drawImage(img_BossZombie_land_left, zombie.width * zombie.landCut, 0, zombie.width, zombie.height, zombie.x, zombie.y - 250, zombie.canvasLength, zombie.canvasLength);
                            }
                            else if (zombie.fallingCount < 90) {
                                if (zombie.fallingCount == 30) {
                                    BossZombieLandingSfx.play();
                                }
                                ctx.drawImage(img_BossZombie_land_left, zombie.width * zombie.landCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                            }
                        }
                    }
                }
                else {//일반 이동
                    if (zombie.vel.lookingRight == true) {//오른쪽 걷기
                        ctx.drawImage(img_BossZombie_walking, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {
                        ctx.drawImage(img_BossZombie_walking_left, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
            }
        }
        else { //죽는 경우
            if (zombie.deathCut == 0) {
                hitSfx.play();
            }
            if (zombie.lookingRight == true) {
                ctx.drawImage(img_BossZombie_death, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
            else {
                ctx.drawImage(img_BossZombie_death_left, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////gameLoop, game logics

/////////////////////   Classes  /////////////////////////////
class BackGround {
    constructor() {
        this.bg_length = canvas.width;
        this.bg_canvasLength = canvas.height;
        this.bg_x = 0;
        this.bg_count = 3;
        //this.bg_xMax = (this.bg_length * this.bg_count) - this.bg_length * (canvas.width / canvas.height);
        this.ratio = this.bg_length / canvas.height;
        this.bgmovingRight = false;
        this.bgmovingLeft = false;
         //주인공이 화면 끝까지 이동할 수 있는 경우는 오른쪽으로 가면서 bg_x == bg_xMax이거나, 왼쪽으로 가면서 bg_x == 0 인 경우. 그 이외에는 화면이 움직여야 함
        this.stageNum = 0;// 스테이지는 0부터 시작, 맵이 바뀔 때 마다 1씩 증가함
        this.arr_bgImg_width = [ 5760, 11520, 11520, 11520, 5760, 7680, 9600];
        this.bg_xMax = this.arr_bgImg_width[0] * (960 / 1920) - 1920;
    }

    updateBgXMax(currentStageNum) {
        this.bg_xMax = (this.arr_bgImg_width[currentStageNum] * 960) / 1920 - 1920;
    }
}

//튜토리얼 용
class StuckedZombie {
    constructor(x, y, width, height, canvasLength) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvasLength = canvasLength;

        this.attackLoop = 3;
        this.attackCount = 0;
        this.attackCut = 0;

        this.stageNum = 0;

        this.stunned = false;
        this.stunCount = 0;
        this.stunCut = 0;
        this.dead = false;

        this.waitCount = 0;

        this.deathCount = 0;
        this.deathCut = 0;

        this.dummy = 0;

        this.healthCount = 1;
        this.hitCheck = false
    }
    setFixedRange(a, b) {
        this.dummy = a + b;
    }
    attack(collisonCheckX, p1) {
        
        for (var i = 0; i <= this.canvasLength - 100; i++) {
            collisonCheckX[this.x + 50 + i] = 1;
        }
        if (this.stunned == false && this.dead == false) {
            this.checkStunned(p1);
            if (this.attackCount < 20 && this.attackCut < 2) {
                this.attackCount++;
            }
            else if(this.attackCount == 20) {
                this.attackCount = 0;
                this.attackCut++;
            }
            if (this.attackCut == 2) {
                if (this.waitCount < 30) {
                    this.waitCount++;
                }
                else if (this.waitCount == 30) {
                    this.waitCount = 0;
                    this.attackCut = 0;
                }
            }
        }
        else if (this.stunned == true && this.dead == false) {
            this.stun(p1);
        }
        else if (this.dead == true) {
            for (var i = 0; i <= this.canvasLength - 100; i++) {
                collisonCheckX[this.x + 50 + i] = -1;
            }
            if (this.deathCount < 20 && this.deathCut < 4) {
                this.deathCount++;
            }
            else if (this.deathCount == 20) {
                this.deathCount = 0;
                this.deathCut++;
            }
        }
    }

    stun() {
        if (this.stunCount < 30 && this.stunCut < 2) {
            this.stunCount++;
        }
        else if (this.stunCount == 30) {
            this.stunCount = 0;
            this.stunCut++;
        }
    }

    checkStunned(p1) {
        if (this.x - p1.x < 170 && p1.vel.blocking == true) {
            this.stunned = true;
        }
    }

    checkAttacked(atkTimer_p1, collisonCheckX) {//공격이 해당 물체에 가해졌는지 확인
        if ((collisonCheckX[atkTimer_p1] == 1) && (this.x <= atkTimer_p1 && atkTimer_p1 <= this.x + this.canvasLength) && this.dead == false) {
            this.healthCount--;
            this.hitCheck=true;
            if (this.healthCount == 0) {
                //console.log('nz1 dead');
                this.dead = true;
            }
        }
    }
}



// 몹 기본 상위 클래스
class Creature {
    constructor(x, y, width, height, canvasLength) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.canvasLength = canvasLength;
        this.attackBox = {
            position_x : this.x + this.canvasLength / 2,
            position_y : this.y - 50,
            width: 120,
            height: 50,
            atkTimer: 0
        }
        //각 동작의 총 컷 수
        this.idleLoop = 0;
        this.walkingLoop = 0;
        this.attackLoop = 0;
        this.deathLoop = 0;

        //각 동작의 현재 몇 번째 컷인지 알려주는 정보
        this.idleCut = 0;
        this.walkingCut = 0;
        this.attackCut = 0;
        this.deathCut = 0;

        //각 동작의 현재 몇 번째 프레임인지 알려주는 정보
        this.idleCount = 0;
        this.walkingCount = 0;
        this.attackCount = 0;
        this.deathCount = 0;


        //해당 플레이어의 키보드 입력에 영향을 받는 속성들
        this.vel = {
            // 보고 있는 방향
            lookingRight : true,

            // 공격하고 있는지 여부
            attacking : false,
            attacking_motion : false,

            //움직이고 있는지 여부
            moving : false,
            movingRight : false,
            movingLeft : false,

            //방어 하고있는지 여부
            blocking : false,

            //상호 작용 관련 수행 여부 (잡기 풀기 등등...)
            interaction : false
        }



        //맞았는지 여부
        this.damaged = false;
        this.damagedCount = 0;

        //체력
        this.healthMax = 3;
        this.healthCount = this.healthMax;
        this.dead = false;
    }

    setLocation(x, y) {
        this.x = x;
        this.y = y;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    setCanvasSize(canvasLength) {
        this.canvasLength = canvasLength;
    }

    setAttackBoxSize(width, height) {
        this.attackBox.width = width;
        this.attackBox.height = height;
    }

    setLoops(idleLoop, walkingLoop, attackLoop, deathLoop) {
        this.idleLoop = idleLoop;
        this.walkingLoop = walkingLoop;
        this.attackLoop = attackLoop;
        this.deathLoop = deathLoop;
    }

    setCounts(idleCount, walkingCount, attackCount) {
        this.idleCount = idleCount;
        this.walkingCount = walkingCount;
        this.attackCount = attackCount;
    }
}

class MainCharacter extends Creature {
    constructor(x, y, width, height, canvasLength) {
        super(x, y, width, height, canvasLength);
        this.frameCount = 0;
        this.damagedCount = 0;
        this.refreshRate = 10;
        this.attackTimer = 0;
        this.attackFrame = 0;
        this.damagedLoop = 0;

        this.interactionLoop = 3;
        this.interactionCut = 0;
        this.interactionCount = 0;

        this.interactionPressCount = 0;

        this.BlockBox = {
            x_right : this.x + this.canvasLength - 10,
            x_left : this.x + 10,
            y : this.y + 60,
            width : 40,
            height : 70
        }

        this.healthCount = 3;

        this.grabbed = false;
    }

    checkIsDead() {
        // 테스트 중일때는 안죽게 임시방편
        // if (this.healthCount <= 0) {
        //     this.dead = true;
        // }
        // else {
        //     this.dead = false;
        // }
    }

}

class NormalZombie extends Creature { //좀비 클래스
    constructor(x, y, width, height, canvasLength) {
        super(x, y, width, height, canvasLength);
        this.move_range = 100; // 몹이 무작위로 움직이는 최대 범위
        this.move_randNum = 0; // 몹이 무작위로 움직이는 범위
        this.moveCount = 0;
        this.speed = 1;        // 몹 움직이는 속도
        this.xMax_left = 0;
        this.xMax_right = 0;
        this.x_detectLeft = this.x - 150; //몹이 왼쪽에서 플레이어를 감지 할 수 있는 범위
        this.x_detectRight = this.x + this.canvasLength + 150; //몹이 오른쪽에서 플레이어를 감지 할 수 있는 범위
        this.x_attackLeft = this.x + 30; //몹이 왼쪽에서 플레이어를 공격 할 수 있는 범위
        this.x_attackRight = this.x + this.canvasLength - 30;
        this.movingDone = true;
        this.dead = false;
        this.attackFrame = 0;
        this.stunned = false;
        this.stunCount = 0;
        this.stunAnimaitonCount = 0;
        this.stunLoop = 0;
        this.waitCount = 0;
        this.deathFrame = 0;
        this.deathCount = 0;
        this.stageNum = 1; //stage 정보
        this.attackRandomNum = 0; //공격 종류를 결정하는 난수
        //공격 행위 끝날때까지 유지
        this.attackDone = true;

        this.hitCheck = false;

        this.sfxIndex = 0;
    }

    setSpeed(speed) {
        this.speed = speed;
    }
    setFixedRange(xMax_left, xMax_right) {
        this.xMax_left = xMax_left;
        this.xMax_right = xMax_right;
    }
    setSfxIndex(sfxIndex) {
        this.sfxIndex = sfxIndex;
    }
    setMoveRange(move_range) {
        this.move_range = move_range;
    }

    setStunLoop(stunLoop) {
        this.stunLoop = stunLoop;
    }

    setStageNum(stageNum) {
        this.stageNum = stageNum;
    }

    comeBackToPosition(collisonCheckX) {
        this.vel.moving = true;
        if(this.x < (this.xMax_left + this.xMax_right) / 2) { //왼쪽으로 벗어난 경우
            if (this.x != (this.xMax_left + this.xMax_right) / 2) { //가운데로 올 때까지 이동
                this.vel.lookingRight = true;
                collisonCheckX[this.x + 50] = -1;
                collisonCheckX[this.x + this.canvasLength - 49] = 1;
                this.x++;
            }
        }
        else if ((this.xMax_left + this.xMax_right) / 2 < this.x) {  // 오른쪽으로 벗어난 경우
            if (this.x != (this.xMax_left + this.xMax_right) / 2) { //가운데로 올 때까지 이동
                this.vel.lookingRight = false;
                collisonCheckX[this.x + 49] = 1;
                collisonCheckX[this.x + this.canvasLength - 50] = -1;
                this.x--;
            }
        }
    }

    stun() {
        this.vel.moving = false;
        if (this.stunCount < 120) {
            this.stunCount++;
        }
        else {
            this.stunned = false;
            this.stunCount = 0;
        }
    }

    zombieAttack(p1) { //매개변수가 너무 많이 들어가니까 오류가 뜸-> 매개변수의 수를 줄이니 오류 안뜸
        this.vel.moving = false;
        
        if (this.attackRandomNum >= 2) {// 9, 8, 7, 6, 5, 4, 3, 2 -> 일반 공격
            if (this.vel.lookingRight == true) { // 몬스터가 오른쪽 보고있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //오른쪽 공격 진행중. 공격범위 -> 120, 40프레임 소모
                    this.attackDone = false;
                    //공격 상자 늘리기 전에 플레이어들의 방어 확인
                    if (p1.vel.blocking == true && p1.vel.lookingRight == false && (this.attackBox.position_x + this.attackBox.atkTimer + 6) >= p1.BlockBox.x_left) { 
                        // 플레이어1의 왼쪽 방어가 먼저 활성화 되었을 때 -> 공격 막힘
                        this.waitCount = 0;
                        this.stunned = true;
                        this.vel.attacking = false;
                        this.attackBox.atkTimer = 0;
                        this.attackDone = true;
                    }
                    else {
                        if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                            this.waitCount++;
                        }
    
                        else if (this.waitCount == 60) {
                            if (this.attackCount >= 2) {
                                this.attackBox.atkTimer += 6;
                            }
                        }
    
    
                        if (collisonCheckX[this.attackBox.position_x + this.attackBox.atkTimer] == 0) { //공격이 플레이어에게 닿은 경우
                            //어느 플레이어에 닿았는지 확인해야 함
                            if (p1.x < this.attackBox.position_x + this.attackBox.atkTimer && this.attackBox.position_x + this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                                // 플레이어 1에 공격이 닿았을 경우
                                p1.damaged = true;
                            }
                        }
                    }
                }
    
                else { //공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
                    
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;
                    this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                }
            }
    
            else { //왼쪽을 보고 있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //왼쪽 공격 진행중
                    this.attackDone = false;
                    //공격 상자 늘리기 전에 플레이어의 방어 확인
                    if (p1.vel.blocking == true && p1.vel.lookingRight == true && (this.attackBox.position_x - this.attackBox.atkTimer - 6) <= p1.BlockBox.x_right) {
                        // 플레이어1의 오른쪽 방어가 먼저 활성화 되었을 때 -> 공격 막힘
                        this.waitCount = 0;
                        this.stunned = true;
                        this.vel.attacking = false;
                        this.attackBox.atkTimer = 0;
                        this.attackDone = true;
                    }
                    else {
                        if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                            this.waitCount++;
                        }
    
                        else if (this.waitCount == 60) {
                            if (this.attackCount >= 2) {
                                this.attackBox.atkTimer += 6;
                            }
                        }
                        
                        if (collisonCheckX[this.attackBox.position_x - this.attackBox.atkTimer] == 0) {//공격이 플레이어에게 닿은 경우
                            //어느 플레이어에 공격이 닿았는지 확인 해야함
                            if (p1.x < this.attackBox.position_x - this.attackBox.atkTimer && this.attackBox.position_x - this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                                // 플레이어 1에 공격이 닿았을 경우
                                p1.damaged = true;
                            }
                        }
                    }
                }
    
                else { //공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;
                    this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                }
            }
        }

        else if (this.attackRandomNum >= 0) { // 1, 0 -> 방어 불가 공격 
            if (this.vel.lookingRight == true) { // 몬스터가 오른쪽 보고있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //오른쪽 공격 진행중. 공격범위 -> 120, 40프레임 소모
                    this.attackDone = false;
                    //방어 확인 X
                    if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                        this.waitCount++;
                    }

                    else if (this.waitCount == 60) {
                        if (this.attackCount >= 2) {
                            this.attackBox.atkTimer += 6;
                        }
                    }


                    if (collisonCheckX[this.attackBox.position_x + this.attackBox.atkTimer] == 0) { //공격이 플레이어에게 닿은 경우
                        //어느 플레이어에 닿았는지 확인해야 함
                        if (p1.x < this.attackBox.position_x + this.attackBox.atkTimer && this.attackBox.position_x + this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                            // 플레이어 1에 공격이 닿았을 경우
                            p1.damaged = true;
                        }
                    }
                }
    
                else { //공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;
                    this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                }
            }
    
            else { //왼쪽을 보고 있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //왼쪽 공격 진행중
                    this.attackDone = false;
                    //방어 확인 X
                    if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                        this.waitCount++;
                    }

                    else if (this.waitCount == 60) {
                        if (this.attackCount >= 2) {
                            this.attackBox.atkTimer += 6;
                        }
                    }
                    
                    if (collisonCheckX[this.attackBox.position_x - this.attackBox.atkTimer] == 0) {//공격이 플레이어에게 닿은 경우
                        //어느 플레이어에 공격이 닿았는지 확인 해야함
                        if (p1.x < this.attackBox.position_x - this.attackBox.atkTimer && this.attackBox.position_x - this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                            // 플레이어 1에 공격이 닿았을 경우
                            p1.damaged = true;
                        }
                    }
                }
    
                else { //공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;
                    this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                }
            }
        }



        
    }

    move(bigX, smallX, collisonCheckX, currentStageNum) {
        //몹의 공격 범위 갱신
        this.x_detectLeft = this.x - 150;
        this.x_detectRight = this.x + this.canvasLength + 150;

        this.x_attackLeft = this.x + 10;
        this.x_attackRight = this.x + this.canvasLength - 10;

        this.attackBox.position_x = this.x + this.canvasLength / 2;

        if (this.stunned == true) { //공격이 막혀 잠시 스턴에 걸린 경우
            this.stun();
        }
         // 몹이 살아있고, 공격하고 있지 않고, 스턴에 걸리지 않은 상태이고, 현재 스테이지에 해당하면 움직임
        if (this.dead == false && this.vel.attacking == false && this.stunned == false && this.stageNum == currentStageNum) {
            for (var i = 0; i <= this.canvasLength - 100; i++) {
                collisonCheckX[this.x + 50 + i] = 1;
            }


             // 플레이어가 탐지 범위 안에 들어온 경우
            if((this.x_detectLeft <= bigX && bigX <= this.x + 50) || (this.x + this.canvasLength - 50 <= smallX && smallX <= this.x_detectRight)) { 
                //플레이어가 공격 범위 안에 들어온 경우
                if ((this.x_attackLeft <= bigX && bigX <= this.x + 50) || (this.x + this.canvasLength - 50 <= smallX && smallX <= this.x_attackRight)) {
                    
                    if (this.x_attackLeft <= bigX && bigX <= this.x + 100) { // 왼쪽 방향으로 감지 했을 경우
                        this.lookingRight == false;
                    }
                    else if (this.x + 100 <= smallX && smallX <= this.x_attackRight){ //오른쪽으로 감지 했을 경우
                        this.lookingRight == true;
                    }
                    this.vel.attacking = true; //공격 활성화

                }

                else { //탐지 범위 안에 들어왔지만 공격 범위는 아닌 경우 -> 플레이어 따라가기
                    if (this.x_detectLeft < bigX && bigX < this.x_attackLeft) { //왼쪽으로 이동
                        this.vel.moving = true;
                        this.vel.lookingRight = false;
                        collisonCheckX[this.x + 49] = 1;
                        collisonCheckX[this.x + this.canvasLength - 50] = -1;
                        this.x--;
                    }

                    else if (this.x_attackRight < smallX && smallX <= this.x_detectRight) { //오른쪽으로 이동
                        this.vel.moving = true;
                        this.vel.lookingRight = true;
                        collisonCheckX[this.x + 50] = -1;
                        collisonCheckX[this.x + this.canvasLength - 49] = 1;
                        this.x++;
                    }
                }
            }

            else if((this.x + 50 < this.xMax_left) || (this.xMax_right < this.x + this.canvasLength - 40)) {//지정된 구역을 벗어난 경우
                this.comeBackToPosition(collisonCheckX);
            }

            else { // 탐지가 된것도 아니고, 지정된 구역을 벗어난 경우도 아닌 경우 -> 일반 무작위 움직임
                this.isCommingBackToPosition = false;
                if (this.movingDone == true) { // 움직임이 끝난 상태일 때
                    if (this.moveCount < 90) {// 1.5초 동안 잠시 멈췄다가
                        this.vel.moving = false;
                        this.moveCount++;
                    }
                    
                    else { // 다시 움직임 재개
                        this.moveCount = 0;
                        this.move_randNum = Math.floor(Math.random() * this.move_range);
                        // floor -> 정수로 반올림, random -> 0~1사이 난수 발생 여기선 move_range만큼 곱해줌
            
                        this.movingDone = false;
                    }
        
                }
        
                else { //움직임이 끝나지 않았을 때
                    if (this.move_randNum <= 10 && this.moveCount < this.move_randNum) { //난수가 일정 수보다 작으면 가만히 서 있는 걸로
                        this.vel.moving = false;
                        this.moveCount+=this.speed;
                    }
        
                    else { //움직이는 경우

                        if ((this.move_randNum % 2 == 0) && this.moveCount < this.move_randNum) { //짝수인 경우 -> 오른쪽으로 이동
                            if (this.x + this.canvasLength + this.speed <= this.xMax_right) { //고정 범위 안에 있는 경우
                                this.vel.moving = true;
                                collisonCheckX[this.x + 50] = -1;
                                collisonCheckX[this.x + this.canvasLength -49] = 1;
                                this.vel.lookingRight = true;
                                this.x+=this.speed;
                                this.moveCount+=this.speed;
                            }
                            else { // 고정 범위 끝까지 간 경우 -> 움직임 마쳤다고 판단
                                this.vel.moving = false;
                                this.movingDone = true;
                            }
        
                        }
                        else if ((this.move_randNum % 2 == 1) && this.moveCount < this.move_randNum) {//홀수인 경우 -> 왼쪽으로 이동
                            //console.log(this.x - this.speed);
                            if (this.x - this.speed >= this.xMax_left) { //고정 범위 안에 있는 경우
                                this.vel.moving = true;
                                collisonCheckX[this.x + 49] = 1;
                                collisonCheckX[this.x + this.canvasLength - 50] = -1;
                                this.vel.lookingRight = false;
                                this.x-=this.speed;
                                this.moveCount+=this.speed;
                            }
                            else { // 고정 범위 끝까지 간 경우 -> 움직임 마쳤다고 판단
                                this.vel.moving = false;
                                this.movingDone = true;
                            }
                        }
        
                        else if (this.moveCount >= this.move_randNum) {
                            this.vel.moving = false;
                            this.movingDone = true;
                            this.moveCount = 0;
                        }
                    }
                }
            }
        }

        else if (this.dead == true) { //몹이 죽은 경우
            for (i = 0; i <= this.width; i++) {
                collisonCheckX[this.x + i] = -1;
            }
        }
    }

    checkAttacked(atkTimer_p1, collisonCheckX) {//공격이 해당 물체에 가해졌는지 확인
        if ((collisonCheckX[atkTimer_p1] == 1) && (this.x <= atkTimer_p1 && atkTimer_p1 <= this.x + this.canvasLength) && this.dead == false) {
            this.healthCount--;
            this.hitCheck = true;
            if (this.healthCount == 0) {
                //console.log('nz1 dead');
                this.vel.attacking = false;
                this.attackDone = true;
                this.dead = true;
            }
        }
    }

    updateAnimation(currentStageNum) {
        this.hitCheck = false;
        //NormalZombie 애니메이션 변수
        if (this.dead == false && this.stageNum == currentStageNum) {
            if (this.vel.moving == false) {
                //플레이어가 해당 몬스터의 공격을 막았을 경우
               if (this.stunned == true) {
                    this.attackFrame = 0;
                    this.attackCount = 0;
                   if (this.stunCount % 40 == 39) {
                       this.stunAnimaitonCount++;
                       this.stunAnimaitonCount = this.stunAnimaitonCount % this.stunLoop;
                   }
               }
               //텀이 지나고 다시 공격하는 경우
               else if (this.vel.attacking == true && this.waitCount == 60) {
                   if (this.attackFrame < 10) {
                        this.attackFrame++;
                   }
                   else if (this.attackFrame == 10) {
                        this.attackFrame = 0;
                        if (this.attackCount < this.attackLoop - 1) {
                            this.attackCount++;
                        }
                        else {
                            this.attackCount = 0;
                        }
                   }
               }
               //가만히 서 있는 경우
               else {
                   if(this.idleCount == 30) {
                       this.idleCount = 0;
                       this.idleCut++;
                       this.idleCut = this.idleCut % this.idleLoop;
                   }
                   this.idleCount++;
               }
           }
       
           else if (this.vel.moving == true) {
               if (this.walkingCount == 30) {
                   this.walkingCount = 0;
                   this.walkingCut++;
                   this.walkingCut = this.walkingCut % this.walkingLoop;
               }
               this.walkingCount++;
           }
        }
        else if (this.dead == true) {
            if (this.deathCount == 30 && this.deathCut < this.deathLoop) {
                this.deathCount = 0;
                this.deathCut++;
            }

            else if (this.deathCount < 30) {
                this.deathCount++;
            }
            
        }
    }
}

class RunningZombie extends NormalZombie {
    constructor(x, y, width, height, canvasLength) {
        super(x, y, width, height, canvasLength);
        this.stageNum = 2;
        this.running = false;
        this.grabbing = false;


        this.grabWaitCount = 0;
        //각 동작의 총 컷 수
        this.runningLoop = 6;
        this.deathLoop = 6;

        //각 동작의 현재 몇 번째 컷인지 알려주는 정보
        // this.idleCut = 0;
        // this.walkingCut = 0;
        // this.attackCut = 0;
        this.runningCut = 0;
        this.deathCut = 0;

        //각 동작의 현재 몇 번째 프레임인지 알려주는 정보
        // this.idleCount = 0;
        // this.walkingCount = 0;
        // this.attackCount = 0;

        this.runningCount = 0;
        this.deathCount = 0;
    }

    checkGrabbingCancelled(p1) {
        if (p1.grabbed == true) { //p1이 잡혀있는 경우
            if (p1.vel.interaction == true) { // p1이 interaction key를 누르고 있는 경우
                p1.interactionPressCount++;
            }

            if (p1.interactionPressCount >= 150 || p1.dead == true) { // p1이 2.5초동안 키 누르면 풀림
                p1.interactionPressCount = 0;
                this.grabbing = false;
                //몬스터 공격 정보 초기화
                this.grabWaitCount = 0;
                this.waitCount = 0;
                this.attackBox.atkTimer = 0;
                this.vel.attacking = false;
                this.attackDone = true;
                this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                
                p1.grabbed = false;

                if (p1.vel.lookingRight == true) { //플레이어가 왼쪽에서 잡혔을 경우
                    p1.x = this.x -this.canvasLength - 20;
                    p1.attackBox.position_x = p1.x + p1.canvasLength / 2;
                }

                else if (p1.vel.lookingRight == false) {//오른쪽에서 잡혔을 경우
                    p1.x = this.x + this.canvasLength + 20;
                    p1.attackBox.position_x = p1.x + p1.canvasLength / 2;
                }
            }
        }
    }

    zombieAttack(p1) { //매개변수가 너무 많이 들어가니까 오류가 뜸-> 매개변수의 수를 줄이니 오류 안뜸
        this.vel.moving = false;
        if (this.grabbing == true) {
            this.checkGrabbingCancelled(p1);
            if (this.grabWaitCount < 300) {
                this.grabWaitCount++;
            }
            else if (this.grabWaitCount == 300) { //5초가 지나면 데미지를 입힘
                this.grabWaitCount = 0;
                if (p1.grabbed == true) {
                    p1.healthCount--;
                    p1.checkIsDead();
                }
            }
        }

        
        else if (this.attackRandomNum >= 6 && this.grabbing == false) {// 9, 8, 7, 6 -> 일반 공격
            if (this.vel.lookingRight == true) { // 몬스터가 오른쪽 보고있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //오른쪽 공격 진행중. 공격범위 -> 120, 40프레임 소모
                    this.attackDone = false;
                    //공격 상자 늘리기 전에 플레이어들의 방어 확인
                    if (p1.vel.blocking == true && p1.vel.lookingRight == false && (this.attackBox.position_x + this.attackBox.atkTimer + 6) >= p1.BlockBox.x_left) { 
                        // 플레이어1의 왼쪽 방어가 먼저 활성화 되었을 때 -> 공격 막힘
                        this.waitCount = 0;
                        this.stunned = true;
                        this.vel.attacking = false;
                        this.attackBox.atkTimer = 0;
                        this.attackDone = true;
                    }
                    else {
                        if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                            this.waitCount++;
                        }
    
                        else if (this.waitCount == 60) {
                            if (this.attackCount >= 3) {
                                this.attackBox.atkTimer += 6;
                            }
                        }
    
    
                        if (collisonCheckX[this.attackBox.position_x + this.attackBox.atkTimer] == 0) { //공격이 플레이어에게 닿은 경우
                            //어느 플레이어에 닿았는지 확인해야 함
                            if (p1.x < this.attackBox.position_x + this.attackBox.atkTimer && this.attackBox.position_x + this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                                // 플레이어 1에 공격이 닿았을 경우
                                p1.damaged = true;
                            }
                        }
                    }
                }
    
                else { //공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
                    
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;
                    this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                }
            }
    
            else { //왼쪽을 보고 있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //왼쪽 공격 진행중
                    this.attackDone = false;
                    //공격 상자 늘리기 전에 플레이어의 방어 확인
                    if (p1.vel.blocking == true && p1.vel.lookingRight == true && (this.attackBox.position_x - this.attackBox.atkTimer - 6) <= p1.BlockBox.x_right) {
                        // 플레이어1의 오른쪽 방어가 먼저 활성화 되었을 때 -> 공격 막힘
                        this.waitCount = 0;
                        this.stunned = true;
                        this.vel.attacking = false;
                        this.attackBox.atkTimer = 0;
                        this.attackDone = true;
                    }
                    else {
                        if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                            this.waitCount++;
                        }
    
                        else if (this.waitCount == 60) {
                            if (this.attackCount >= 3) {
                                this.attackBox.atkTimer += 6;   
                            }
                        }
                        
                        if (collisonCheckX[this.attackBox.position_x - this.attackBox.atkTimer] == 0) {//공격이 플레이어에게 닿은 경우
                            //어느 플레이어에 공격이 닿았는지 확인 해야함
                            if (p1.x < this.attackBox.position_x - this.attackBox.atkTimer && this.attackBox.position_x - this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                                // 플레이어 1에 공격이 닿았을 경우
                                p1.damaged = true;
                            }
                        }
                    }
                }
    
                else { //공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;
                    this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                }
            }
        }

        else if (this.attackRandomNum < 6 && this.grabbing == false) { // 5, 4, 3, 2, 1, 0 -> 잡기 공격 
            if (this.vel.lookingRight == true) { // 몬스터가 오른쪽 보고있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //오른쪽 공격 진행중. 공격범위 -> 120, 40프레임 소모
                    this.attackDone = false;
                    //방어 확인 X
                    if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                        this.waitCount++;
                    }

                    else if (this.waitCount == 60) {
                        if (this.attackCount >= 3) {
                            this.attackBox.atkTimer += 6;
                        }
                    }


                    if (collisonCheckX[this.attackBox.position_x + this.attackBox.atkTimer] == 0) { //잡기 공격이 플레이어에게 닿은 경우 -> 먼저 닿은 플레이어만 잡힘
                        //어느 플레이어에 닿았는지 확인해야 함
                        if (p1.x < this.attackBox.position_x + this.attackBox.atkTimer && this.attackBox.position_x + this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                            // 플레이어 1에 공격이 닿았을 경우
                            this.waitCount = 0;
                            p1.grabbed = true;
                            p1.vel.lookingRight = false; //캐릭터는 왼쪽을 향함
                            p1.x = this.x + 50;
                            this.grabbing = true;
                        }
                    }
                }
    
                else { //공격 종료
                    if (this.grabbing == false) {
                        this.attackDone = true;
                        //몬스터 공격 정보 초기화
                        this.waitCount = 0;
                        this.attackBox.atkTimer = 0;
                        this.vel.attacking = false;
                        this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                    }
                }
            }
    
            else { //왼쪽을 보고 있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //왼쪽 공격 진행중
                    this.attackDone = false;
                    //방어 확인 X
                    if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                        this.waitCount++;
                    }

                    else if (this.waitCount == 60) {
                        if (this.attackCount >= 3) {
                            this.attackBox.atkTimer += 6;
                        }
                    }
                    
                    if (collisonCheckX[this.attackBox.position_x - this.attackBox.atkTimer] == 0) {//잡기 공격이 플레이어에게 닿은 경우 -> 먼저 잡힌 플레이어만
                        //어느 플레이어에 공격이 닿았는지 확인 해야함
                        if (p1.x < this.attackBox.position_x - this.attackBox.atkTimer && this.attackBox.position_x - this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                            // 플레이어 1에 공격이 닿았을 경우
                            this.waitCount = 0;
                            p1.grabbed = true;
                            p1.vel.lookingRight = true; // 캐릭터는 오른쪽을 향함
                            p1.x = this.x - 50;
                            this.grabbing = true;
                        }
                    }
                }
    
                else { //공격 종료
                    if (this.grabbing == false) {
                        this.attackDone = true;
                        //몬스터 공격 정보 초기화
                        this.waitCount = 0;
                        this.attackBox.atkTimer = 0;
                        this.vel.attacking = false;
                        this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                    }
                }
            }
        }
        
    }

    move(bigX, smallX, collisonCheckX, currentStageNum) {
        
        //몹의 공격 범위 갱신
        this.x_detectLeft = this.x - 150;
        this.x_detectRight = this.x + this.canvasLength + 150;

        this.x_attackLeft = this.x + 10;
        this.x_attackRight = this.x + this.canvasLength - 10;

        this.attackBox.position_x = this.x + this.canvasLength / 2;

        if (this.stunned == true) { //공격이 막혀 잠시 스턴에 걸린 경우
            this.stun();
        }
        // 몹이 살아있고, 공격하고 있지 않고, 스턴에 걸리지 않은 상태이고, 현재 스테이지에 해당한다면 움직임
        if (this.dead == false && this.vel.attacking == false && this.stunned == false && this.stageNum == currentStageNum) { 
            for (var i = 0; i <= this.canvasLength - 100; i++) {
                collisonCheckX[this.x + 50 + i] = 1;
            }
            

             // 플레이어가 탐지 범위 안에 들어온 경우
            if((this.x_detectLeft <= bigX && bigX <= this.x + this.canvasLength) || (this.x <= smallX && smallX <= this.x_detectRight)) { 
                //플레이어가 공격 범위 안에 들어온 경우

                if ((this.x_attackLeft <= bigX && bigX <= this.x + this.canvasLength) || (this.x <= smallX && smallX <= this.x_attackRight)) {
                    this.vel.attacking = true; //공격 활성화
                    
                    if (this.x_attackLeft <= bigX && bigX <= this.x + this.canvasLength) { // 왼쪽 방향으로 감지 했을 경우
                        this.vel.lookingRight = false;
                    }
                    else if (this.x <= smallX && smallX <= this.x_attackRight){ //오른쪽으로 감지 했을 경우
                        this.vel.lookingRight = true;
                    }
                    
                    this.running = false;
                }

                else { //탐지 범위 안에 들어왔지만 공격 범위는 아닌 경우 -> 플레이어 따라가기 / 뛰는 좀비는 속도 4
                    if (this.x_detectLeft < bigX && bigX < this.x_attackLeft) { //왼쪽으로 이동
                        this.vel.moving = true;
                        this.vel.lookingRight = false;
                        this.running = true;
                        collisonCheckX[this.x + 49] = 1;
                        collisonCheckX[this.x + 48] = 1;
                        collisonCheckX[this.x + 47] = 1;
                        collisonCheckX[this.x + 46] = 1;
                        collisonCheckX[this.x + this.canvasLength - 50] = -1;
                        collisonCheckX[this.x + this.canvasLength - 51] = -1;
                        collisonCheckX[this.x + this.canvasLength - 52] = -1;
                        collisonCheckX[this.x + this.canvasLength - 53] = -1;
                        this.x-=4;
                    }

                    else if (this.x_attackRight < smallX && smallX <= this.x_detectRight) { //오른쪽으로 이동
                        this.vel.moving = true;
                        this.vel.lookingRight = true;
                        this.running = true;
                        collisonCheckX[this.x + 50] = -1;
                        collisonCheckX[this.x + 51] = -1;
                        collisonCheckX[this.x + 52] = -1;
                        collisonCheckX[this.x + 53] = -1;
                        collisonCheckX[this.x + this.canvasLength - 49] = 1;
                        collisonCheckX[this.x + this.canvasLength - 48] = 1;
                        collisonCheckX[this.x + this.canvasLength - 47] = 1;
                        collisonCheckX[this.x + this.canvasLength - 46] = 1;
                        this.x+=4;
                    }
                }
            }

            else if((this.x + 50 < this.xMax_left) || (this.xMax_right < this.x + this.canvasLength - 50)) {//지정된 구역을 벗어난 경우
                this.running = false;
                this.comeBackToPosition(collisonCheckX);
            }

            else { // 탐지가 된것도 아니고, 지정된 구역을 벗어난 경우도 아닌 경우 -> 일반 무작위 움직임
                this.isCommingBackToPosition = false;
                this.running = false;
                if (this.movingDone == true) { // 움직임이 끝난 상태일 때
                    if (this.moveCount < 90) {// 1.5초 동안 잠시 멈췄다가
                        this.vel.moving = false;
                        this.moveCount++;
                    }
                    
                    else { // 다시 움직임 재개
                        this.moveCount = 0;
                        this.move_randNum = Math.floor(Math.random() * this.move_range);
                        // floor -> 정수로 반올림, random -> 0~1사이 난수 발생 여기선 move_range만큼 곱해줌
            
                        this.movingDone = false;
                    }
        
                }
        
                else { //움직임이 끝나지 않았을 때
                    if (this.move_randNum <= 10 && this.moveCount < this.move_randNum) { //난수가 일정 수보다 작으면 가만히 서 있는 걸로
                        this.vel.moving = false;
                        this.moveCount+=this.speed;
                    }
        
                    else { //움직이는 경우

                        if ((this.move_randNum % 2 == 0) && this.moveCount < this.move_randNum) { //짝수인 경우 -> 오른쪽으로 이동
                            if (this.x + this.canvasLength + this.speed <= this.xMax_right) { //고정 범위 안에 있는 경우
                                this.vel.moving = true;
                                collisonCheckX[this.x + 50] = -1;
                                collisonCheckX[this.x + this.canvasLength -49] = 1;
                                this.vel.lookingRight = true;
                                this.x+=this.speed;
                                this.moveCount+=this.speed;
                            }
                            else { // 고정 범위 끝까지 간 경우 -> 움직임 마쳤다고 판단
                                this.vel.moving = false;
                                this.movingDone = true;
                            }
        
                        }
                        else if ((this.move_randNum % 2 == 1) && this.moveCount < this.move_randNum) {//홀수인 경우 -> 왼쪽으로 이동
                            //console.log(this.x - this.speed);
                            if (this.x - this.speed >= this.xMax_left) { //고정 범위 안에 있는 경우
                                this.vel.moving = true;
                                collisonCheckX[this.x + 49] = 1;
                                collisonCheckX[this.x + this.canvasLength - 50] = -1;
                                this.vel.lookingRight = false;
                                this.x-=this.speed;
                                this.moveCount+=this.speed;
                            }
                            else { // 고정 범위 끝까지 간 경우 -> 움직임 마쳤다고 판단
                                this.vel.moving = false;
                                this.movingDone = true;
                            }
                        }
        
                        else if (this.moveCount >= this.move_randNum) {
                            this.vel.moving = false;
                            this.movingDone = true;
                            this.moveCount = 0;
                        }
                    }
                }
            }
        }

        else if (this.dead == true) { //몹이 죽은 경우
            for (i = 0; i <= this.width; i++) {
                collisonCheckX[this.x + i] = -1;
            }
        }
    }

    updateAnimation(currentStageNum) {
        this.hitCheck = false;
        //RunningZombie 애니메이션 변수
        if (this.dead == false && this.stageNum == currentStageNum) {
            if (this.vel.moving == false) {
                //플레이어가 해당 몬스터의 공격을 막았을 경우
               if (this.stunned == true) {
                    this.attackFrame = 0;
                    this.attackCount = 0;
                   if (this.stunCount % 40 == 39) {
                       this.stunAnimaitonCount++;
                       this.stunAnimaitonCount = this.stunAnimaitonCount % this.stunLoop;
                   }
               }





               //텀이 지나고 다시 공격하는 경우
               else if (this.vel.attacking == true && this.waitCount == 60 && this.grabbing == false) {
                   if (this.attackFrame < 8) {
                        this.attackFrame++;
                   }
                   else if (this.attackFrame == 8) {
                        this.attackFrame = 0;
                        if (this.attackCount < this.attackLoop - 1) {
                            this.attackCount++;
                        }
                        else {
                            this.attackCount = 0;
                        }
                   }
               }
               //가만히 서 있는 경우
               else {
                this.attackFrame = 0;
                this.attackCount = 0;
                   if(this.idleCount == 30) {
                       this.idleCount = 0;
                       this.idleCut++;
                       this.idleCut = this.idleCut % this.idleLoop;
                   }
                   this.idleCount++;
               }
           }
       
           else if (this.vel.moving == true) { //움직이는 경우
                if (this.running == false) {//걷는 경우
                    if (this.walkingCount == 30) {
                        this.walkingCount = 0;
                        this.walkingCut++;
                        this.walkingCut = this.walkingCut % this.walkingLoop;
                    }
                    this.walkingCount++;
                }
                else { //뛰는 경우 -> 0.2초마다 한 컷 -> 12프레임 마다 한 컷
                    if (this.runningCount == 12) {
                        this.runningCount = 0;
                        this.runningCut++;
                        this.runningCut = this.runningCut % this.runningLoop;
                    }
                    this.runningCount++;
                }
           }
        }
        else if (this.dead == true) {
            if (this.deathCount == 30 && this.deathCut < this.deathLoop) {
                this.deathCount = 0;
                this.deathCut++;
            }
            else if (this.deathCount < 30) {
                this.deathCount++;
            }
        }
    }

}

class CrawlingZombie extends NormalZombie {
    constructor(x, y, width, height, canvasLength) {
        super(x, y, width, height, canvasLength);
        this.stageNum = 3;

        this.rangedAttack_left = this.x - 400;
        this.rangedAttack_right = this.x + this.canvasLength + 400;
        this.spitting = false;



        this.rangedAttackWaitCount = 0;
        this.rangedAttackDelay = 0;// 원거리 공격이 유효해지는 시간 -> 0.5초
        this.rangedAttackTarget = 0; //목표 지점

        this.rangedWaitCount = 0; // 원거리 공격에서 쓰는 waitCount
        this.rangedAttackDone = true;

        //각 동작의 총 컷 수
        this.spittingLoop = 6;
        this.deathLoop = 6;
        this.poisonFallingLoop = 4;

        //각 동작의 현재 몇 번째 컷인지 알려주는 정보
        // this.idleCut = 0;
        // this.walkingCut = 0;
        // this.attackCut = 0;
        this.spittingCut = 0;
        this.deathCut = 0;
        this.poisonFallingCut = 0;

        //각 동작의 현재 몇 번째 프레임인지 알려주는 정보
        // this.idleCount = 0;
        // this.walkingCount = 0;
        // this.attackCount = 0;

        this.spittingCount = 0;
        this.deathCount = 0;
        this.poisonFallingCount = 0;

        //타겟 확인용 bigX, smallX
        this.bigX = 0;
        this.smallX = 0;

        //임시 로그 확인용 변수
        this.testVariable = false;
    }

    checkBigXSmallX(p1) {
    
        this.bigX = p1.x + p1.canvasLength - 40;
        this.smallX = p1.x + 40;
    }
    checkRangedAttack(p1) {
        //p1이 맞은 경우
        if (p1.x + 40 < this.rangedAttackTarget && this.rangedAttackTarget < p1.x + p1.canvasLength - 40) {
            p1.damaged = true;
        }
    }

    zombieAttack(p1) {
        this.attackDone = false;
        this.checkBigXSmallX(p1);
        if ((this.bigX >= this.rangedAttack_left && this.bigX <= this.x + 100) || this.rangedAttackDone == false) { //왼쪽으로 공격 하는 경우
            this.vel.lookingRight = false;
            //원거리 공격
            if ((this.bigX >= this.rangedAttack_left && this.bigX < this.x_attackLeft) || this.rangedAttackDone == false) {
                this.rangedAttackDone = false;
                this.spitting = true;
                if (this.rangedAttackWaitCount < 150 && this.rangedAttackWaitCount != 60) {
                    this.rangedAttackWaitCount++;
                }
                else if (this.rangedAttackWaitCount == 60) {
                    this.rangedAttackTarget = this.bigX - 60;// 대상 플레이어 가운데 지점
                    this.rangedAttackWaitCount++;
                }
                else if (this.rangedAttackWaitCount == 150) { //원거리 공격 활성화
                    if (this.rangedAttackDelay < 30) {
                        this.rangedAttackDelay++;
                        this.checkRangedAttack(p1);
                    }
                    else if (this.rangedAttackDelay == 30) {// 원거리 공격 종료
                        this.attackDone = true;
                        this.rangedAttackDone = true;
                        this.rangedAttackWaitCount = 0;
                        this.rangedAttackDelay = 0;
                        this.vel.attacking = false;
                        this.spitting = false;
                        this.rangedAttackTarget = 0;
                        if (p1.damaged == true) {
                            p1.healthCount--;
                            p1.checkIsDead();
                        }
                    }
                }
            }
            //근거리 공격 -> 120범위. 총 4컷 중 후반 2컷부분 유효타
            else if (this.x_attackLeft <= this.bigX && this.bigX <= this.x + 100 && this.rangedAttackDone == true) {
                this.testVariable = true;
                this.spitting = false;
                if (this.attackBox.atkTimer <= this.attackBox.width) { //왼쪽 공격 진행중
                    this.attackDone = false;
                    //공격 상자 늘리기 전에 플레이어의 방어 확인
                    if (p1.vel.blocking == true && p1.vel.lookingRight == true && (this.attackBox.position_x - this.attackBox.atkTimer - 6) <= p1.BlockBox.x_right) {
                        // 플레이어1의 오른쪽 방어가 먼저 활성화 되었을 때 -> 공격 막힘
                        this.waitCount = 0;
                        this.stunned = true;
                        this.vel.attacking = false;
                        this.attackBox.atkTimer = 0;
                        this.attackDone = true;
                    }
                    else {
                        if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                            this.waitCount++;
                        }
    
                        else if (this.waitCount == 60) {
                            if (this.attackCount >= 2) {
                                this.attackBox.atkTimer += 6;
                            }
                        }
                        
                        if (collisonCheckX[this.attackBox.position_x - this.attackBox.atkTimer] == 0) {//공격이 플레이어에게 닿은 경우
                            //어느 플레이어에 공격이 닿았는지 확인 해야함
                            if (p1.x < this.attackBox.position_x - this.attackBox.atkTimer && this.attackBox.position_x - this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                                // 플레이어 1에 공격이 닿았을 경우
                                p1.damaged = true;
                            }
                        }
                    }
                }
    
                else { //공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;

                    this.testVariable = false;
                }

            }

        }
        else if (this.x + 100 < this.smallX && this.smallX <= this.x_attackRight) { // 오른쪽 공격
            this.vel.lookingRight = true;
            //원거리 공격
            if (this.x_attackRight < this.smallX && this.smallX <= this.rangedAttack_right) {
                this.spitting = true;
                if (this.rangedAttackWaitCount < 150 && this.rangedAttackWaitCount != 60) {
                    this.rangedAttackWaitCount++;
                }
                else if (this.rangedAttackWaitCount == 60) {
                    this.rangedAttackTarget = this.smallX + 60;// 대상 플레이어 가운데 지점
                    this.rangedAttackWaitCount++;
                }
                else if (this.rangedAttackWaitCount == 150) { //원거리 공격 활성화
                    if (this.rangedAttackDelay < 30) {
                        this.rangedAttackDelay++;
                        this.checkRangedAttack(p1);
                    }
                    else if (this.rangedAttackDelay == 30) {// 원거리 공격 종료
                        this.rangedAttackDone = true;
                        this.rangedAttackWaitCount = 0;
                        this.rangedAttackDelay = 0;
                        this.vel.attacking = false;
                        this.spitting = false;
                        this.rangedAttackTarget = 0;
                        if (p1.damaged == true) {
                            p1.healthCount--;
                            p1.checkIsDead();
                        }
                    }
                }
            }
            //근거리 공격
            else if (this.x + 100 <= this.smallX && this.smallX <= this.x_attackRight && this.rangedAttackDone == true) {
                this.spitting = false;
                if (this.attackBox.atkTimer <= this.attackBox.width) { //오른쪽 공격 진행중. 공격범위 -> 120, 40프레임 소모
                    this.attackDone = false;
                    //공격 상자 늘리기 전에 플레이어들의 방어 확인
                    if (p1.vel.blocking == true && p1.vel.lookingRight == false && (this.attackBox.position_x + this.attackBox.atkTimer + 6) >= p1.BlockBox.x_left) { 
                        // 플레이어1의 왼쪽 방어가 먼저 활성화 되었을 때 -> 공격 막힘
                        this.waitCount = 0;
                        this.stunned = true;
                        this.vel.attacking = false;
                        this.attackBox.atkTimer = 0;
                        this.attackDone = true;
                    }
                    else {
                        if (this.waitCount < 60) { //몬스터가 공격 하기 전 잠깐 주는 텀
                            this.waitCount++;
                        }
    
                        else if (this.waitCount == 60) {
                            if (this.attackCount >= 2) {
                                this.attackBox.atkTimer += 6;
                            }
                        }
    
    
                        if (collisonCheckX[this.attackBox.position_x + this.attackBox.atkTimer] == 0) { //공격이 플레이어에게 닿은 경우
                            //어느 플레이어에 닿았는지 확인해야 함
                            if (p1.x < this.attackBox.position_x + this.attackBox.atkTimer && this.attackBox.position_x + this.attackBox.atkTimer < p1.x + p1.canvasLength) {
                                // 플레이어 1에 공격이 닿았을 경우
                                p1.damaged = true;
                            }
                        }
                    }
                }
    
                else { //공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;
                }

            }
        }
    }

    move(bigX, smallX, collisonCheckX, currentStageNum) {
        this.checkBigXSmallX(p1);
        this.rangedAttack_left = this.x - 400;
        this.rangedAttack_right = this.x + this.canvasLength + 400;

        this.x_attackLeft = this.x + 10;
        this.x_attackRight = this.x + this.canvasLength - 10;

        this.attackBox.position_x = this.x + this.canvasLength / 2;

        if (this.stunned == true) { //공격이 막혀 잠시 스턴에 걸린 경우
            this.stun();
        }
        // 몹이 살아있고, 공격하고 있지 않고, 스턴에 걸리지 않은 상태이고, 현재 스테이지에 해당한다면 움직임
        if (this.dead == false && this.vel.attacking == false && this.stunned == false && this.stageNum == currentStageNum) { 
            for (var i = 0; i <= this.canvasLength - 100; i++) {
                if (this.x > 0) {
                    collisonCheckX[this.x + 50 + i] = 1;
                }
            }

            if ((bigX >= this.rangedAttack_left && bigX <= this.x + 100) || (smallX <= this.rangedAttack_right && smallX >= this.x + 100)) { //(원거리)공격 범위 내 플레이어가 들어온 경우
                this.vel.attacking = true;
                this.vel.moving = false;
            }

            else { // 이 좀비는 플레이어를 따라가지 않음. 공격 이외에는 그냥 무작위 움직임
                if (this.movingDone == true) { // 움직임이 끝난 상태일 때
                    if (this.moveCount < 90) {// 1.5초 동안 잠시 멈췄다가
                        this.vel.moving = false;
                        this.moveCount++;
                    }
                    
                    else { // 다시 움직임 재개
                        this.moveCount = 0;
                        this.move_randNum = Math.floor(Math.random() * this.move_range);
                        // floor -> 정수로 반올림, random -> 0~1사이 난수 발생 여기선 move_range만큼 곱해줌
            
                        this.movingDone = false;
                    }
        
                }
        
                else { //움직임이 끝나지 않았을 때
                    if (this.move_randNum <= 10 && this.moveCount < this.move_randNum) { //난수가 일정 수보다 작으면 가만히 서 있는 걸로
                        this.vel.moving = false;
                        this.moveCount+=this.speed;
                    }
        
                    else { //움직이는 경우

                        if ((this.move_randNum % 2 == 0) && this.moveCount < this.move_randNum) { //짝수인 경우 -> 오른쪽으로 이동
                            if (this.x + this.canvasLength + this.speed <= this.xMax_right) { //고정 범위 안에 있는 경우
                                this.vel.moving = true;
                                if (this.x > 0) {
                                    collisonCheckX[this.x + 50] = -1;
                                    collisonCheckX[this.x + this.canvasLength -49] = 1;
                                }
                                
                                this.vel.lookingRight = true;
                                this.x+=this.speed;
                                this.moveCount+=this.speed;
                            }
                            else { // 고정 범위 끝까지 간 경우 -> 움직임 마쳤다고 판단
                                this.vel.moving = false;
                                this.movingDone = true;
                            }
        
                        }
                        else if ((this.move_randNum % 2 == 1) && this.moveCount < this.move_randNum) {//홀수인 경우 -> 왼쪽으로 이동
                            //console.log(this.x - this.speed);
                            if (this.x - this.speed >= this.xMax_left) { //고정 범위 안에 있는 경우
                                this.vel.moving = true;
                                if (this.x > 0) {
                                    collisonCheckX[this.x + 49] = 1;
                                    collisonCheckX[this.x + this.canvasLength - 50] = -1;
                                }
                                this.vel.lookingRight = false;
                                this.x-=this.speed;
                                this.moveCount+=this.speed;
                            }
                            else { // 고정 범위 끝까지 간 경우 -> 움직임 마쳤다고 판단
                                this.vel.moving = false;
                                this.movingDone = true;
                            }
                        }
        
                        else if (this.moveCount >= this.move_randNum) {
                            this.vel.moving = false;
                            this.movingDone = true;
                            this.moveCount = 0;
                        }
                    }
                }
            }
        }
        else if (this.dead == true) { //몹이 죽은 경우
            for (i = 0; i <= this.width; i++) {
                collisonCheckX[this.x + i] = -1;
            }
        }
    }
    updateAnimation(currentStageNum) {
        this.hitCheck = false;
        //crawlingZombie 애니메이션 변수
        if (this.dead == false && this.stageNum == currentStageNum) {
            if (this.rangedAttackWaitCount >= 140) {// 투사체 떨어지는 부분. 실질적으로 데미지 입는 시간은 rangedAttackWaitCount 150부터
                if (this.poisonFallingCount == 10) {
                    this.poisonFallingCut++;
                    this.poisonFallingCount = 0;
                    if (this.poisonFallingCut == 4) {
                        this.poisonFallingCut = 0;
                    }
                }
                else {
                    this.poisonFallingCount++;
                }
            }
            if (this.vel.moving == false) {
                //플레이어가 해당 몬스터의 공격을 막았을 경우
               if (this.stunned == true) {
                    this.attackFrame = 0;
                    this.attackCount = 0;
                   if (this.stunCount % 40 == 39) {
                       this.stunAnimaitonCount++;
                       this.stunAnimaitonCount = this.stunAnimaitonCount % this.stunLoop;
                   }
               }
               //텀이 지나고 다시 공격하는 경우
               else if (this.spitting == true) { // 원거리 공격
                    if (this.rangedAttackWaitCount >= 60 && this.rangedAttackWaitCount <= 90) {
                        if (this.spittingCount == 10) {
                            this.spittingCount = 0;
                            this.spittingCut++;
                            if (this.spittingCut == 3) {
                                this.spittingCut = 0;
                            }
                        }
                        else {
                            this.spittingCount++;
                        }

                    }
               }

               else if (this.vel.attacking == true && this.waitCount == 60 && this.spitting == false) { // 근거리 공격
                   if (this.attackFrame < 10) {
                        this.attackFrame++;
                   }
                   else if (this.attackFrame == 10) {
                        this.attackFrame = 0;
                        if (this.attackCount < this.attackLoop - 1) {
                            this.attackCount++;
                        }
                        else {
                            this.attackCount = 0;
                        }
                   }
               }
               //가만히 서 있는 경우
               else {
                   if(this.idleCount == 30) {
                       this.idleCount = 0;
                       this.idleCut++;
                       this.idleCut = this.idleCut % this.idleLoop;
                   }
                   this.idleCount++;
               }
           }
       
           else if (this.vel.moving == true) { //움직이는 경우
                if (this.walkingCount == 30) {
                    this.walkingCount = 0;
                    this.walkingCut++;
                    this.walkingCut = this.walkingCut % this.walkingLoop;
                }
                this.walkingCount++;
           }
        }
        else if (this.dead == true) {
            if (this.deathCount == 30 && this.deathCut < this.deathLoop) {
                this.deathCount = 0;
                this.deathCut++;
            }
            else if (this.deathCount < 30) {
                this.deathCount++;
            }
        }
    }
}

class BossZombie extends NormalZombie {
    constructor(x, y, width, height, canvasLength) {
        super(x, y, width, height, canvasLength);

        this.centerPoint = this.x + this.canvasLength / 2;

        //움직임 관련 변수
        this.distanceOfSmallX = 0;
        this.distanceOfBigX = 0;

        this.flying = false;
        this.moveWaitCount = 0; //움직일 때 1초 측정
        this.moveRandNum = 0; // 1초마다 갱신되는 난수. 공중 이동, 일반 이동 결정하는 요인

        this.jumpCount = 0;
        this.delayCount = 0;
        this.fallingCount = 0;
        this.fallingWarningCount = 0;
        this.fallingTargetPoint = 0; //착지 지점
        this.fallingTargetRandNum = 0;

        //공격 관련 변수
        this.blockStayedP1 = false; // 플레이어가 방어 유지 했는지 확인

        this.comboAttackMax = 3;
        this.comboAttackTime = 0;

        //애니메이션 변수

        //Loop
        this.walkingLoop = 4;
        this.idleLoop = 4;
        this.deathLoop = 9;
        this.attackLoop = 4;
        this.comboAttackLoop = 12;
        this.jumpLoop = 4;
        this.landLoop = 6;

        //Cut
        this.walkingCut = 0;
        this.idleCut = 0;
        this.deathCut = 0;
        this.attackCut = 0;
        this.comboAttackCut = 0;
        this.jumpCut = 0;
        this.landCut = 0;

        //Count
        this.walkingCount = 0;
        this.idleCount = 0;
        this.attackCount = 0;
        this.deathCount = 0;
        this.comboAttackCount = 0;
        //점프와 착지는 위 Count사용


        this.attackBox.width = 160;
        this.healthMax = 7;
        this.healthCount = 7;
        this.stageNum = 6;
    }

    checkDistance(bigX, smallX) {
        this.distanceOfSmallX = Math.abs(this.centerPoint - smallX);
        this.distanceOfBigX = Math.abs(this.centerPoint - bigX);
    }

    flyToTarget(p1) {
        if (this.jumpCount == 0) {
            for (var i = 0; i <= this.canvasLength - 100; i++) { // 점프 하는 자리 없는 걸로 취급
                collisonCheckX[this.x + 50 + i] = -1;
            }
        }
        if (this.jumpCount < 60) {//1초동안 점프
            this.jumpCount++;
        }

        else if (this.jumpCount == 60) {
            if (this.delayCount < 60) { //1초동안 딜레이
                this.delayCount++;
            }

            else if (this.delayCount == 60) {
                //플레이어1에게만 타겟 지정
                //타겟 지정 한 번 하면 안바뀜
                if (this.fallingWarningCount == 0) {
                    this.fallingWarningCount++;
                    this.fallingTargetPoint = p1.x + p1.canvasLength / 2; //p1에게 타겟 지정
                    this.x = this.fallingTargetPoint - (this.canvasLength / 2); //위치 갱신
                }

                else if (this.fallingWarningCount > 0 && this.fallingWarningCount < 150) { //2.5초동안 경고 표시
                    this.fallingWarningCount++;
                }
                else if (this.fallingWarningCount == 150) {
                    if (this.fallingCount < 30) {
                        this.fallingCount++;
                    }
                    else if (this.fallingCount == 30) {//착륙 완료. 플레이어가 데미지 입었는지 확인 해야함.
                        
                        for (var i = 0; i <= this.canvasLength - 100; i++) { // 착지하는 자리에 좌표 갱신
                            collisonCheckX[this.x + 50 + i] = 1;
                        }
                    
                        if (p1.x + 50 <= this.fallingTargetPoint && this.fallingTargetPoint <= p1.x + p1.canvasLength - 50) { // p1이 착륙지점에 있었을 때
                            p1.damaged = true;
                            p1.healthCount--;
                            p1.checkIsDead();
                            if(p1.x + p1.canvasLength / 2 <= this.fallingTargetPoint) { //왼쪽으로 밀려나는 경우 
                                if (p1.x - 300 < 1) {// 맵 왼쪽 끝보다 더 멀리 밀리는 경우 -> 반대방향으로 이동
                                    p1.x += 350; //원래는 300 밀려야 되는데 반대 방향이라 50추가
                                }
                                else {
                                    p1.x -= 300;
                                }
                            }
                            else {//오른쪽으로 밀려나는 경우
                                if (p1.x + p1.canvasLength + 300 > 1910) { //맵 오른쪽 끝보다 더 멀리 밀리는 경우 -> 반대 방향으로 이동
                                    p1.x -= 350;//원래는 300 밀려야 되는데 반대 방향이라 50추가
                                }
                                else {
                                    p1.x += 300;
                                }
                            }
                        }

                        this.fallingCount++;

                    }
                    else if (this.fallingCount > 30 && this.fallingCount < 90) { // 착지 완료 후 1초 딜레이
                        this.fallingCount++;
                    }

                    else if (this.fallingCount == 90) {
                        this.flying = false;
                        this.jumpCount = 0;
                        this.delayCount = 0;
                        this.fallingWarningCount = 0;
                        this.fallingCount = 0;
                        this.moveRandNum = Math.floor(Math.random() * 10); //0~9 사이 난수 발생
                    }

                }
            }
        }
    }

    updateMoveRandNum() {
        if (this.moveWaitCount < 60) {
            this.moveWaitCount++;
            return this.moveRandNum;
        }
        else if (this.moveWaitCount == 60) {
            this.moveWaitCount = 0;
            return Math.floor(Math.random() * 10); //0~9 사이 난수 발생
        }
    }

    zombieAttack(p1) {
        this.vel.moving = false;
        if (this.attackRandomNum <= 6) {// 0, 1, 2, 3, 4, 5, 6 -> 일반 공격
            if (this.vel.lookingRight == true) { //오른쪽 보고 있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //오른쪽 공격 진행중. 공격 범위 -> 160, 40프레임
                    this.attackDone = false;
                    if (this.waitCount < 120) {
                        this.waitCount++;
                    }
                    else if (this.waitCount == 120) {
                        if (this.attackCut >= 2) { // 플레이어 방어 확인. 보스는 스턴 모션 없음
                            this.attackBox.atkTimer += 8;

                            if (p1.vel.blocking == true && p1.vel.lookingRight == false ) {
                                this.blockStayedP1 = true;
                            }
                            else if (p1.vel.blocking == false) {
                                this.blockStayedP1 = false;
                            }
                        }

                        if (collisonCheckX[this.attackBox.position_x + this.attackBox.atkTimer] == 0) {
                            if (p1.x < this.attackBox.position_x + this.attackBox.atkTimer && this.attackBox.position_x + this.attackBox.atkTimer < p1.x + p1.canvasLength && this.blockStayedP1 == false) {
                                p1.damaged = true;
                            }
                        }
                    }

                }
                else { // 공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;
                    this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                }
            }
            else {//왼쪽 보고 있는 경우
                if (this.attackBox.atkTimer <= this.attackBox.width) { //왼쪽 공격 진행중. 공격 범위 -> 160, 40프레임
                    this.attackDone = false;
                    if (this.waitCount < 120) {
                        this.waitCount++;
                    }
                    else if (this.waitCount == 120) {
                        if (this.attackCut >= 2) { // 플레이어 방어 확인. 보스는 스턴 모션 없음
                            this.attackBox.atkTimer += 8;

                            if (p1.vel.blocking == true && p1.vel.lookingRight == true) {
                                this.blockStayedP1 = true;
                            }
                            else if (p1.vel.blocking == false) {
                                this.blockStayedP1 = false;
                            }
                        }

                        if (collisonCheckX[this.attackBox.position_x - this.attackBox.atkTimer] == 0) {
                            if (p1.x < this.attackBox.position_x - this.attackBox.atkTimer && this.attackBox.position_x - this.attackBox.atkTimer < p1.x + p1.canvasLength && this.blockStayedP1 == false) {
                                p1.damaged = true;
                            }
                        }
                    }

                }
                else { // 공격 종료
                    this.attackDone = true;
                    if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                        p1.healthCount--;
                        p1.checkIsDead();
                    }
    
                    //몬스터 공격 정보 초기화
                    this.waitCount = 0;
                    this.attackBox.atkTimer = 0;
                    this.vel.attacking = false;
                    this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                }

            }
        }
        else { // 특수공격 -> 3번 연속 공격/ 120프레임
            if (this.waitCount < 120) {
                this.waitCount++;
            }
            else if (this.waitCount == 120) {
                if (this.vel.lookingRight == true) {//오른쪽 공격
                    if (this.comboAttackTime < this.comboAttackMax) {//3번발동
                        if (this.attackBox.atkTimer <= this.attackBox.width) { //오른쪽 공격 진행중. 공격 범위 -> 160, 40프레임
                            this.attackDone = false;
                            if ((1 < this.comboAttackCut && this.comboAttackCut < 4) || (5 < this.comboAttackCut && this.comboAttackCut < 8) || (9 < this.comboAttackCut)) { // 플레이어 방어 확인. 보스는 스턴 모션 없음
                                this.attackBox.atkTimer += 8;
    
                                if (p1.vel.blocking == true && p1.vel.lookingRight == false ) {
                                    this.blockStayedP1 = true;
                                }
                                else if (p1.vel.blocking == false) {
                                    this.blockStayedP1 = false;
                                }
                            }
    
                            if (collisonCheckX[this.attackBox.position_x + this.attackBox.atkTimer] == 0) {
                                if (p1.x < this.attackBox.position_x + this.attackBox.atkTimer && this.attackBox.position_x + this.attackBox.atkTimer < p1.x + p1.canvasLength && this.blockStayedP1 == false) {
                                    p1.damaged = true;
                                }
                            }
        
                        }
                        else { // 공격 종료
                            this.comboAttackTime++;
                            if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                                p1.healthCount--;
                                p1.checkIsDead();
                            }
            
                            //몬스터 공격 정보 초기화
                            this.attackBox.atkTimer = 0;
                            if (this.comboAttackTime == this.comboAttackMax) { // 마지막 공격 끝났을 시 완전 종료
                                this.comboAttackTime = 0;
                                this.attackDone = true;
                                this.waitCount = 0;
                                this.vel.attacking = false;
                                this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                            }
                        }
                    }
                }

                else {//왼쪽 공격
                    if (this.comboAttackTime < this.comboAttackMax) {//3번발동
                        if (this.attackBox.atkTimer <= this.attackBox.width) { //왼쪽 공격 진행중. 공격 범위 -> 160, 40프레임
                            this.attackDone = false;
                            if ((1 < this.comboAttackCut && this.comboAttackCut < 4) || (5 < this.comboAttackCut && this.comboAttackCut < 8) || (9 < this.comboAttackCut)) { // 플레이어 방어 확인. 보스는 스턴 모션 없음
                                this.attackBox.atkTimer += 8;
    
                                if (p1.vel.blocking == true && p1.vel.lookingRight == true) {
                                    this.blockStayedP1 = true;
                                }
                                else if (p1.vel.blocking == false) {
                                    this.blockStayedP1 = false;
                                }
                            }
    
                            if (collisonCheckX[this.attackBox.position_x + this.attackBox.atkTimer] == 0) {
                                if (p1.x < this.attackBox.position_x - this.attackBox.atkTimer && this.attackBox.position_x - this.attackBox.atkTimer < p1.x + p1.canvasLength && this.blockStayedP1 == false) {
                                    p1.damaged = true;
                                }
                            }
        
                        }
                        else { // 공격 종료
                            this.comboAttackTime++;
                            if (p1.damaged == true) { //플레이어1이 해당 몬스터의 공격을 받았을 경우
                                p1.healthCount--;
                                p1.checkIsDead();
                            }
            
                            //몬스터 공격 정보 초기화
                            this.attackBox.atkTimer = 0;
                            if (this.comboAttackTime == this.comboAttackMax) { // 마지막 공격 끝났을 시 완전 종료
                                this.comboAttackTime = 0;
                                this.attackDone = true;
                                this.waitCount = 0;
                                this.vel.attacking = false;
                                this.attackRandomNum = Math.floor(Math.random() * 10); // 0~9 정수 난수 발생
                            }
                        }
                    }
                }
                
            }

        }

    }

    move(p1, bigX, smallX, collisonCheckX, currentStageNum) {

        this.centerPoint = this.x + this.canvasLength / 2;
        //몹의 공격 범위 갱신
        this.checkDistance(bigX, smallX);

        this.x_attackLeft = this.x + 10;
        this.x_attackRight = this.x + this.canvasLength - 10;

        this.attackBox.position_x = this.x + this.canvasLength / 2;

        //살아있고, 공격중이 아니고, 현재 스테이지에 해당되면 움직임
        if (this.dead == false && this.vel.attacking == false && this.stageNum == currentStageNum) {
            this.vel.moving = true;
            if (this.flying == false) {
                for (var i = 0; i <= this.canvasLength - 100; i++) { // 위치 정보 갱신
                    collisonCheckX[this.x + 50 + i] = 1;
                }
            }

            if (this.moveRandNum >= 8) { //공중 이동중
                this.flying = true;
                this.flyToTarget(p1);
            }

            else if (this.moveRandNum < 8) { // 공중이동 아닌 경우 -> 일반 이동
                this.moveRandNum = this.updateMoveRandNum();//1초마다 난수 갱신

                
                if (bigX < this.centerPoint) { //전부 왼쪽에 있는 경우 (혹은 혼자)
                    this.vel.lookingRight = false;
                    //공격 범위 내에 있는 경우
                    if (this.x_attackLeft <= bigX) {
                        this.vel.attacking = true;
                    }

                    //왼쪽 따라가기 - 속도 2
                    else {
                        collisonCheckX[this.x + this.canvasLength - 50] = -1;
                        collisonCheckX[this.x + this.canvasLength - 51] = -1;
                        collisonCheckX[this.x + 49] = 1;
                        collisonCheckX[this.x + 48] = 1;
                        this.x-=2;
                    }
                }
                else if (this.centerPoint < smallX) { // 전부 오른쪽에 있는 경우 (혹은 혼자)
                    this.vel.lookingRight = true;
                        //공격 범위 내에 있는 경우
                        if (smallX <= this.x_attackRight) {
                            this.vel.attacking = true;
                        }

                        //오른쪽  따라가기 - 속도 2
                        else {
                            collisonCheckX[this.x + 50] = -1;
                            collisonCheckX[this.x + 51] = -1;
                            collisonCheckX[this.x + this.canvasLength - 49] = 1;
                            collisonCheckX[this.x + this.canvasLength - 48] = 1;
                            this.x+=2;
                        }
                }
            }

        }
        else if (this.dead == true) { //몹이 죽은 경우
            for (i = 0; i <= this.width; i++) {
                collisonCheckX[this.x + i] = -1;
            }
        }

    }
    checkAttacked(atkTimer_p1, collisonCheckX) {//공격이 해당 물체에 가해졌는지 확인
        if ((collisonCheckX[atkTimer_p1] == 1) && (this.x <= atkTimer_p1 && atkTimer_p1 <= this.x + this.canvasLength) && this.dead == false && this.flying == false) {
            this.healthCount--;
            this.hitCheck = true;
            if (this.healthCount == 0) {
                //console.log('nz1 dead');
                this.vel.attacking = false;
                this.attackDone = true;
                this.dead = true;
            }
        }
    }

    updateAnimation() {
        this.hitCheck = false;
        if (this.vel.moving == true) { //움직이는 경우
            if (this.moveRandNum >= 8) {//공중 이동
                if (this.jumpCount <= 60) {//점프 모션
                    if (this.jumpCount < 15) {
                        this.jumpCut = 0;
                    }
                    else if (this.jumpCount < 30) {
                        this.jumpCut = 1;
                    }
                    else if (this.jumpCount < 45) {
                        this.jumpCut = 2;
                    }
                    else if (this.jumpCount <= 60) {
                        this.jumpCut = 3;
                    }
                }
            
                if (this.fallingCount <= 90) { //착지 모션
                    if (this.fallingCount < 10) {
                        this.landCut = 0;
                    }
                    else if (this.fallingCount < 20) {
                        this.landCut = 1;
                    }
                    else if (this.fallingCount < 30) {
                        this.landCut = 2;
                    }
                    else if (this.fallingCount < 40) {
                        this.landCut = 3;
                    }
                    else if (this.fallingCount < 50) {
                        this.landCut = 4;
                    }
                    else {
                        this.landCut = 5;
                    }
                }
            }
            else {// 일반 이동
                if (this.walkingCount == 15) {
                    this.walkingCount = 0;
                    this.walkingCut++;
                    this.walkingCut = this.walkingCut % this.walkingLoop;
                }
                this.walkingCount++;
            }

        }

        else {//움직이지 않는 경우
            if (this.vel.attacking == true) {// 공격하는 경우

                if (this.waitCount < 120) { //공격 중 텀
                    if (this.idleCount == 10) {
                        this.idleCount = 0;
                        this.idleCut++;
                        this.idleCut = this.idleCut % this.idleLoop;
                    }
                    else {
                        this.idleCount++;
                    }
                }

                else if (this.waitCount == 120) {
                    if (this.attackRandomNum <= 6) {//일반 공격 
                        if (this.attackCount < 10) {
                            this.attackCount++;
                        }
                        else if (this.attackCount == 10) {
                            this.attackCount = 0;
                            if (this.attackCut < this.attackLoop - 1) {
                                this.attackCut++;
                            }
                            else {
                                this.attackCut = 0;
                            }
                        }
                    }
                    else if (this.attackRandomNum > 6) {//연속 공격
                        if (this.comboAttackCount == 10) {
                            this.comboAttackCount = 0;
                            this.comboAttackCut++;
                            this.comboAttackCut = this.comboAttackCut % this.comboAttackLoop;
                        }
                        else {
                            this.comboAttackCount++;
                        }
                    }
                }
            }

            else if (this.dead == true) { //죽는 경우
                if (this.deathCount == 15 && this.deathCut < this.deathLoop) {
                    this.deathCount = 0;
                    this.deathCut++;
                }
                else if (this.deathCount < 15) {
                    this.deathCount++;
                }
            }

        }
    }
}
////////////////////////////////////////////////////////////////////////////////

var collisonCheckX = createFillArray(12000, -1); //캔버스의 가로 길이만큼의 x좌표계 생성. 기본 원소값은 전부 -1 -> 물체가 없는 상태
// 플레이어가 서 있는 곳 -> 0
// 몬스터가 서 있는 곳 -> 1
//// 스테이지 변경 로직

// 0->왼쪽에서 시작 오른쪽 끝, 1-> 오른쪽에서 시작 왼쪽 끝
var arr_stageChangePoint = [0, 0, 0, 1, 0];

////

function moveObjectRight(collisonCheckX, obj, currentStageNum) {
    if (obj.stageNum == currentStageNum) {
        if (obj.x > 0) {
            collisonCheckX[obj.x + 50] = -1;
            collisonCheckX[obj.x + 51] = -1;
            collisonCheckX[obj.x + obj.canvasLength - 49] = 1;
            collisonCheckX[obj.x + obj.canvasLength - 48] = 1;
        }
        
        obj.x+=2;

        obj.setFixedRange(obj.xMax_left + 2, obj.xMax_right + 2)
    }
    
}

function moveObjectLeft(collisonCheckX, obj, currentStageNum) {
    if (obj.stageNum == currentStageNum) {
        if (obj.x > 0) {
            collisonCheckX[obj.x + 48] = 1;
            collisonCheckX[obj.x + 49] = 1;
            collisonCheckX[obj.x + obj.canvasLength - 50] = -1;
            collisonCheckX[obj.x + obj.canvasLength - 51] = -1;
        }
        
        obj.x-=2;
        obj.setFixedRange(obj.xMax_left - 2, obj.xMax_right - 2)
    }
}

    var currentStageNum = 0;
    var bg = new BackGround();
    //constructor(x, y, width, height, canvasLength)
    //setLoops(idle, walking, attacking, death)
    var p1 = new MainCharacter(200, 620, 500, 500, 200);
    p1.setLoops(4, 8, 6, 0);

    //zombies
    //stage0
    var sz = new StuckedZombie(1830, 560, 500, 500, 200);

    
    //stage1 일반 좀비 4마리. 
    var nz1 = new NormalZombie(1300, 620, 500, 500, 200);
    nz1.setLoops(6, 7, 4, 8);
    nz1.setFixedRange(1000, 1600);
    nz1.setStunLoop(3);
    nz1.setSfxIndex(0); //일반 좀비 중 첫 번째
    nz1.setStageNum(1);

    var nz2 = new NormalZombie(2100, 620, 500, 500, 200);
    nz2.setLoops(6, 7, 4, 8);
    nz2.setFixedRange(1800, 2400);
    nz2.setStunLoop(3);
    nz2.setSfxIndex(1);
    nz2.setStageNum(1);

    var nz3 = new NormalZombie(3000, 620, 500, 500, 200);
    nz3.setLoops(6, 7, 4, 8);
    nz3.setFixedRange(2700, 3300);
    nz3.setStunLoop(3);
    nz3.setSfxIndex(2);
    nz3.setStageNum(1);

    var nz4 = new NormalZombie(4100, 620, 500, 500, 200);
    nz4.setLoops(6, 7, 4, 8);
    nz4.setFixedRange(3800, 4400);
    nz4.setStunLoop(3);
    nz4.setSfxIndex(3);
    nz4.setStageNum(1);

    
    //stage2 일반 좀비 5마리

    var nz5 = new NormalZombie(1000, 620, 500, 500, 200);
    nz5.setLoops(6, 7, 4, 8);
    nz5.setFixedRange(700, 1300);
    nz5.setStunLoop(3);
    nz5.setSfxIndex(4);
    nz5.setStageNum(2);

    var nz6 = new NormalZombie(1900, 620, 500, 500, 200);
    nz6.setLoops(6, 7, 4, 8);
    nz6.setFixedRange(1600, 2200);
    nz6.setStunLoop(3);
    nz6.setSfxIndex(5);
    nz6.setStageNum(2);

    var nz7 = new NormalZombie(2800, 620, 500, 500, 200);
    nz7.setLoops(6, 7, 4, 8);
    nz7.setFixedRange(2500, 3100);
    nz7.setStunLoop(3);
    nz7.setSfxIndex(6);
    nz7.setStageNum(2);

    var nz8 = new NormalZombie(3900, 620, 500, 500, 200);
    nz8.setLoops(6, 7, 4, 8);
    nz8.setFixedRange(3600, 4200);
    nz8.setStunLoop(3);
    nz8.setSfxIndex(7);
    nz8.setStageNum(2);

    var nz9 = new NormalZombie(4800, 620, 500, 500, 200);
    nz9.setLoops(6, 7, 4, 8);
    nz9.setFixedRange(4500, 5100);
    nz9.setStunLoop(3);
    nz9.setSfxIndex(8);
    nz9.setStageNum(2);


    //stage3 원거리 좀비 3마리
    var cz1 = new CrawlingZombie(400, 620, 500, 500, 200);
    cz1.setLoops(4, 4, 4, 7);
    cz1.setFixedRange(300, 500);
    cz1.setStunLoop(3);
    cz1.setSfxIndex(0);
    cz1.setStageNum(3);

    var cz2 = new CrawlingZombie(-1900, 620, 500, 500, 200);
    cz2.setLoops(4, 4, 4, 7);
    cz2.setFixedRange(-2000, -1800);
    cz2.setStunLoop(3);
    cz2.setSfxIndex(1);
    cz2.setStageNum(3);

    var cz3 = new CrawlingZombie(-3600, 620, 500, 500, 200);
    cz2.setLoops(4, 4, 4, 7);
    cz2.setFixedRange(-3700, -3500);
    cz2.setStunLoop(3);
    cz2.setSfxIndex(2);
    cz2.setStageNum(3);

    //stage4


    //stage5
    var rz1 = new RunningZombie(1000, 620, 500, 500, 200);
    rz1.setLoops(4, 4, 5, 6);
    rz1.setFixedRange(700, 1300);
    rz1.setStunLoop(3);
    rz1.setSfxIndex(0);
    rz1.setStageNum(5);

    var rz2 = new RunningZombie(2500, 620, 500, 500, 200);
    rz2.setLoops(4, 4, 5, 6);
    rz2.setFixedRange(2200, 2800);
    rz2.setStunLoop(3);
    rz2.setSfxIndex(1);
    rz2.setStageNum(5);

    var rz3 = new RunningZombie(4000, 620, 500, 500, 200);
    rz3.setLoops(4, 4, 5, 6);
    rz3.setFixedRange(3700, 4300);
    rz3.setStunLoop(3);
    rz3.setSfxIndex(2);
    rz3.setStageNum(5);

    //stage6 final
    var bz = new BossZombie(1700, 520, 750, 750, 300);
    bz.setStageNum(6);
    var normalZombies = [nz1, nz2, nz3, nz4, nz5, nz6, nz7, nz8, nz9];
    var runningZombies = [rz1, rz2, rz3];
    var crawlingZombies = [cz1, cz2, cz3];


//플레이어 방어 상자 갱신
function updateBlockBox(player, x, y) {
    player.BlockBox.x_right = x + player.canvasLength - 10;
    player.BlockBox.x_left = x + 10;
    player.BlockBox.y = y + 60;
}


// gameLoop

var bigX = 0;
var smallX = 0;
var save=false;

function gameLoop() {
    //test
    console.log(bg.bg_xMax);
    //
    
    
    bigX = p1.x + p1.canvasLength - 40;
    smallX = p1.x + 40;
    
    bg.updateBgXMax(currentStageNum);

    
    for (var i = 0; i <= p1.canvasLength - 80; i++) { //플레이어1이 서 있는 곳은 0 으로 표시
        collisonCheckX[p1.x + 40 + i] = 0;
    }
    
    

    if (p1.dead == true) { //game Over
        return 1;
    }

    

    if (currentStageNum == 4 && save==false) { // 편의점 도달 했을 시, 4스테이지로 저장
        //저장 로직 필요
        save=true
        stageSet(currentStageNum, 3)
    }

    updateBlockBox(p1, p1.x, p1.y);

    sz.attack(collisonCheckX, p1);
    

    //activate normal Zombies 
    for (let i = 0; i < normalZombies.length; i++) {
        normalZombies[i].updateAnimation(currentStageNum);

        if ((normalZombies[i].vel.attacking == true || normalZombies[i].attackDone == false) && normalZombies[i].stageNum == currentStageNum) {
            normalZombies[i].zombieAttack(p1);
        }

        else if (normalZombies[i].attackDone == true && normalZombies[i].stageNum == currentStageNum) {
            normalZombies[i].move(bigX, smallX, collisonCheckX, currentStageNum);
        }
    }

    //activate running Zombies
    for (let i = 0; i < runningZombies.length; i++) {
        runningZombies[i].updateAnimation(currentStageNum);

        if ((runningZombies[i].vel.attacking == true || runningZombies[i].attackDone == false) && runningZombies[i].stageNum == currentStageNum) {
            runningZombies[i].zombieAttack(p1);
        }

        else if (runningZombies[i].attackDone == true && runningZombies[i].stageNum == currentStageNum) {
            runningZombies[i].move(bigX, smallX, collisonCheckX, currentStageNum);
        }
    }

    //activate crawling Zombies
    for (let i = 0; i < crawlingZombies.length; i++) {
        crawlingZombies[i].updateAnimation(currentStageNum);

        if ((crawlingZombies[i].vel.attacking == true || crawlingZombies[i].attackDone == false) && crawlingZombies[i].stageNum == currentStageNum) {
            crawlingZombies[i].zombieAttack(p1);
        }

        else if (crawlingZombies[i].attackDone == true && crawlingZombies[i].stageNum == currentStageNum) {
            crawlingZombies[i].move(bigX, smallX, collisonCheckX, currentStageNum);
        }
    }

    //boss Zombie activate
    bz.updateAnimation(currentStageNum);

    if ((bz.vel.attacking == true || bz.attackDone == false) && bz.stageNum == currentStageNum) {
        bz.zombieAttack(p1);
    }

    else if (bz.attackDone == true && bz.stageNum == currentStageNum) {
        bz.move(p1, bigX, smallX, collisonCheckX, currentStageNum);
    }


    //플레이어 1 맵 이동 할 경우
    if (p1.dead == false) { //p1만 남은 경우
        if ((p1.vel.movingLeft == true && collisonCheckX[p1.x + 38] != 1) && (p1.vel.attacking == false && p1.vel.blocking == false && p1.damaged == false)) { //왼쪽으로 가는 경우
            if ((bigX <= 800) && bg.bg_x > 0) { //배경화면 오른쪽으로 이동
                bg.bgmovingRight = true;
                bg.bg_x -= 2;

                // 플레이어 이외의 물체나 몬스터들
                moveObjectRight(collisonCheckX, sz, currentStageNum);
                for (let i = 0; i < normalZombies.length; i++) {
                    moveObjectRight(collisonCheckX, normalZombies[i], currentStageNum);
                } 

                for (let i = 0; i < runningZombies.length; i++) {
                    moveObjectRight(collisonCheckX, runningZombies[i], currentStageNum);
                }

                for (let i = 0; i < crawlingZombies.length; i++) {
                    moveObjectRight(collisonCheckX, crawlingZombies[i], currentStageNum);
                }
                moveObjectRight(collisonCheckX, bz, currentStageNum);

                // //플레이어 애니메이션 변수
                // // 애니메이션 변수
                // if (p1.frameCount < p1.refreshRate) {
                //     p1.frameCount++;
                // }
    
                // else if (p1.frameCount == p1.refreshRate) {
                //     p1.frameCount = 0;
                //     if (p1.walkingCount == p1.walkingLoop - 1) {
                //         p1.walkingCount = 0;
                //     }
                //     else {
                //         p1.walkingCount++;
                //     }
                // }
            }
            else {
                bg.bgmovingRight = false;
            }
        }
        else if ((p1.vel.movingRight == true && collisonCheckX[p1.x + p1.canvasLength - 38] != 1) && (p1.vel.attacking == false && p1.vel.blocking == false && p1.damaged == false)) {// 오른쪽으로 가는 경우
            if ((smallX >= (canvas.width - 700)) && bg.bg_x < bg.bg_xMax) { //배경화면 왼쪽으로 이동
                bg.bgmovingLeft = true;
                bg.bg_x += 2;

                // 플레이어 이외의 물체나 몬스터들
                moveObjectLeft(collisonCheckX, sz, currentStageNum);
                for (let i = 0; i < normalZombies.length; i++) {
                    moveObjectLeft(collisonCheckX, normalZombies[i], currentStageNum);
                } 

                for (let i = 0; i < runningZombies.length; i++) {
                    moveObjectLeft(collisonCheckX, runningZombies[i], currentStageNum);
                }

                for (let i = 0; i < crawlingZombies.length; i++) {
                    moveObjectLeft(collisonCheckX, crawlingZombies[i], currentStageNum);
                }
                moveObjectLeft(collisonCheckX, bz, currentStageNum);

                // // 플레이어 애니메이션 변수
                // if (p1.frameCount < p1.refreshRate) {
                //     p1.frameCount++;
                // }
    
                // else if (p1.frameCount == p1.refreshRate) {
                //     p1.frameCount = 0;
                //     if (p1.walkingCount == p1.walkingLoop - 1) {
                //         p1.walkingCount = 0;
                //     }
                //     else {
                //         p1.walkingCount++;
                //     }
                // }
            }
            else {
                bg.bgmovingLeft = false;
            }
        }
    }





    //플레이어1 이 가만히 서 있는 경우
    if (p1.vel.attacking == false && p1.vel.moving == false && p1.vel.blocking == false) {
        if (p1.frameCount < p1.refreshRate) {
            p1.frameCount++;
        }
        else if (p1.frameCount == p1.refreshRate) {
            p1.frameCount = 0;

            if (p1.idleCount == p1.idleLoop - 1) {
                p1.idleCount = 0;
            }

            else {
                p1.idleCount++;
            }
        }
    }
    //플레이어1이 잡힌 경우
    if (p1.grabbed == true && p1.dead == false) {
        if (p1.interactionCount == 20) {
            p1.interactionCount = 0;
            p1.interactionCut++;
            p1.interactionCut = p1.interactionCut % p1.interactionLoop;
        }
        else {
            p1.interactionCount++;
        }
    }

    //플래이어1 이 왼쪽으로 이동하는 경우
    if ((p1.vel.movingLeft == true && collisonCheckX[p1.x + 38] != 1) && (p1.vel.attacking == false && p1.vel.blocking == false && p1.damaged == false)) {
        if (p1.x > 0 && bg.bgmovingRight == false) {
            collisonCheckX[p1.x + 38] = 0;
            collisonCheckX[p1.x + 39] = 0;
            collisonCheckX[p1.x + p1.canvasLength - 40] = -1;
            collisonCheckX[p1.x + p1.canvasLength - 41] = -1;
            p1.x-=2;
            p1.attackBox.position_x-=2;
        }

        // 애니메이션 변수
        if (p1.frameCount < p1.refreshRate) {
            p1.frameCount++;
        }

        else if (p1.frameCount == p1.refreshRate) {
            p1.frameCount = 0;
            if (p1.walkingCount == p1.walkingLoop - 1) {
                p1.walkingCount = 0;
            }
            else {
                p1.walkingCount++;
            }
        }
    }

    //플래이어1이 오른쪽으로 이동하는 경우
    if ((p1.vel.movingRight == true && collisonCheckX[p1.x + p1.canvasLength - 38] != 1) && (p1.vel.attacking == false && p1.vel.blocking == false && p1.damaged == false)) {
        if (p1.x < canvas.width - p1.canvasLength && bg.bgmovingLeft == false) {
            collisonCheckX[p1.x + 40] = -1;
            collisonCheckX[p1.x + 41] = -1;
            collisonCheckX[p1.x + p1.canvasLength - 39] = 0;
            collisonCheckX[p1.x + p1.canvasLength - 38] = 0;
            p1.x+=2;
            p1.attackBox.position_x+=2;
        }
        // 애니메이션 변수
        if (p1.frameCount < p1.refreshRate) {
            p1.frameCount++;
        }

        else if (p1.frameCount == p1.refreshRate) {
            p1.frameCount = 0;
            if (p1.walkingCount == p1.walkingLoop - 1) {
                p1.walkingCount = 0;
            }
            else {
                p1.walkingCount++;
            }
        }
    }

    //플레이어1이 공격 중인 경우
    if (p1.vel.attacking == true) {
        //오른쪽 공격
        if(p1.vel.lookingRight == true) {
            if (p1.attackTimer >= p1.attackBox.width) { // 공격 범위 120 0.5초 -> 30frmae 1 frame당 4 증가

                for (let i = 0; i < normalZombies.length; i++) {
                    if (normalZombies[i].stageNum == currentStageNum) {
                        normalZombies[i].checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                    }
                }

                for (let i = 0; i < runningZombies.length; i++) {
                    if (runningZombies[i].stageNum == currentStageNum) {
                        runningZombies[i].checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                    }
                }

                for (let i = 0; i < crawlingZombies.length; i++) {
                    if (crawlingZombies[i].stageNum == currentStageNum) {
                        crawlingZombies[i].checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                    }
                }
                if (bz.stageNum == currentStageNum) {
                    bz.checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                }
                
                if (sz.stageNum == currentStageNum) {
                    sz.checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                }
                
                p1.vel.attacking = false;
                p1.attackTimer = 0;
            }
            else {
                p1.attackTimer+=4;
            }
        }
        //왼쪽 공격
        else if(p1.vel.lookingRight == false) {
            if (Math.abs(p1.attackTimer) >= p1.attackBox.width) {
                for (let i = 0; i < normalZombies.length; i++) {
                    if (normalZombies[i].stageNum == currentStageNum) {
                        normalZombies[i].checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                    }
                }

                for (let i = 0; i < runningZombies.length; i++) {
                    if (runningZombies[i].stageNum == currentStageNum) {
                        runningZombies[i].checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                    }
                }

                for (let i = 0; i < crawlingZombies.length; i++) {
                    if (crawlingZombies[i].stageNum == currentStageNum) {
                        crawlingZombies[i].checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                    }
                }
                if (bz.stageNum == currentStageNum) {
                    bz.checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                }
                
                if (sz.stageNum == currentStageNum) {
                    sz.checkAttacked(p1.attackBox.position_x + p1.attackTimer, collisonCheckX);
                }
                p1.vel.attacking = false;
                p1.attackTimer = 0;
            }
            else {
                p1.attackTimer-=4;
            }
        }
    }
    //플레이어1 공격 애니메이션 변수 attackFrame 이 30이 될때 마다 장면이 바뀜
    if (p1.vel.attacking_motion == true) {
        
        if (p1.attackFrame < 30 && (p1.attackCount <= 1)) {
            p1.attackFrame+=6;
        }
        
        else if (p1.attackFrame < 30 && (p1.attackCount == 2)) {
            p1.attackFrame+=3;
        }
        else if (p1.attackFrame < 30 && (p1.attackCount <= 4)) {
            p1.attackFrame+=5
        }
        else if (p1.attackFrame < 30 && (p1.attackCount == 5)) {
            p1.attackFrame+=3;
        }
        
        else if(p1.attackFrame == 30) {
            p1.attackFrame = 0;
            if (p1.attackCount == p1.attackLoop - 1) {
                p1.attackCount = 0;
                p1.vel.attacking_motion = false; //공격 동작 종료
            }
            else {
                p1.attackCount++;
            }
        }
        
    }

    //플레이어1이 공격에 맞은 경우
    if (p1.damaged == true) {
        p1.damagedCount++;
        if (p1.damagedCount == 60) {
            p1.damaged = false;
            p1.damagedCount = 0;
        }
    }
    


    
    //스테이지 이동 로직 -> 0-오른쪽으로 이동
    if (arr_stageChangePoint[currentStageNum] == 0) { // 현재 맵이 오른쪽에서 끝나는 맵인 경우
        if (bg.bg_x == bg.bg_xMax && bigX + 40 == canvas.width - 10) { //둘 중 한명이 맵 오른쪽 끝까지 가는 경우
            currentStageNum++;

            if (arr_stageChangePoint[currentStageNum] == 0) { //왼쪽 시작인 경우
                p1.x = 100;
                p1.attackBox.position_x = p1.x + (p1.canvasLength / 2);
                bg.bg_x = 0;

                p1.vel.lookingRight = true;
            }
            else {//오른쪽 시작인 경우
                p1.x = 1500;
                p1.attackBox.position_x = p1.x + (p1.canvasLength / 2);
                bg.bg_x = bg.bg_xMax;

                p1.vel.lookingRight = false;
            }
            
            
            
        }
    }
    else if (arr_stageChangePoint[currentStageNum] == 1) {// 현재 맵이 왼쪽에서 끝나는 맵인 경우
        if (bg.bg_x == 0 && smallX == 50) { //둘 중 한명이 맵 왼쪽 끝까지 가는 경우
            currentStageNum++;
            if (arr_stageChangePoint[currentStageNum] == 0) { //왼쪽 시작인 경우
                p1.x = 100;
                p1.attackBox.position_x = p1.x + (p1.canvasLength / 2);
                bg.bg_x = 0;

                p1.vel.lookingRight = true;
            }
            else {//오른쪽 시작인 경우
                p1.x = 1500;
                p1.attackBox.position_x = p1.x + (p1.canvasLength / 2);
                bg.bg_x = bg.bg_xMax;

                p1.vel.lookingRight = false;
            }
            
        }
    }

    
    
}

///// 키 입력 로직
document.addEventListener('keydown', function(e) {
    if (e.key ==='a') {
        if (p1.damaged == false && p1.vel.attacking == false && p1.vel.blocking == false && p1.dead == false && p1.grabbed == false) {
            p1.vel.lookingRight = false;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = true;
            p1.vel.movingRight = false;
            p1.vel.movingLeft = true;
            p1.vel.blocking = false;
            p1.vel.interaction = false;
        }
    }
})

document.addEventListener('keydown', function(e) {
    if (e.key ==='d') {
        if (p1.damaged == false && p1.vel.attacking == false && p1.vel.blocking == false && p1.dead == false && p1.grabbed == false) {
            p1.vel.lookingRight = true;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = true;
            p1.vel.movingRight = true;
            p1.vel.movingLeft = false;
            p1.vel.blocking = false;
            p1.vel.interaction = false;
        }
    }
})

document.addEventListener('keydown', function(e) {
    if (e.key ==='f') {
        if (p1.damaged == false && p1.dead == false) {
            if (p1.vel.lookingRight == true) {//오른쪽 공격
                p1.vel.lookingRight = true;
                p1.vel.attacking = true;
                p1.vel.attacking_motion = true;
                p1.vel.moving = false;
                p1.vel.movingRight = false;
                p1.vel.movingLeft = false;
                p1.vel.blocking = false;
                p1.vel.interaction = false;
            }

            else {
                p1.vel.lookingRight = false;
                p1.vel.attacking = true;
                p1.vel.attacking_motion = true;
                p1.vel.moving = false;
                p1.vel.movingRight = false;
                p1.vel.movingLeft = false;
                p1.vel.blocking = false;
                p1.vel.interaction = false;
            }
            
        }
    }
})

document.addEventListener('keydown', function(e) {
    if (e.key ==='r') {
        if (p1.vel.lookingRight == true && p1.damaged == false && p1.dead == false && p1.grabbed == false) {
            p1.vel.lookingRight = true;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = false;
            p1.vel.movingRight = false;
            p1.vel.movingLeft = false;
            p1.vel.blocking = true;
            p1.vel.interaction = false;
        }
        else if (p1.vel.lookingRight == false && p1.damaged == false && p1.dead == false && p1.grabbed == false) {
            p1.vel.lookingRight = false;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = false;
            p1.vel.movingRight = false;
            p1.vel.movingLeft = false;
            p1.vel.blocking = true;
            p1.vel.interaction = false;
        }
    }
})

document.addEventListener('keydown', function(e) {
    if (e.key ==='e') {
        if (p1.vel.lookingRight == true && p1.damaged == false && p1.dead == false) {
            p1.vel.lookingRight = true;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = false;
            p1.vel.movingRight = false;
            p1.vel.movingLeft = false;
            p1.vel.blocking = false;
            p1.vel.interaction = true;
        }
        else if (p1.vel.lookingRight == false && p1.damaged == false && p1.dead == false) {
            p1.vel.lookingRight = false;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = false;
            p1.vel.movingRight = false;
            p1.vel.movingLeft = false;
            p1.vel.blocking = true;
            p1.vel.interaction = true;
        }
    }
})


document.addEventListener('keyup', function(e) {
    if (e.key ==='a') {
        p1.vel.lookingRight = false;
        p1.vel.attacking = false;
        p1.vel.attacking_motion = false;
        p1.vel.moving = false;
        p1.vel.movingRight = false;
        p1.vel.movingLeft = false;
        p1.vel.blocking = false;
        p1.vel.interaction = false;
    }
})

document.addEventListener('keyup', function(e) {
    if (e.key ==='d') {
        p1.vel.lookingRight = true;
        p1.vel.attacking = false;
        p1.vel.attacking_motion = false;
        p1.vel.moving = false;
        p1.vel.movingRight = false;
        p1.vel.movingLeft = false;
        p1.vel.blocking = false;
        p1.vel.interaction = false;
    }
})

document.addEventListener('keyup', function(e) {
    if (e.key ==='r') {
        if (p1.vel.lookingRight == true) {
            p1.vel.lookingRight = true;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = false;
            p1.vel.movingRight = false;
            p1.vel.movingLeft = false;
            p1.vel.blocking = false;
            p1.vel.interaction = false;
        }
        else {
            p1.vel.lookingRight = false;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = false;
            p1.vel.movingRight = false;
            p1.vel.movingLeft = false;
            p1.vel.blocking = false;
            p1.vel.interaction = false;
        }
    }
})

document.addEventListener('keyup', function(e) {
    if (e.key ==='e') {
        if (p1.vel.lookingRight == true) {
            p1.vel.lookingRight = true;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = false;
            p1.vel.movingRight = false;
            p1.vel.movingLeft = false;
            p1.vel.blocking = false;
            p1.vel.interaction = false;
        }
        else {
            p1.vel.lookingRight = false;
            p1.vel.attacking = false;
            p1.vel.attacking_motion = false;
            p1.vel.moving = false;
            p1.vel.movingRight = false;
            p1.vel.movingLeft = false;
            p1.vel.blocking = false;
            p1.vel.interaction = false;
        }
    }
})

//////////////////////////////////////////////////////////////////////
function animate() {
    


    if (gameLoop() == 1) {
        gameOver.style.display = "block";
        return 0;
    }

    if (bz.dead == true && bz.deathCut == 8) {
        gameClear.style.display = "block";
        return 0;
    }
    //gameLoop();

    stageInfo.style.display = "block";
    stageInfo.innerHTML = arr_stageName[currentStageNum];
    if (dialogueOnGoing == false && dialogueFinished == false && arr_dialogueCheck[currentStageNum] == 1) { // 대화 시작
        dialogueWindow.style.display = "block";
        textAnimation(dialogueText, arr_dialogues[currentStageNum][textIndex]);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw functions
    drawbg(bg, currentStageNum);

    if(p1.dead == false) {
        drawPlayer(p1);
    }

    drawStuckedZombie(sz, currentStageNum);

    for (let i =0; i < normalZombies.length; i++) {
        drawNormalZombie(normalZombies[i], currentStageNum);
    }

    for (let i =0; i < runningZombies.length; i++) {
        drawRunningZombie(runningZombies[i], currentStageNum);
    }

    for (let i =0; i < crawlingZombies.length; i++) {
        drawCrawlingZombie(crawlingZombies[i], currentStageNum);
    }

    drawBossZombie(bz, currentStageNum);
    
    //for test
    //

    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps);
}