var mario, mario_running, mario_collided;
var bg, bgImage;
var brickGroup, brickImage; 
var con , coin ; 
var csound , score;
var tur , mush , obs ;
var jump;
var dieSound ;
var gamestate ;
var restartImg ;
function preload(){
  gamestate="PLAY"
  restartImg=loadImage("images/restart.png")
  mario_collided=loadImage("images/dead.png")
  dieSound=loadSound("sounds/dieSound.mp3")
  jump=loadSound("sounds/jump.mp3")
  mario_running =  loadAnimation("images/mar1.png","images/mar2.png","images/mar3.png",
  "images/mar4.png","images/mar5.png","images/mar6.png","images/mar7.png");
  bgImage = loadImage("images/bgnew.jpg");
  brickImage = loadImage("images/brick.png");
  con=loadAnimation("images/con1.png","images/con2.png","images/con3.png","images/con4.png","images/con5.png","images/con6.png");
  csound=loadSound("sounds/coinSound.mp3")
  score=0;
  tur=loadAnimation("images/tur1.png","images/tur2.png","images/tur3.png","images/tur4.png","images/tur5.png");
  mush=loadAnimation("images/mush1.png","images/mush2.png","images/mush3.png","images/mush4.png","images/mush5.png","images/mush6.png")
  
}

function setup() {
  createCanvas(1530, 700);

  //create background sprite
  bgImage.resize(6000,800) ;bg = createSprite(1530,300,6000,800);
 
  bg.addImage(bgImage);
  

  //create Mario sprite
  mario = createSprite(200,505,20,50);
  mario.addAnimation("running", mario_running);
  mario.scale =0.2;
  mario.addAnimation("PASS",mario_collided)

  //create ground sprite
  ground = createSprite(200,585,400,10);
  ground.visible = false;

  //create restart sprite
  restart=createSprite(765,350)
  restart.addImage(restartImg)
  restart.visible=false;

  //create groups
  bricksGroup = new Group();
  coinGroup = new Group();
  obsGroup = new Group();

}

function draw(){
 //For changing animation
 /*for(i=0;i<obsGroup.length;i++){
   if(keyDown("up")){
     obsGroup.get(i).changeAnimation("tur")
    }
  }*/

   //gravity
  mario.velocityY = mario.velocityY + 0.7;
  if(gamestate=="PLAY"){
  
    bg.velocityX = -6;

  //scroll background
  if (bg.x < 100){
    bg.x=bg.width/4;
  }
  
  //prevent mario moving out with the bricks
  if(mario.x<200){
    mario.x=200;
  }

  //prevent mario moving out from top
  if(mario.y<50){
    mario.y=50;
  }

  //jump with space
  if((keyDown("space") || mouse.y>0) && mario.velocityY>0 ){
    mario.velocityY = -10;
    if(jump.isPlaying()){
      jump.stop()
    }
    jump.play()
  }

  

  //call the function to generate bricks
  generateBricks();

  //make mario catch the coin
  for(var i=0;i< (coinGroup).length;i++){
    var temp = (coinGroup).get(i) ;

    if (mario.isTouching(temp)){
      //increase score when coin is caught
      score++ ;
      //destroy coin once it is caught
      temp.destroy()
      temp=null ;
      //play sound when coin in caught
      csound.play()
    }
  }

  //Make Mario step(collide) on bricks
  for(var i = 0 ; i< (bricksGroup).length ;i++){
    var temp = (bricksGroup).get(i) ;
    
    if (temp.isTouching(mario)) {
      mario.collide(temp);
      
    }
        
  }
  //call the function to generate Obstacles
  generateObstacles()

  for(i=0;i<obsGroup.length;i++){
    var run=obsGroup.get(i)
    if(mario.isTouching(run)){
      gamestate="END"
      dieSound.play()
    }
  }
 }
 
 else if(gamestate=="END"){
   mario.changeAnimation("PASS",mario_collided)
   bg.velocityX = 0;
   mario.velocityY=0;
   mario.velocityX=0;
   coinGroup.setVelocityXEach(0);
   bricksGroup.setVelocityXEach(0);
   obsGroup.setVelocityXEach(0);
   coinGroup.setLifetimeEach(-1);
   bricksGroup.setLifetimeEach(-1);
   obsGroup.setLifetimeEach(-1)
   mario.y=585;
   restart.visible=true;
 }

  if(mousePressedOver(restart)){
    restartGame() ;
  }
  mario.collide(ground);
  drawSprites();
  textSize(50)
  strokeWeight("5")
  stroke("red")
  fill("white")
  text("coins collected"+ "=" + score ,10,50 ) 
}


function generateBricks(){
  if (frameCount % 70 === 0) {
    var brick = createSprite(1200,120,40,10);
    brick.y = random(50,400);
    brick.addImage(brickImage);
    brick.scale = 0.5;
    brick.velocityX = -5;
    
    brick.lifetime =250;
    bricksGroup.add(brick);
    generateCoins(brick.y-50);
  }

}

function generateCoins(y){
 if(frameCount%2==0){
   coin=createSprite(1200,500);
   coin.addAnimation("coin",con);
   coin.scale=0.07
   coin.y = y ;
   coin.velocityX=-5;
   coin.lifetime=250 ;
   coinGroup.add(coin) ;
  } 

}

function generateObstacles(){
 if(frameCount%180==0){
   obs=createSprite(1200,520)
   obs.velocityX=-6
   r=Math.round(random(1,2))
   switch(r){
     case 2:
       obs.addAnimation("mush",mush)
       break;

     case 1 :
      obs.addAnimation("tur",tur)
      break;
     default:
      break;
    }

   obs.scale=0.2
   obs.lifetime=250
   obsGroup.add(obs)
  } 
}  

function restartGame(){
  gamestate="PLAY"
  coinGroup.destroyEach()
  bricksGroup.destroyEach()
  obsGroup.destroyEach()
  score=0
  mario.changeAnimation("running" ,mario_running)
  restart.visible=false;
}









