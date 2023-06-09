//Projet :
//Il va faire tout noir !
//By: 
//- Elsa
//- Gianni
//- Florian


//déclaration variable globale
let cx, cy, dx, dy;     //variable pour les differentes horloges
let code = "vide";



//Horloge
let secondsRadius;
let minutesRadius;      // Horloge a aiguilles
let hoursRadius;
let clockDiameter;      //Taille horloge
let deltaClosure;       //différence entre heure de maintenant et heure de cloture


//Déclaration des images globales
let imgTram;
let imgRail;
let imgArret;
let imgClock;
let imgAdaHorloge;
let imagePokemondraw;    //Fait appel a l'API pokemon
let namePokemon;


//Coordonées mobile du tram
let xImgTram1 = 0;
let xImgTram2 = 0;


//Récuperation de données de l'API Tan
let passage1 = "Vide";
let direction1 = "Vide";
let passage2 = "Vide";
let direction2 = "Vide";
let name1 = "vide";
let name2 = "vide";
let distance1 = "vide";
let distance2 = "vide";

//Conditions pour le tram qui repart
let buffer1 = 0;
let buffer2 = 0;

//Coordonnées
let latitude;
let longitude;

//------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------Déclaration des fonctions------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//Clocks

function drawDigitalClock() {
  textSize(40);
  strokeWeight(2);      //Mise en page
  stroke(0);
  noStroke();
  fill(49, 170, 78);

  let dHour = hour();
  let dMin = minute();      //Stockage fonctions native P5 pour l'heure
  let dSec = second();

  //Mise en forme : 00:00:00
  if (dHour < 10) {
    dHour = "0" + hour();
  }
  if (dMin < 10) {
    dMin = "0" + minute();
  }
  if (dSec < 10) {
    dSec = "0" + second();
  }
  text(dHour + ":" + dMin + ":" + dSec, dx, dy);       //affichage
}

function drawClock() {
  //Draw the clock background
  image(imgAdaHorloge, cx - 91, cy - 97, 174, 193);
  image(imgClock, cx - 91, cy - 87, imgClock.width / 2, imgClock.height / 2);

  //Angles for sin() and cos() start at 3 o'clock;
  //subtract HALF_PI to make them start at the top
  let s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  let m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  let h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

  //Draw the hands of the clock
  stroke(0);
  strokeWeight(1);
  line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
  strokeWeight(2);
  line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
  strokeWeight(4);
  line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);
}

//Set the closure time, compare to now and print it when relevent. Called in drawTitle()
function closure() {
  let closureTime = (new Date('Janvier 1, 1970 17:00:00')).getTime();
  let nowTime = (new Date()).getTime();
  deltaClosure = new Date(closureTime - nowTime);
  if (deltaClosure.getHours() < 8) {
    fill(231, 75, 52);
    text("Cloture dans " +
      (deltaClosure.getHours() - 1) + "h" +
      (deltaClosure.getMinutes()) + "m" +
      (deltaClosure.getSeconds()) + "s", 40, 75);
  }
}

//Set the launch time, compare to now and print it when relevent. Called in drawTitle()
function launch() {
  let launchTime = (new Date('Janvier 1, 1970 9:30:00')).getTime();
  let nowTime = (new Date()).getTime();
  if ((nowTime - launchTime) < 0) {
    deltaLaunch = new Date(launchTime - nowTime);
    if (deltaLaunch.getHours() < 4) {
      fill(231, 75, 52);
      text("Lancement dans " +
        (deltaLaunch.getHours()) + "h" +
        (deltaLaunch.getMinutes()) + "m" +
        (deltaLaunch.getSeconds()) + "s", 40, 75);
    }
  }
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//Pokemon

//Création de bouton pour appel API pokemon
function buttonPokemon() {
  let button;
  imagePokemondraw = "";
  button = createButton('get your animal totem');
  button.position(30, 180);
  button.mouseClicked(changePokemon);       //Action avec appel de fonction au click
}

//Sort une image random de Pokemon venant de l'API
const changePokemon = async () => {                                       //Fonction fléchée
  let randomNumber = Math.ceil(Math.random() * 150) + 1                   //.random=> nombre [0, 149,99] + .ceil => plafone la valeur entière au dessus
  let requestString = `https://pokeapi.co/api/v2/pokemon/${randomNumber}`;//On fait +1 a la fin pour éviter le 0(no pokemon)
  let data = await fetch(requestString);                                  //Appel API
  let dataOK = await data.json();                                         //Reponse traduite en Json
  let imagePokemon = dataOK.sprites.other.dream_world.front_default;      //Récuperation avec chemin d'acces dans l'objet pour l'image
  namePokemon = dataOK.name;                                              //Renvoie l'image
  imagePokemondraw = loadImage(imagePokemon);                             //Chargement image
}

function drawPokemon() {
  if (imagePokemondraw) {
    strokeWeight(3);
    stroke(255);
    fill(238, 199, 202);
    rect(20, 200, 400, 300);
    fill(0);
    rect(30, 210, 380, 280);
    image(imagePokemondraw,
      220 - (imagePokemondraw.width / 2) / 2,
      350 - ((imagePokemondraw.height / 2) / 2),
      imagePokemondraw.width / 2,
      imagePokemondraw.height / 2);     //Affichage du pokemon sans erreur quand rien dans la variable
    fill(231, 75, 52);
    noStroke();
    text(namePokemon, 40, 470);
  }
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//Tram et Arret

//Fonction qui récupère la position GPS de l'utilisateur (autorisation demandée via le naviguateur)
navigator.geolocation.getCurrentPosition(position => {
  const { latitude, longitude } = position.coords;
  tanPos(latitude, longitude);
});

//Fait un appel API à la TAN pour trouver les arrêts les plus proches dans un rayon pré déterminé
async function tanPos(latitude, longitude) {
  const response = await fetch(`https://open.tan.fr/ewp/arrets.json/${latitude}/${longitude}`);
  const pos = await response.json();
  code = pos[0].codeLieu;        //Code de l'arrêt le plus proche
  name1 = pos[0].libelle;        //Nom de l'arrêt le plus proche
  distance1 = pos[0].distance;   //Distance de l'arrêt
  name2 = pos[1].libelle;
  distance2 = pos[1].distance;
  reseauTan(code);               //Appel API pour récupérer les passages
}

//
async function reseauTan(code) {
  const response = await fetch(`https://open.tan.fr/ewp/tempsattente.json/${code}`);    //Appel API Tan
  const tram = await response.json();        //Traduction pour comprehension de la reponse
  console.log(tram);                         //Vérifier si l'API de la Tan bug ou si c'est nous ;)
  let buf1 = false;
  let buf2 = false;
  for (const data of tram) {
    if (data.sens == 1 && !buf1) {
      passage2 = data.temps;
      direction2 = data.terminus;
      buf1 = true;
    } else if (data.sens == 2 && !buf2) {
      passage1 = data.temps;
      direction1 = data.terminus;
      buf2 = true;
    }
    if (buf1 == true && buf2 == true) {
      break;
    }
  }
  console.log(passage1 + " vers " + direction1);
  console.log(passage2 + " vers " + direction2);
  setTimeout(reseauTan, 5000, code);        //Ré-execution toutes les 5 sec
}

function drawCloseArret() {
  textFont('Helvetica');
  noStroke();
  fill(49, 170, 78);
  textSize(25);
  stroke(0);
  strokeWeight(4);
  rect(662 - (172 / 2), 200, (2 * 172), 110);              //Affichage des arrets les plus proche
  fill(0);
  noStroke();
  text("Arrêts les plus proches ", 595, 235);
  text("=> " + name1 + " à " + distance1, 595, 265);
  text("=> " + name2 + " à " + distance2, 595, 295);
}


function drawTram() {
  let yImgTram1 = 600;                   //Position Y fixe  
  if (passage1 != "proche" && !buffer1) {
    xImgTram1 = -600;
  } else if (passage1 == "proche") {
    xImgTram1 += 5;
    if (xImgTram1 > 570) {              //Premier mouvement du tramway jusqu'a l'arret
      buffer1 = 1;
      xImgTram1 = 570;
    }
  } else if (passage1 != "proche" && buffer1) {
    xImgTram1 += 5;
    if (xImgTram1 == 2000) {           //Départ tramway de l'arret
      xImgTram1 = -600;
      buffer1 = 0;
    }
  }
  if (passage2 != "proche" && !buffer2) {
    xImgTram2 = 1700;
  } else if (passage2 == "proche") {
    xImgTram2 -= 5;
    if (xImgTram2 < 570) {             //Premier mouvement du tramway jusqu'a l'arret
      buffer2 = 1;
      xImgTram2 = 570;
    }
  } else if (passage2 != "proche" && buffer2) {
    xImgTram2 -= 5;
    if (xImgTram2 == -600) {           //Départ tramway de l'arret
      xImgTram2 = 1700;
      buffer2 = 0;
    }
  }

  //Rail autour arret de tram
  let xRail = 0;                              //Coordonée de base du premier rail
  for (let i = 0; i < 35; i++) {
    image(imgRail, xRail, 550, 50, 50);      //Rail du haut
    xRail += 50;
  }
  image(imgTram, xImgTram2, yImgTram1 - 100, imgTram.width / 2, imgTram.height / 2);       //Image du tram en mouvement
  image(imgArret, 600, yImgTram1 - 90, 350, 175, 20);
  image(imgAda, 713, 568, 28, 34);
  xRail = 0;
  for (let i = 0; i < 35; i++) {
    image(imgRail, xRail, 650, 50, 50);      //Rail du bas
    xRail += 50;
  }
  image(imgTram, xImgTram1, yImgTram1, imgTram.width / 2, imgTram.height / 2);       //Image du tram en mouvement
}

function drawWait() {
  textSize(17);
  noStroke();
  fill(0);                       //Affichage temps attente
  text(passage1 + " vers " + direction1, 30, 640);
  text(passage2 + " vers " + direction2, 1200, 530);
}

function drawNameArret() {
  stroke(0);
  strokeWeight(4);
  fill(49, 170, 78);              //Cadre vert derriere le nom de l'arret
  rect(662, 455, 172, 55);
  noStroke();
  textSize(25);
  fill(0, 0, 0);                 //Nom arret dans le cadre
  text(name1, 680, 490);
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//Titre de la page

function drawTitle() {
  fill(255, 0, 0);
  textSize(40);
  textFont('Helvetica');      //Police d'écriture
  noStroke();
  text("Ada Tech School", 40, 55);
  textSize(20);
  fill(220, 10, 50);
  strokeWeight(1);
  closure();
  launch();
  if (deltaClosure.getHours() == 0 || deltaClosure.getHours() > 8) {
    textSize(30);
    fill(231, 75, 52);
    text("Time to get away !", 40, 110);
  }
}

function header() {
  strokeWeight(7)
  stroke(0)
  fill(0)
  ellipse(1382, 150, 183, 183)
  fill(238, 199, 202)
  rect(3, 3, 1500, 125)
}


//------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------Fonctions natives P5.JS------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------


function setup() {
  //Création zone dessin sur toute la page
  createCanvas(windowWidth, windowHeight);          //Création feuille de dessin
  let radius = min(200, 200) / 2;                   //NE PAS TOUCHER SOUS PEINE DE MORT

  //Proportionalité de l'horloge si changement de taille
  secondsRadius = radius * 0.71;
  minutesRadius = radius * 0.6;
  hoursRadius = radius * 0.5;
  clockDiameter = radius * 1.7;

  //Coordonnés de l'horloge a aiguille
  cx = width - 150;
  cy = 150;
  //Heure digitale
  dx = width - 235;
  dy = 300;

  //Création images
  imgTram = loadImage('./Img/tram.png');
  imgArret = loadImage('./Img/arret.png');
  imgAda = loadImage('./Img/ada.jpg');
  imgClock = loadImage('./Img/horloge.png');
  imgRail = loadImage('./Img/rail1.png');
  imgAdaHorloge = loadImage('./Img/adaRond.png');

  //Appel du button
  buttonPokemon();
}

function draw() {             //Execution 60 fois par seconde
  background(255);
  header()
  drawClock();
  drawDigitalClock();
  drawCloseArret();
  drawNameArret();
  drawWait();
  drawTram();
  drawTitle();
  drawPokemon();
}