// first select the text container
let mainDiv = document.querySelector(".test-div");
let resultDiv = document.querySelector(".result-div");
let textContainer = document.querySelector(".container");
let conatinerRange = document.querySelector(".box .range");
let fastSpan = document.querySelector(".speed .fast");
let infoSection = document.querySelector(".info");
let acuurecyPercentage = document.querySelector(".accuracy .percentage");
let paload = document.querySelector(".paload");
let accuracyCircle = document.querySelector(".details");
let timeCircle = document.querySelector(".time");
let speedCircle = document.querySelector(".speed-statics");
let accuracyReslult = document.querySelector(".accuracy .box");
let speedResult = document.querySelector(".speed-result");
let timeResult = document.querySelector(".time-result");
let tryAgainButton = document.querySelector(".try-again");
let stars = document.querySelector(".stars");
console.log(timeCircle);
//setting the letters that every finger responsibel for
const fingers = {
  finger1: ["1", "q", "a", "z"],
  finger2: ["2", "w", "s", "x"],
  finger3: ["3", "e", "d", "c"],
  finger4: ["4", "r", "f", "v", "5", "t", "g", "b"],
  finger5: [" "],
  finger7: ["6", "y", "h", "n", "7", "u", "j", "m"],
  finger8: ["8", "i", "k", ","],
  finger9: ["9", "o", "l", "."],
  finger10: ["0", "p", ";", "/", "-", "[", "=", "]", "'", "\\"],
};
//setting counters
let articleNum;
let currentIndex = 0;
let startTime;
let currentTime;
let speed;
let accuracy;
let wrongsNum;
let thePerviousFinger;
let spaceNum = 0;
let stop = true;
let typedLetters;
// the main funciton
function runProgram() {
  // fetching the json file that contain the articles
  fetch("./josns/easy.json")
    .then((element) => element.json())
    .then((myData) => {
      //choose a random article
      randomiseItems(Object.keys(myData).length);

      // store the artice in a varible and turn it to array
      let article = myData[`article${articleNum}`].split("");
      // split it to words
      let articleWord = myData[`article${articleNum}`].split(" ");
      //setting the number of indexes in the article
      let articleLength = article.length;

      // words num
      let wordsNum = articleWord.length;
      // putting every wrod in a span and store it into the text conatiner
      insirtingLetters(article);

      // select all the spans inside the div
      let letters = Array.from(document.querySelectorAll(".container span"));

      //handle with cliking on the keyboard
      document.addEventListener("keydown", (ele) => {
        // this conditio to forbidden the user from in typing any thing after ending the paragraph
        if (currentIndex < articleLength && stop === true) {
          // this to check if the input is letter or sympol or
          if (/^(\w|\W){1}$/.test(ele.key)) {
            //THE checker functin that handle the right and wrong answer
            checker(ele.key, article, letters, articleLength);
            // increasing the current index
            currentIndex++;
          } else if (ele.key === "Backspace") {
            // this codition for delete

            if (currentIndex > 0) {
              // it back to the preivious index
              currentIndex--;

              // the delete funtion that hande the logic of the delete
              hadleDelete(letters, articleLength, currentIndex);
            }
          }
          // handle hands funciont
          handleHands(ele.key);

          //calculate speed and acuurecy
          timeCalc(article, letters);

          // function that stop the program when the mistakes more that a specific number
          mistakes();

          // range move
          rangeMove(article);

          //show results
          showResults(articleLength);

          //scroll to new span
          scrollToNewSpan(articleLength);
        }
      });
    });
}
runProgram();
// create random choosen for the articel

function randomiseItems(arCount) {
  articleNum = Math.floor(Math.random() * arCount) + 1;
}

// putting every wrod in a span and store it into the text conatiner
function insirtingLetters(article) {
  article.forEach((element, index) => {
    let newSpan = document.createElement("span");
    if (index === 0) {
      newSpan.classList.add("here");
    }
    newSpan.textContent = element;
    textContainer.appendChild(newSpan);
  });
  textContainer.classList.add("active");
}

// making the checker fuction
function checker(key, article, letters, articleLength) {
  if (key === article[currentIndex]) {
    // if right

    // remove the here class a the current element
    letters[currentIndex].classList.remove("here");
    // adding the right class
    letters[currentIndex].classList.add("right");
    // adding here class to the next span if it not the last span
    if (currentIndex !== articleLength - 1) {
      letters[currentIndex + 1].classList.add("here");
    }
  } else {
    // if it wrong

    // remove the here class a the current element
    letters[currentIndex].classList.remove("here");

    // add the wrong class a the current element
    letters[currentIndex].classList.add("wrong");

    // adding here class to the next span if it not the last span
    if (currentIndex !== articleLength - 1) {
      letters[currentIndex + 1].classList.add("here");
    }
  }
}

// removning the active class when backspace
function hadleDelete(letters, articleLength, currentIndex) {
  letters[currentIndex].classList.remove("right");
  if (currentIndex !== articleLength - 1 || currentIndex !== 1) {
    letters[currentIndex + 1].classList.remove("here");
  }
  letters[currentIndex].classList.add("here");
  if (letters[currentIndex].classList.contains("wrong")) {
    letters[currentIndex].classList.remove("wrong");
    letters[currentIndex].classList.add("wasWrong");
  }
}

// scroll to the new spam
function scrollToNewSpan(articleLength) {
  if (currentIndex < articleLength - 2) {
    const element = document.querySelector(".here");
    element.scrollIntoView({
      behavior: "smooth", // Scroll smoothly instead of instantly
      block: "start", // Scroll so the top of the element is at the top of the viewport
      inline: "start", // Scroll so the element is as close to the center of the viewport as possible
    });
  }
}

// funciton to handle the hands
function handleHands(key) {
  let hereSpan = document.querySelector(".here");
  if (hereSpan) {
    getHere = hereSpan.textContent.toLocaleLowerCase();
  }
  if (thePerviousFinger) {
    let getThePrviousFinger = document.querySelector(
      `.hands .${thePerviousFinger} img`
    );
    getThePrviousFinger.classList.remove("active");
  }
  for (let finger in fingers) {
    if (fingers[finger].includes(getHere)) {
      let theRightFinger = document.querySelector(`.hands .${finger} img`);
      theRightFinger.classList.add("active");
      thePerviousFinger = finger;
    }
  }
}

// function to calculate time
function timeCalc(letters) {
  if (currentIndex < letters.length && currentIndex !== 0) {
    spaceNum = 0;
    typedLetters = letters.slice(0, currentIndex - 1).join("");
    let spaceArr = typedLetters.match(/\s/g);

    if (spaceArr) {
      spaceNum = spaceArr.length;
    }
  } else if (currentIndex === letters.length) {
    spaceNum++;
  }
  if (currentIndex === 1) {
    startTime = new Date();
  }
  currentTime = new Date();
  let timeSpent = (currentTime - startTime) / 1000 / 60;
  if (spaceNum === 1) {
    setTimeout(() => {
      infoSection.classList.add("active");
    }, 2000);
  }
  if (spaceNum > 0) {
    speed = Math.round(spaceNum / timeSpent);

    if (speed) {
      fastSpan.textContent = speed;
    }
  }

  let wrongs = document.querySelectorAll(".wrong");
  if (wrongs) {
    wrongsNum = wrongs.length;
    accuracy = `${Math.round(100 - (wrongsNum / letters.length) * 100)}%`;
    acuurecyPercentage.textContent = accuracy;
  }
}

//calculate the mistakes num
function mistakes() {
  if (wrongsNum === 30) {
    paload.classList.add("active");
    stop = false;
    let restartButton = document.querySelector(".paload .box span");
    restartButton.onclick = function () {
      window.location.reload();
    };
  }
}

//function to deal with the range under the container
function rangeMove(article) {
  let articleLength = article.length;

  let rate = Math.round((typedLetters.length / articleLength) * 100);
  conatinerRange.style.width = `${rate + 1}%`;
}

function drawCircle1(linesNum, deg, clircleDiv) {
  for (let i = 1; i <= linesNum; i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.transform = `rotate(${deg * i}deg)`;
    clircleDiv.appendChild(line);
  }
}
function drawCircle2(linesNum, deg, clircleDiv) {
  for (let i = 15; i <= linesNum + 15; i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.transform = `rotate(${deg * i}deg)`;
    clircleDiv.appendChild(line);
  }
}

function showResults(articleLength) {
  if (currentIndex === articleLength) {
    drawCircle1(20, 9, accuracyCircle);
    drawCircle2(20, 9, speedCircle);
    drawCircle1(10, 36, timeCircle);
    //appending accuracy
    let accuracyCounter = 0;
    let accuracyInerv = setInterval(() => {
      accuracyReslult.textContent = `${accuracyCounter + 1}%`;
      accuracyCounter++;
      if (`${accuracyCounter}%` === accuracy) {
        clearInterval(accuracyInerv);
      }
    }, 10);

    // appending speed
    //appending accuracy
    let speedCounter = 0;
    let speedInerv = setInterval(() => {
      speedResult.textContent = speedCounter + 1;
      speedCounter++;
      if (speedCounter === speed) {
        clearInterval(speedInerv);
      }
    }, 10);

    // calc duration
    let duration = currentTime - startTime;
    console.log(duration);
    let totalSeconds = Math.floor(duration / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    console.log(minutes);
    console.log(seconds);
    timeResult.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
    mainDiv.classList.add("de-active");
    resultDiv.classList.add("active");
    tryAgainButton.onclick = function () {
      window.location.reload();
    };
    // handle the start
    if (speed < 10) {
      handleStars(1, 4);
    } else if (speed < 20) {
      handleStars(2, 3);
    } else if (speed < 30) {
      handleStars(3, 2);
    } else if (speed < 40) {
      handleStars(4, 1);
    } else {
      handleStars(5, 0);
    }
  }
}

//handle stars
function handleStars(done, notdone) {
  let counter = 0;
  let goldStars = setInterval(() => {
    if (counter < done) {
      let star = document.createElement("img");
      star.src = "imgs/done.png";
      stars.appendChild(star);
      star.classList.add("done", `star${counter + 1}`, "active");
      counter++;
    }
    if (counter >= done) {
      let star = document.createElement("img");
      star.src = "imgs/not-done.png";
      star.classList.add("done", `star${counter + 1}`);
      stars.appendChild(star);
      counter++;
      if (counter === notdone + done) {
        stars.style.justifyContent = "center";
        clearInterval(goldStars);
      }
    }
  }, 250);
}
