// import { getToken, getUserId } from "./test.js"
var canvas 
var ctx 
var token = sessionStorage.getItem("token")
var userId = sessionStorage.getItem("userId")
let wsurl="http://ec2-3-37-130-111.ap-northeast-2.compute.amazonaws.com:8081/ws"
let url = "http://ec2-3-37-130-111.ap-northeast-2.compute.amazonaws.com:8081"
// let wsurl="http:localhost:8081/ws"
// let url = "http:localhost:8081"
var header
var stomp
var RoomId
// 클라이언트 -> 서버 
// //socket.on 은 해당 이벤트를 받고 콜백함수를 실행
// socket.on('init', handleInit);
// socket.on('gameState', handleGameState);
// socket.on('gameOver', handleGameOver);
// socket.on('gameCode', handleGameCode);
// socket.on('unknownGame', handleUnknownGame);
// socket.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput'); //들어가고자 하는 방의 코드
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const logoutBtn = document.getElementById("logout")

const gameCodeScreen = document.getElementById('gameCode');
const reconnectBtn = document.getElementById('reconnect')


var err_msg = document.getElementById("err_msg");
var errDialog = document.getElementById("errDialog");

function closeMsg() {
  errDialog.close();
}

// const userId = document.getElementById('userId')

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGameSetCode);
logoutBtn.addEventListener("click", logout);
reconnectBtn.addEventListener("click", reconnect)

let playerNumber;
let gameActive = false;

function audioStop(audio) { // 오디오 멈춤 함수 -> stop역할
    audio.pause();
    audio.currentTime = 0;
}

//////////////////////////////stage Information
var stageInfo = document.getElementById('stageInfo');
const arr_stageChangePoint = [0,0,0,1,0];

const arr_stageName = ["   명동역 승강장 입구 ->", "   명동역 승강장 ->", "   명동역 - 회현역 통로 ->", "<- 회현역 승강장   ", "   회현역 승강장 입구 ->",
"   회현역 - 서울역 사이 열차 ->", "서울역"];

//////////////////////////////text dialogue 

var dialogueWindow = document.getElementById('dialogueWindow');
var dialogueText = document.getElementById('dialogueText');
var portrait = document.getElementById('portrait');

//대화가 있는 스테이지인지 확인하는 정보 -> 1이면 대화 있음
var checkStageNum = 0; // 0부터 시작



const arr_dialogueCheck = [0, 0, 0, 0, 0, 0, 0];
const arr_textIndex = [0, 0, 0, 0, 0, 0, 0];
const arr_dialogues = [
    ["원재: 서울역 까지 앞으로 2개 남았군...",
    "두혁: 보급품이 있다는 말이 사실이어야 할탠데.", 
 "원재: 어차피 현재 보급도 다 떨어졌어. 가보는 수밖에.",
 "원재: 이봐, 앞으로 정신 바짝 차리고 다녀야 할거야.",
 "원재: 저 시체들이랑 싸워본 적 있나?",
 "두혁: 옆에서 본 적은 있어. 직접 싸워보진 않았지.",
 "원재: 다짜고짜 달려든다면 바로 죽을거다.",
 "원재: 녀석들이 공격하는 타이밍을 봐서 잘 막으면 잠깐동안 행동이 느려진다.",
 "원재: 그 때 가격하는게 좋을 거야.",
 "두혁: ...명심할게.",
 "- 'a', 'd' 키로 움직입니다. 'f'키를 눌러 공격합니다",
 "'r' 키를 누르면 방어가 활성화 됩니다.",
 "- 방어에 성공한다면 공격이 더 수월해집니다.",
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
            else if (text[i] == '두') {
                portrait.src = "img/dialogue/player2.png";
                player2_talking.play();
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

for (let i = 0; i < 2; i++) {//플레이어가 2명이므로 2개 생성
    var playerWalking = new Audio('./sfx/player/WalkingTest.mp3');
    playerWalking.loop = true; //걷는 소리는 걷는동안 계속 반복 되어야 함
    arr_playerWalkingSfx.push(playerWalking);
}

var arr_playerAttackSfx = [];

for (let i = 0; i < 2; i++) {//플레이어가 2명이므로 2개 생성
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

//player 2
var img_Idle_full2 = new Image();
img_Idle_full2.src = './img/Player2_idle.png'

var img_Idle_full_left2 = new Image();
img_Idle_full_left2.src = './img/Player2_idle_left.png'

var img_Walking_full2 = new Image();
img_Walking_full2.src = './img/Player2_walking.png'

var img_Walking_full_left2 = new Image();
img_Walking_full_left2.src = './img/Player2_walking_left.png'

var img_Middle_Attack_full2 = new Image();
img_Middle_Attack_full2.src = './img/Player2_attack.png'

var img_Middle_Attack_full_left2 = new Image();
img_Middle_Attack_full_left2.src = './img/Player2_attack_left.png'

var img_Block2 = new Image();
img_Block2.src = './img/Player2_block.PNG'

var img_Block_left2 = new Image();
img_Block_left2.src = './img/Player2_block_left.png'

var img_Player_attacked2 = new Image();
img_Player_attacked2.src = './img/Player2_attacked.png'

var img_Player_attacked_left2 = new Image();
img_Player_attacked_left2.src = './img/Player2_attacked_left.png'

var img_Player_grabbed2 = new Image();
img_Player_grabbed2.src = './img/Player2_grabbed.png'

var img_Player_grabbed_left2 = new Image();
img_Player_grabbed_left2.src = './img/Player2_grabbed_left.png'

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
//////////////////////////////////////


//socket.emit 은 이벤트 명을 지정하고 데이터 전송 (데이터 필요 없을 수도 있음)
function logout(){
    sessionStorage.clear()
    location.href ="login.html"
}
function newGame() {
    // token = getToken()
    // userId = getUserId()
    // console.log(userId)
    const othePram={
        headers: {
          'content-type': 'application/json',
          'Authorization': "Bearer "+ token,
          'UserId': userId
        },
        body: JSON.stringify({
          userId: userId
        }),
        method: 'POST',
      }
      fetch(url+"/wait-service/waitroom/create", othePram)
      .then((data)=>{return data.json()})
      .then((res)=>{
        // console.log(res);
        if(res.code.status ==1406){
            console.log("refresh");
            refreshAuth()
        }
        RoomId = res.waitRoomId
        // window.sessionStorage.setItem("RoomId",RoomId)
        joinGame()
    })
      .catch((error)=>console.log(error))
    // socket.emit('newGame');
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
    // console.log(othePram)
    fetch(Url, othePram)
    .then((data)=>{return data.json()})
    .then((res)=>{//console.log(res)//location.href='test.html'
    if(res.code.status==1204){
      console.log("재인증 완료")
      token = res.token.token
      refreshToken = res.token.refreshToken
      window.sessionStorage.setItem("token",token)//토큰
      window.sessionStorage.setItem("refreshToken",refreshToken)//refresh 토큰
      newGame()
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

function joinGameSetCode(){
    RoomId = gameCodeInput.value
    joinGame()
}

function joinGame() {
    setHeader()
    gameCodeDisplay.innerText = RoomId
    console.log(RoomId)
    init();
    
    let sock = new SockJS(wsurl)
//let stomp=Stomp.client(wsurl)
    stomp = Stomp.over(sock)
    stomp.debug=null
    stomp.connect(header,function(){
        stomp.subscribe('/sub/play/sub/'+RoomId,function(message){
            // console.log("message: ",message.body)
            handleGameState(message.body)
        })

        stomp.send('/pub/play/pub/'+RoomId,header,JSON.stringify({
            active:true
        }))
    })
    //socket.emit('joinGame', code); //code 데이터 같이 전송
}

function reconnect(){
    // stomp.disconnect()
    stomp.connect(header,function(){
        stomp.subscribe('/sub/play/sub/'+RoomId,function(message){
            // console.log("message: ",message.body)
            handleGameState(message.body)
        })
        stomp.send('/pub/play/pub/'+RoomId,header,JSON.stringify({
            active:true
        }))
    })
}
function init() {
    initialScreen.style.display = "none"; // 초기화면 가리기
    gameScreen.style.display = "block";   // display: block => 요소를 앞 뒤로 줄바꿈 함

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = 1920;
    canvas.height = 960;

    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    gameActive = true;
}

function setHeader(){
    // let t=token.value
    // let uId=userId.value
    // token = getToken()
    // userId = getUserId()
    header={
        Authorization: "Bearer "+token,
        WaitRoomId:RoomId,
        UserId:userId
    }
}

function keydown(e) {// 입력된 키 정보 전송 (키 누른 경우)
    let body={
        keyCode:e.keyCode,
        keydown:true,
        active:true
    }
    stomp.send('/pub/play/pub/'+RoomId,header,JSON.stringify(body))
    //socket.emit('keydown', e.keyCode);
}


function keyup(e) { // 입력된 키 정보 전송 (키 땠을 경우)
    let body={
        keyCode:e.keyCode,
        keydown:false,
        active:true
    }
    stomp.send('/pub/play/pub/'+RoomId,header,JSON.stringify(body))

    //socket.emit('keyup', e.keyCode);
}

function updateBlockBox(x_right, x_left, y, player) {
    player.blockBox.x_right = x_right;
    player.blockBox.x_left = x_left;
    player.blockBox.y = y;
}

function PlayerAttack(player) {
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
function Player2Attack(player) {
    if (player.attackCount == 3) {//3번째 컷에서 공격 소리 재생
        arr_playerAttackSfx[1].play();
    }
    if (player.vel.lookingRight == true) {
        ctx.drawImage(img_Middle_Attack_full2, player.width * player.attackCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
    }

    else if (player.vel.lookingRight == false) {
        ctx.drawImage(img_Middle_Attack_full_left2, player.width * player.attackCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
    }
}
function PlayerAttackRight(player) {
    if (player.attackCount == 3) {//3번째 컷에서 공격 소리 재생
        arr_playerAttackSfx[0].play();
    }
    if (player.vel.lookingRight == true) {
        ctx.drawImage(img_Middle_Attack_full, player.width * player.attackCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
    }

    else if (player.vel.lookingRight == false) {
        ctx.drawImage(img_Middle_Attack_full_left, player.width * player.attackCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
    }
}
function Player2AttackRight(player) {
    if (player.attackCount == 3) {//3번째 컷에서 공격 소리 재생
        arr_playerAttackSfx[1].play();
    }
    if (player.vel.lookingRight == true) {
        ctx.drawImage(img_Middle_Attack_full2, player.width * player.attackCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
    }

    else if (player.vel.lookingRight == false) {
        ctx.drawImage(img_Middle_Attack_full_left2, player.width * player.attackCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
    }
}

function drawPlayer(player) {
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
                // ctx.fillRect(player.blockBox.x_right, player.blockBox.y, player.blockBox.width, player.blockBox.height);
            }

            else if (player.vel.lookingRight == false) { //왼쪽 보고있는 경우 -> 왼쪽 방어
                ctx.drawImage(img_Block_left, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                // ctx.fillRect(player.blockBox.x_left, player.blockBox.y, player.blockBox.width, player.blockBox.height);
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

function drawPlayerRight(player) {
    ctx.drawImage(img_Player_health, player.width * (player.healthMax - player.healthCount), 0, player.width, player.height, player.x-10000, player.y + player.canvasLength, player.canvasLength, player.canvasLength);

    if (player.vel.attacking_motion == true) { //공격 하는 경우 -> 움직일 수 없음
        PlayerAttackRight(player);
    }

    //플레이어가 몬스터에게 맞은 경우 -> 맞은 모션
    else if(player.damaged == true) {
        if (player.vel.lookingRight == true) { //오른쪽을 보고있다가 맞은 경우
            if (player.damagedCount < 60) {
                if (player.damagedCount <= 30) {
                    ctx.drawImage(img_Player_attacked, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                }
                else {
                    ctx.drawImage(img_Player_attacked, 500, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                }
            }
            else if (damagedCount == 60) {
                ctx.drawImage(img_Player_attacked, 500, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
        }

        else if(player.vel.lookingRight == false) { //왼쪽을 보고 있다가 맞은 경우
            if (player.damagedCount < 60) {
                if (player.damagedCount <= 30) {
                    ctx.drawImage(img_Player_attacked_left, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                }
                else {
                    ctx.drawImage(img_Player_attacked_left, 500, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                }
            }
            else if (player.damagedCount == 60) {
                ctx.drawImage(img_Player_attacked_left, 500, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
        }
    }
    else if (player.grabbed == true) { //잡혀 있는 경우
        ctx.drawImage(img_interaction_instruction, player.interactionCut * 250, 0, 250, 250, player.x + 70, player.y - 30, 60, 60);
        if (player.vel.lookingRight == true) {
            ctx.drawImage(img_Player_grabbed, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
        }
        else {
            ctx.drawImage(img_Player_grabbed_left, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
        }
    }
    // 공격중이 아닌 경우
    else {
        if (player.vel.blocking == true) {
            ctx.fillStyle = 'blue';
            if(player.vel.lookingRight == true) { //오른쪽 보고있는 경우 -> 오른쪽 방어
                ctx.drawImage(img_Block, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                // ctx.fillRect(player.blockBox.x_right, player.blockBox.y, player.blockBox.width, player.blockBox.height);
            }

            else if (player.vel.lookingRight == false) { //왼쪽 보고있는 경우 -> 왼쪽 방어
                ctx.drawImage(img_Block_left, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                // ctx.fillRect(player.blockBox.x_left, player.blockBox.y, player.blockBox.width, player.blockBox.height);
            }
        }

        else if (player.vel.moving == true) { //걷는 경우
            arr_playerWalkingSfx[0].play();
            if (player.vel.lookingRight == true) { //오른쪽을 보고있는 경우
                ctx.drawImage(img_Walking_full, player.width * player.walkingCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
    
            else { // 왼쪽을 보고있는 경우
                ctx.drawImage(img_Walking_full_left, player.width *player.walkingCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
        }

        else { // 가만히 서 있는 경우
            audioStop(arr_playerWalkingSfx[0]);
            if (player.vel.lookingRight == true) { //오른쪽을 보고있는 경우
                ctx.drawImage(img_Idle_full, player.width * player.idleCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
    
            else { // 왼쪽을 보고있는 경우
                ctx.drawImage(img_Idle_full_left, player.width * player.idleCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
        }
    }
}

function drawPlayer2(player) {
    ctx.drawImage(img_Player_health, player.width * (player.healthMax - player.healthCount), 0, player.width, player.height, player.x, player.y + player.canvasLength, player.canvasLength, player.canvasLength);

    if (player.vel.attacking_motion == true) { //공격 하는 경우 -> 움직일 수 없음
        Player2Attack(player);
    }

    //플레이어가 몬스터에게 맞은 경우 -> 맞은 모션
    else if(player.damaged == true) {
        if (player.vel.lookingRight == true) { //오른쪽을 보고있다가 맞은 경우
            if (player.damagedCount < 60) {
                if (player.damagedCount <= 30) {
                    ctx.drawImage(img_Player_attacked2, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
                else {
                    ctx.drawImage(img_Player_attacked2, 500, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
            }
            else if (damagedCount == 60) {
                ctx.drawImage(img_Player_attacked2, 500, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
            }
        }

        else if(player.vel.lookingRight == false) { //왼쪽을 보고 있다가 맞은 경우
            if (player.damagedCount < 60) {
                if (player.damagedCount <= 30) {
                    ctx.drawImage(img_Player_attacked_left2, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
                else {
                    ctx.drawImage(img_Player_attacked_left2, 500, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                }
            }
            else if (player.damagedCount == 60) {
                ctx.drawImage(img_Player_attacked_left2, 500, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
            }
        }
    }
    else if (player.grabbed == true) { //잡혀 있는 경우
        ctx.drawImage(img_interaction_instruction, player.interactionCut * 250, 0, 250, 250, player.x + 70, player.y - 30, 60, 60);
        if (player.vel.lookingRight == true) {
            ctx.drawImage(img_Player_grabbed2, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
        }
        else {
            ctx.drawImage(img_Player_grabbed_left2, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
        }
    }
    // 공격중이 아닌 경우
    else {
        if (player.vel.blocking == true) {
            ctx.fillStyle = 'blue';
            if(player.vel.lookingRight == true) { //오른쪽 보고있는 경우 -> 오른쪽 방어
                ctx.drawImage(img_Block2, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                // ctx.fillRect(player.blockBox.x_right, player.blockBox.y, player.blockBox.width, player.blockBox.height);
            }

            else if (player.vel.lookingRight == false) { //왼쪽 보고있는 경우 -> 왼쪽 방어
                ctx.drawImage(img_Block_left2, 0, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
                // ctx.fillRect(player.blockBox.x_left, player.blockBox.y, player.blockBox.width, player.blockBox.height);
            }
        }

        else if (player.vel.moving == true) { //걷는 경우
            arr_playerWalkingSfx[1].play();
            if (player.vel.lookingRight == true) { //오른쪽을 보고있는 경우
                ctx.drawImage(img_Walking_full2, player.width * player.walkingCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
            }
    
            else { // 왼쪽을 보고있는 경우
                ctx.drawImage(img_Walking_full_left2, player.width *player.walkingCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
            }
        }

        else { // 가만히 서 있는 경우
            audioStop(arr_playerWalkingSfx[1]);
            if (player.vel.lookingRight == true) { //오른쪽을 보고있는 경우
                ctx.drawImage(img_Idle_full2, player.width * player.idleCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
            }
    
            else { // 왼쪽을 보고있는 경우
                ctx.drawImage(img_Idle_full_left2, player.width * player.idleCount, 0, player.width, player.height, player.x, player.y, player.canvasLength, player.canvasLength);
            }
        }
    }
}

function drawPlayerRight2(player) {
    ctx.drawImage(img_Player_health, player.width * (player.healthMax - player.healthCount), 0, player.width, player.height, player.x-10000, player.y + player.canvasLength, player.canvasLength, player.canvasLength);

    if (player.vel.attacking_motion == true) { //공격 하는 경우 -> 움직일 수 없음
        Player2AttackRight(player);
    }

    //플레이어가 몬스터에게 맞은 경우 -> 맞은 모션
    else if(player.damaged == true) {
        if (player.vel.lookingRight == true) { //오른쪽을 보고있다가 맞은 경우
            if (player.damagedCount < 60) {
                if (player.damagedCount <= 30) {
                    ctx.drawImage(img_Player_attacked2, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                }
                else {
                    ctx.drawImage(img_Player_attacked2, 500, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                }
            }
            else if (damagedCount == 60) {
                ctx.drawImage(img_Player_attacked2, 500, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
        }

        else if(player.vel.lookingRight == false) { //왼쪽을 보고 있다가 맞은 경우
            if (player.damagedCount < 60) {
                if (player.damagedCount <= 30) {
                    ctx.drawImage(img_Player_attacked_left2, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                }
                else {
                    ctx.drawImage(img_Player_attacked_left2, 500, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                }
            }
            else if (player.damagedCount == 60) {
                ctx.drawImage(img_Player_attacked_left2, 500, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
        }
    }
    else if (player.grabbed == true) { //잡혀 있는 경우
        ctx.drawImage(img_interaction_instruction, player.interactionCut * 250, 0, 250, 250, player.x + 70, player.y - 30, 60, 60);
        if (player.vel.lookingRight == true) {
            ctx.drawImage(img_Player_grabbed2, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
        }
        else {
            ctx.drawImage(img_Player_grabbed_left2, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
        }
    }
    // 공격중이 아닌 경우
    else {
        if (player.vel.blocking == true) {
            ctx.fillStyle = 'blue';
            if(player.vel.lookingRight == true) { //오른쪽 보고있는 경우 -> 오른쪽 방어
                ctx.drawImage(img_Block2, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                // ctx.fillRect(player.blockBox.x_right, player.blockBox.y, player.blockBox.width, player.blockBox.height);
            }

            else if (player.vel.lookingRight == false) { //왼쪽 보고있는 경우 -> 왼쪽 방어
                ctx.drawImage(img_Block_left2, 0, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
                // ctx.fillRect(player.blockBox.x_left, player.blockBox.y, player.blockBox.width, player.blockBox.height);
            }
        }

        else if (player.vel.moving == true) { //걷는 경우
            arr_playerWalkingSfx[1].play();
            if (player.vel.lookingRight == true) { //오른쪽을 보고있는 경우
                ctx.drawImage(img_Walking_full2, player.width * player.walkingCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
    
            else { // 왼쪽을 보고있는 경우
                ctx.drawImage(img_Walking_full_left2, player.width *player.walkingCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
        }

        else { // 가만히 서 있는 경우
            audioStop(arr_playerWalkingSfx[1]);
            if (player.vel.lookingRight == true) { //오른쪽을 보고있는 경우
                ctx.drawImage(img_Idle_full2, player.width * player.idleCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
    
            else { // 왼쪽을 보고있는 경우
                ctx.drawImage(img_Idle_full_left2, player.width * player.idleCount, 0, player.width, player.height, player.x-10000, player.y, player.canvasLength, player.canvasLength);
            }
        }
    }
}

function drawBG(BackGround,currentStageNum) {
    // console.log(BackGround)
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
            if (zombie.deathCut == 1) {
                hitSfx.play();
            }
            ctx.drawImage(img_StuckedZombie_death, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
        }
    }
}

function drawNormalZombie(zombie,currentStageNum) {
    if (zombie.stageNum == currentStageNum) {
        if (zombie.hitCheck == true && zombie.dead == false) {
            hitSfx.play();
        }
        if (zombie.vel.attacking == true) {
            //공격 경고 알림
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
            if (zombie.deathCut == 1) {
                hitSfx.play();
            }
            if (zombie.vel.lookingRight == true) {
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
    
            else if (zombie.attackRandomNum >= 0) {// 잡기 공격
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
                    console.log("nomal attack")
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
            if (zombie.deathCut == 1) {
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
    
                else{// 가만히 서있는 경우
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
            if (zombie.deathCut == 1) {
                hitSfx.play();
            }
            if (zombie.vel.lookingRight == true) {
                ctx.drawImage(img_CrawlingZombie_death, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
            else {
                ctx.drawImage(img_CrawlingZombie_death_left, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
        }
    }
}
function drawCrawlingZombieRight(zombie, currentStageNum) {
    if (zombie.stageNum == currentStageNum) { //해당 스테이지일 경우 그리기
        if (zombie.hitCheck == true && zombie.dead == false) {
            hitSfx.play();
        }
        //체력바
        ctx.drawImage(img_Zombie_health, zombie.width * (zombie.healthMax - zombie.healthCount), 0, zombie.width, zombie.height, zombie.x-10000, zombie.y + zombie.canvasLength, zombie.canvasLength, zombie.canvasLength);
        if (zombie.dead == false) {
            ////////////좀비 애니메이션
            if (zombie.vel.moving == false) {
                if (zombie.spitting == true && zombie.rangedAttackWaitCount >= 60 && zombie.rangedAttackWaitCount <= 90) {//발사모션
                    if (zombie.spittingCut == 1) {
                        arr_crawlingZombieSpitSfx[zombie.sfxIndex].play();
                    }
                    if (zombie.vel.lookingRight == true) {//오른쪽 보고있는 경우
                        ctx.drawImage(img_CrawlingZombie_rangedAttack, zombie.width * zombie.spittingCut, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {//왼쪽
                        ctx.drawImage(img_CrawlingZombie_rangedAttack_left, zombie.width * zombie.spittingCut, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
    
                else if (zombie.spitting == false && zombie.vel.attacking == true && zombie.waitCount == 60) { // 근거리 공격
                    if (zombie.attackCount == 1) {
                        arr_crawlingZombieAttackSfx[zombie.sfxIndex].play();
                    }
                    if (zombie.vel.lookingRight == true) {//오른쪽 보고있는 경우
                        ctx.drawImage(img_CrawlingZombie_attack, zombie.width * zombie.attackCount, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {//왼쪽
                        ctx.drawImage(img_CrawlingZombie_attack_left, zombie.width * zombie.attackCount, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
    
                else if (zombie.stunned == true) {//기절한 경우
                    if (zombie.vel.lookingRight == true) {//오른쪽 기절
                        ctx.drawImage(img_CrawlingZombie_stunned, zombie.width * zombie.stunAnimaitonCount, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else {
                        ctx.drawImage(img_CrawlingZombie_stunned_left, zombie.width * zombie.stunAnimaitonCount, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
    
                else{// 가만히 서있는 경우
                    if (zombie.vel.lookingRight == true) { // 오른쪽
                        ctx.drawImage(img_CrawlingZombie_idle, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                    else { //왼쪽
                        ctx.drawImage(img_CrawlingZombie_idle_left, zombie.width * zombie.idleCut, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                    }
                }
            }

            

            else if (zombie.vel.moving == true){//움직이는 경우
                if (zombie.vel.lookingRight == true) {//오른쪽 걷기
                    if (zombie.walkingCut == 1 && zombie.x < 1900 && zombie.x > 10) {
                        arr_crawlingZombieMoving1Sfx[zombie.sfxIndex].play();
                    }
                    ctx.drawImage(img_CrawlingZombie_walking, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                }
                else {
                    if (zombie.walkingCut == 1 && zombie.x < 1900 && zombie.x > 10) {
                        arr_crawlingZombieMoving2Sfx[zombie.sfxIndex].play();
                    }   
                    ctx.drawImage(img_CrawlingZombie_walking_left, zombie.width * zombie.walkingCut, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
                }
            }
            //////////// 발사체 애니메이션
            if (zombie.rangedAttackWaitCount > 90 && zombie.rangedAttackWaitCount < 140) {//경고 표시
                ctx.drawImage(img_RangedAttack_warning, 0, 0, zombie.width, zombie.height, zombie.rangedAttackTarget - 100-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
            else if (zombie.rangedAttackWaitCount >= 140 && zombie.rangedAttackWaitCount < 150) {//투사체 떨어지는 첫번째 컷
                ctx.drawImage(img_RangedAttack_falling, 0, 0, zombie.width, zombie.height, zombie.rangedAttackTarget - 100-10000, zombie.y - 100, zombie.canvasLength, zombie.canvasLength);
            }
            else if (zombie.rangedAttackWaitCount == 150) {//그 이후의 투사체 떨어지는 컷들
                ctx.drawImage(img_RangedAttack_falling, zombie.width * zombie.poisonFallingCut, 0, zombie.width, zombie.height, zombie.rangedAttackTarget - 100-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
        }
        else {//죽는 경우
            if (zombie.deathCut == 1) {
                hitSfx.play();
            }
            if (zombie.vel.lookingRight == true) {
                ctx.drawImage(img_CrawlingZombie_death, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
            }
            else {
                ctx.drawImage(img_CrawlingZombie_death_left, zombie.width * zombie.deathCut, 0, zombie.width, zombie.height, zombie.x-10000, zombie.y, zombie.canvasLength, zombie.canvasLength);
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
                    else { // 연속 공격
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
                        else if (zombie.fallingCount == 0 && zombie.fallingWarningCount > 0) { // 경고 표시
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
                        else if (zombie.fallingCount == 0 && zombie.fallingWarningCount > 0) { // 경고 표시
                            ctx.drawImage(img_Boss_fallingWarning, 0, 0, zombie.width, zombie.height, zombie.x, zombie.y, zombie.canvasLength, zombie.canvasLength);
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
            if (zombie.deathCut == 1) {
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

///////////////////////////////////painting Game


function paintGame(state) { //draw 함수를 이용해야 할 듯
    gameCodeScreen.style.display = "none";
    let room=JSON.parse(state)

    checkStageChanged(checkStageNum, room.currentStageNum);
    
    stageInfo.style.display = "block";
    stageInfo.innerHTML = arr_stageName[room.currentStageNum];

    if (dialogueOnGoing == false && dialogueFinished == false && arr_dialogueCheck[room.currentStageNum] == 1) { // 대화 시작
        dialogueWindow.style.display = "block";
        textAnimation(dialogueText, arr_dialogues[room.currentStageNum][textIndex]);
    }
    ctx.clearRect(0,0, canvas.width, canvas.height);    //console.log(state.players[0]); // 속성은 넘어오지만 메소드는 넘어오지 않는다.
    //draw함수가 안먹히는 상황 -> 그렇다면 여기다가 함수를 구현하자.
    let playerindex=Object.keys(room.playerMap)
    let stcukedzombieindex=Object.keys(room.zombie.stuckedZombieMap)
    let normalzombieindex=Object.keys(room.zombie.normalZombieMap)
    let runningzombieindex=Object.keys(room.zombie.runningZombieMap)
    let crawlingzombieindex=Object.keys(room.zombie.crawlingZombieMap)
    let bosszombieindex=Object.keys(room.zombie.bossZombieMap)
    // console.log("zombie:",room.normalZombieMap[zombieindex[0]])
    drawBG(room.backGround, room.currentStageNum);
    if(arr_stageChangePoint[room.currentStageNum]==1){
        if(room.playerMap[playerindex[0]].dead == false) {
            drawPlayerRight(room.playerMap[playerindex[0]]);
        }
        if(room.playerMap[playerindex[1]].dead == false) {
            drawPlayerRight2(room.playerMap[playerindex[1]]);
        }
        drawStuckedZombie(room.zombie.stuckedZombieMap[stcukedzombieindex[0]],room.currentStageNum)

        for (let i =0; i < normalzombieindex.length; i++) {
            drawNormalZombie(room.zombie.normalZombieMap[normalzombieindex[i]],room.currentStageNum);
        }
        for (let i =0; i < runningzombieindex.length; i++) {
            drawRunningZombie(room.zombie.runningZombieMap[runningzombieindex[i]],room.currentStageNum);
        }
        for (let i =0; i < crawlingzombieindex.length; i++) {
            drawCrawlingZombieRight(room.zombie.crawlingZombieMap[crawlingzombieindex[i]],room.currentStageNum);
        }
        drawBossZombie(room.zombie.bossZombieMap[bosszombieindex[0]],room.currentStageNum);
    }
    else{
        if(room.playerMap[playerindex[0]].dead == false) {
            drawPlayer(room.playerMap[playerindex[0]]);
        }
        if(room.playerMap[playerindex[1]].dead == false) {
            drawPlayer2(room.playerMap[playerindex[1]]);
        }
        drawStuckedZombie(room.zombie.stuckedZombieMap[stcukedzombieindex[0]],room.currentStageNum)

        for (let i =0; i < normalzombieindex.length; i++) {
            drawNormalZombie(room.zombie.normalZombieMap[normalzombieindex[i]],room.currentStageNum);
        }
        for (let i =0; i < runningzombieindex.length; i++) {
            drawRunningZombie(room.zombie.runningZombieMap[runningzombieindex[i]],room.currentStageNum);
        }
        for (let i =0; i < crawlingzombieindex.length; i++) {
            drawCrawlingZombie(room.zombie.crawlingZombieMap[crawlingzombieindex[i]],room.currentStageNum);
        }
        drawBossZombie(room.zombie.bossZombieMap[bosszombieindex[0]],room.currentStageNum);
    }
}

// function handleInit(number) {
//     playerNumber = number;
// }

function handleGameState(gameState) {
    let room=JSON.parse(gameState)
    let bosszombieindex=Object.keys(room.zombie.bossZombieMap)
    if (room.active==false) { //게임이 활성화 상태가 아닌경우
        gameOver.style.display = "block";
        return 0;
    }
    if (room.zombie.bossZombieMap[bosszombieindex[0]].dead == true && room.zombie.bossZombieMap[bosszombieindex[0]].deathCut == 8) {
        gameClear.style.display = "block";
        return 0;
    }
    // gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
}

// function handleGameOver(data) {
//     if (!gameActive) {
//         return;
//     }

//     data = JSON.parse(data);

//     gameActive = false;

//     alert("game over");
// }

// function handleGameCode(gameCode) {
//     gameCodeDisplay.innerText = gameCode;
// }

// function handleUnknownGame() {
//     reset();
//     alert("Unknown game code");
// }

// function handleTooManyPlayers() {
//     reset();
//     alert("This game is already in progress");
// }

// function reset() {
//     playerNumber = null;
//     gameCodeInput.value = "";
//     gameCodeDisplay.innerText = "";
//     initialScreen.style.display = "block";
//     gameScreen.style.display = "none";
// }