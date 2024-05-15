//Kortspelet golf
//Klara Hemph
//14/5 2024
//Denna kod är ett kortspel som är baserad på slumpmässigt genererade kort och en möjlighet att byta plats på kort

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// konstanter
const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;
const radRatio = Math.PI / 180

function getRandomInt(max) { // Funktion för att generera en slumpmässig integer
  return Math.floor(Math.random() * max);
}

var enter = false;
var enterPressed = false;
var hasEnter = false;

function enterOnce() { //  funktion för vad som händer när man klickar på enter
  if (hasEnter == true) {
    enterPressed = false
  }
  if (hasEnter == false) {
    if (enter) {
      enterPressed = true
      hasEnter = true
    } 
  } else if (!enter) {
    hasEnter = false
  }
}

var space = false;

var p1_topLeft = false;
var p1_topRight = false;
var p1_bottomLeft = false;
var p1_bottomRight = false;

var p2_topLeft = false;
var p2_topRight = false;
var p2_bottomLeft = false;
var p2_bottomRight = false;

// Laddar alla bilder
var background = new Image();
background.src = "img/bg.png";

var swap_color = new Image();
swap_color.src = "img/swap_color.png";
var swap = new Image();
swap.src = "img/swap.png";
var keep_color = new Image();
keep_color.src = "img/keep_color.png";
var keep = new Image();
keep.src = "img/keep.png";
var space_color = new Image();
space_color.src = "img/space_color.png";
var space_img = new Image();
space_img.src = "img/space.png";

var p1_wins = new Image();
p1_wins.src = "img/p1_wins.png";
var p2_wins = new Image();
p2_wins.src = "img/p2_wins.png";
var score = new Image();
score.src = "img/score.png";
var tie = new Image();
tie.src = "img/tie.png";

var enter_arrow = new Image();
enter_arrow.src = "img/enter_arrow.png";
var press_enter = new Image();
press_enter.src = "img/press_enter.png";



// Alla tangentbordskommandon kopplade till vad som händer i spelet
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  // player 1
  if (e.key == "q") {
    p1_topLeft = true;
  }
  else if (e.key == "w") {
    p1_topRight = true;
  }
  else if (e.key == "a") {
    p1_bottomLeft = true;
  }
  else if (e.key == "s") {
    p1_bottomRight = true;
  }
  // player 2
  if (e.key == "i") {
    p2_topLeft = true;
  }
  else if (e.key == "o") {
    p2_topRight = true;
  }
  else if (e.key == "k") {
    p2_bottomLeft = true;
  }
  else if (e.key == "l") {
    p2_bottomRight = true;
  }

  if (e.key == " ") {
    space = true;
  }
  if (e.key == "Enter") {
    enter = true;
  }
}

function keyUpHandler(e) {
  // player 1
  if (e.key == "q") {
    p2_topLeft = false;
  }
  else if (e.key == "w") {
    p2_topRight = false;
  }
  else if (e.key == "a") {
    p2_bottomLeft = false;
  }
  else if (e.key == "s") {
    p2_bottomRight = false;
  }
  // player 2
  if (e.key == "i") {
    p2_topLeft = false;
  }
  else if (e.key == "o") {
    p2_topRight = false;
  }
  else if (e.key == "k") {
    p2_bottomLeft = false;
  }
  else if (e.key == "l") {
    p2_bottomRight = false;
  }

  if (e.key == " ") {
    space = false;
  }
  if (e.key == "Enter") {
    enter = false;
  }
}

function cloneArray(ar) { //Klonar en array
  new_ar = []
  for (let i = 0; i < ar.length; i++) {
    new_ar[i] = ar[i];
  }
  return new_ar
}

function calculateSum(ar) { //kalkylerar summan av en array
  sum = 0;
  for (let i = 0; i < ar.length; i++) {
    sum += ar[i];
  }
  return sum
}

function isNumeric(string) { // Berättar om en sträng har ett numeriskt värde eller inte
  return parseFloat(string).toString() === string.toString();
}

function duplicateLines(ar) {  //Sätter värdet på 5 och Kung till 0, annars sätter den värdet till en tom sträng, används för att stryka över korten i slutet
  for (let i = 0; i < ar.length; i++) {
    if (ar[i] == "0") {
      ar[i] = "/";
    } else if (ar[i] == "5" || ar[i] == "K") {
      ar[i] = "O";
    } else {
      ar[i] = "";
    }
  }
  return ar
}

function drawDuplicateLines(ar, x, y, w) {  // Ritar ut överstrykningen över korten efter spelet är slut
  ctx.font = "100px Arial";
  ctx.fillStyle = "#ff0000"; 
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  w2 = w / 2

  ctx.fillText(ar[0], x - w2, y - w2) // topLeft card
  ctx.fillText(ar[1], x + w2, y - w2) // top right card
  ctx.fillText(ar[2], x - w2, y + w2) // bottomLeft card
  ctx.fillText(ar[3], x + w2, y + w2) // bottom right card
}

function findDupes(array) { // funktion som byter bort alla dubbletter mot värdet 0
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        array[i] = 0;
        array[j] = 0;
      }
    }
  }
  return array;
}

function randomCard(d) { // function som tar ett slumpmässigt kort från leken och returnar den samt tar bort den från leken
  cardIndex = getRandomInt(d.length)
  card = d[cardIndex]
  d.splice(cardIndex, 1)
  return card
}

function calculateWorth(d) { // funktion som beräknar hur många en spelares kort hög är värd
  sum = 0;
  for (let i = 0; i < d.length; i++) {
    d[i] = String(d[i])
    d[i] = d[i].slice(0, -1)
  }
  d = findDupes(d)
  for (let i = 0; i < d.length; i++) {
    card = d[i]
    if (isNumeric(card)) {
      card = parseInt(card)
      if (card != 5) {
        sum += card
      }
    } else if (card == "J") {
      sum += 11
    } else if (card == "Q") {
      sum += 12
    }

  }
  return sum
}

function drawPlayer(player, locked, x, y, w) { // funktion för att måla spelarens kort
  ctx.font = "50px Arial";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  w2 = w / 2

  card1 = player[0];
  card2 = player[1];
  if (locked[0] == 0) {
    card1 = "X";
  }
  if (locked[1] == 0) {
    card2 = "X";
  }

  if (locked[0] == 0) { // top left card
    ctx.fillStyle = "#000000";
    ctx.fillText(card1, x - w2, y - w2)
  } else {
    ctx.fillStyle = "#37946e";
    ctx.fillText(card1, x - w2, y - w2)
  }

  if (locked[1] == 0) { // top right card
    ctx.fillStyle = "#000000";
    ctx.fillText(card2, x + w2, y - w2)
  } else {
    ctx.fillStyle = "#37946e";
    ctx.fillText(card2, x + w2, y - w2)
  }

  if (locked[2] == 0) { // top right card
    ctx.fillStyle = "#000000";
    ctx.fillText(player[2], x - w2, y + w2)
  } else {
    ctx.fillStyle = "#37946e";
    ctx.fillText(player[2], x - w2, y + w2)
  }

  if (locked[3] == 0) { // top right card
    ctx.fillStyle = "#000000";
    ctx.fillText(player[3], x + w2, y + w2)
  } else {
    ctx.fillStyle = "#37946e";
    ctx.fillText(player[3], x + w2, y + w2)
  }

}

function drawCenteredRect(x, y, w) {  // Funktion för att rita en centrerad rektangel
  ctx.beginPath();
  ctx.lineWidth = "5";
  ctx.rect(x - w / 2, y - w / 2, w, w);
  ctx.stroke();
}

function drawActiveCard(c, x, y) { // funktion för att måla det aktuella kortet i högen
  ctx.font = "50px Arial";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";

  ctx.fillText(c, x, y + 50);
}

function swapCards(ar, i, string) { // Funktion för att kunna byta kort med det aktuella kortet
  let temp = ar[i];
  ar[i] = string.value;
  string.value = temp;

  return [ar, string.value];
}

var started = false; // har spelet startat
var gameOver = false; // har någon vunnit
var keeping = false; // bool för ifall man är i swap mode eller keep mode

function game() {   // Funktion för att spela spelet med alla hjälpfunktioner
  enterOnce();
  if (gameOver == false) {
    if (started == false) {
      swapped = false;
      turn = 0; // Visar vilken spelares tur det är
      keeping = false;

    
      deck = ["1h", "1d", "1c", "1s",
        "2h", "2d", "2c", "2s",
        "3h", "3d", "3c", "3s",
        "4h", "4d", "4c", "4s",
        "5h", "5d", "5c", "5s",
        "6h", "6d", "6c", "6s",
        "7h", "7d", "7c", "7s",
        "8h", "8d", "8c", "8s",
        "9h", "9d", "9c", "9s",
        "10h", "10d", "10c", "10s",
        "Jh", "Jd", "Jc", "Js",
        "Qh", "Qd", "Qc", "Qs",
        "Kh", "Kd", "Kc", "Ks"];

      p1_locked = [0, 0, 0, 0]
      p1 = [];
      p1_points_ar = [];

      p2_locked = [0, 0, 0, 0]
      p2 = [];
      p2_points_ar = []

      p1_topLeft = false;
      p1_topRight = false;
      p1_bottomLeft = false;
      p1_bottomRight = false

      for (let i = 0; i < 4; i++) {  //Randomiserar spelarens kort
        card = randomCard(deck);
        p1[i] = card;
      }
      for (let i = 0; i < 4; i++) {
        card = randomCard(deck);
        p2[i] = card;
      }
      activeCard = { value: "" };
      activeCard.value = randomCard(deck);

      started = true;
    }
    if(enterPressed) {
      keeping = !keeping;
    }

    //Går igenom alla möjligheter och utfärdar därefter en aktion baserat på vad spelaren valt att göra
    if (turn == 0) {
      if (space && swapped == false) {
        activeCard.value = randomCard(deck);
        swapped = true;
      }

      if (p1_topLeft && p1_locked[0] == false) {
        if (keeping == false) {
          swapCards(p1, 0, activeCard);
        }
        p1_locked[0] = 1;
        swapped = false;
        turn = 1;
      } else if (p1_topRight && p1_locked[1] == false) {
        if (keeping == false) {
          swapCards(p1, 1, activeCard);
        }
        p1_locked[1] = 1;
        swapped = false;
        turn = 1;
      } else if (p1_bottomLeft && p1_locked[2] == false) {
        if (keeping == false) {
          swapCards(p1, 2, activeCard);
        }
        p1_locked[2] = 1;
        swapped = false;
        turn = 1;
      } else if (p1_bottomRight && p1_locked[3] == false) {
        if (keeping == false) {
          swapCards(p1, 3, activeCard);
        }
        p1_locked[3] = 1;
        swapped = false;
        turn = 1;
      }

    } else if (turn == 1) {
      if (space && swapped == false) {
        activeCard.value = randomCard(deck);
        swapped = true;
      }

      if (p2_topLeft && p2_locked[0] == false) {
        if (keeping == false) {
          swapCards(p2, 0, activeCard);
        }
        p2_locked[0] = 1;
        swapped = false;
        turn = 0;
      } else if (p2_topRight && p2_locked[1] == false) {
        if (keeping == false) {
          swapCards(p2, 1, activeCard);
        }
        p2_locked[1] = 1;
        swapped = false;
        turn = 0;
      } else if (p2_bottomLeft && p2_locked[2] == false) {
        if (keeping == false) {
          swapCards(p2, 2, activeCard);
        }
        p2_locked[2] = 1;
        swapped = false;
        turn = 0;
      } else if (p2_bottomRight && p2_locked[3] == false) {
        if (keeping == false) {
          swapCards(p2, 3, activeCard);
        }
        p2_locked[3] = 1;
        swapped = false;
        turn = 0;
      }
    }

    // Kollar vem som har vunnit
    if (calculateSum(p1_locked) == 4 && calculateSum(p2_locked) == 4) {
      p1_points_ar = cloneArray(p1)
      p2_points_ar = cloneArray(p2)
      p1_points = calculateWorth(p1_points_ar)
      p2_points = calculateWorth(p2_points_ar)
      gameOver = true;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);

    // Ritar "Swap" och "keep" indikatorerna tilsammans med enterpilen
    ctx.drawImage(swap, 121, 152);
    ctx.drawImage(keep, 584, 152);
    if (keeping == false) {
      ctx.drawImage(swap_color, 121, 152);
      ctx.drawImage(enter_arrow, 622, 220)
    } else {
      ctx.drawImage(keep_color, 584, 152);
      ctx.drawImage(enter_arrow, 180, 220)
    }

    // Ritar kortplatsindikatorn
    ctx.drawImage(space_img, 400, 56);
    if (!swapped) {
      ctx.drawImage(space_color, 400, 56);
    }

    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";


    // Ritar det aktiva kortet
    drawActiveCard(activeCard.value, halfWidth, halfHeight - (halfHeight / 1.85))

    // Ritar allt som ska finnas när man har förlorat
    if (gameOver == true) {
      ctx.drawImage(background, 0, 0);
      if(p1_points < p2_points) {
        ctx.drawImage(p1_wins, 63, 84)
      } else if(p2_points < p1_points) {
        ctx.drawImage(p2_wins, 63, 84)
      } else if(p2_points == p1_points){
        ctx.drawImage(tie, 63, 100)
      }
      ctx.drawImage(score, 0, 0);

      ctx.fillStyle = "#d22b2b";
      ctx.fillText(p1_points, 320, 43);
      ctx.fillStyle = "#37946e";
      ctx.fillText(p2_points, 775, 43);

      p1_points_ar = duplicateLines(p1_points_ar)
      p2_points_ar = duplicateLines(p2_points_ar)
      drawDuplicateLines(p1_points_ar, halfWidth - (halfWidth / 2), halfHeight + (halfHeight / 3), 100)
      drawDuplicateLines(p2_points_ar, halfWidth + (halfWidth / 2), halfHeight + (halfHeight / 3), 100)

      ctx.drawImage(press_enter, 263, 562);
    }

    drawPlayer(p1, p1_locked, halfWidth - (halfWidth / 2), halfHeight + (halfHeight / 3), 100)
    drawPlayer(p2, p2_locked, halfWidth + (halfWidth / 2), halfHeight + (halfHeight / 3), 100)

    if (turn == 0) { // Ritar "select" boxen
      drawCenteredRect(halfWidth - (halfWidth / 2), halfHeight + (halfHeight / 3), 215)
    } else if (turn == 1) {
      drawCenteredRect(halfWidth + (halfWidth / 2), halfHeight + (halfHeight / 3), 215)
    }
  } else {
    if (enter) { // starta o
      started = false;
      gameOver = false;
    }
  }
}

const interval = setInterval(game, 10); // Kör hela loopen