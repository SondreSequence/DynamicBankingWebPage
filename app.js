const loanButton = document.getElementById("loanbutton");
const workButton = document.getElementById("workbutton");
const bankButton = document.getElementById("bankbutton");
const repayButton = document.getElementById("repayloan");
const buyButton = document.getElementById("buybutton");
const payElement = document.getElementById("pay");
const loanElement = document.getElementById("loanp");
const balanceElement = document.getElementById("balance");
const imgElement = document.getElementById("pcimg");
const titleElement = document.getElementById("title");
const descElement = document.getElementById("desc");
const priceElement = document.getElementById("price");
const select = document.getElementById("selectlist");
const pcInfoText = document.getElementById("pcInfoText");

//Add event listeners to buttons so that when clicked, the corresponding functions are called
loanButton.addEventListener("click", addLoan);
workButton.addEventListener("click", addWork);
bankButton.addEventListener("click", storeMoney);
repayButton.addEventListener("click", repayLoan);
buyButton.addEventListener("click", buyPc);

// Initialize global variables to keep track of the loan, work, bank and id of the selected index from select.
let loan = 0;
let work = 0;
let bank = 0;
let selectedID = 0;
let workClickCounter = 0;

async function getComputersData() {
  const response = await fetch(
    "https://hickory-quilled-actress.glitch.me/computers",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  return await response.json();
}

function addLoan() {
  let pay = parseInt(payElement.innerText.split(":")[1]);
  let wantedLoan = prompt("Amount: ");
  if (pay == 0 || loan * 2 > pay || wantedLoan * 2 > pay || !loan == 0) {
    alert("You either have to work more or pay off your loan!");
    return;
  } else {
    if (wantedLoan < 0) {
      alert("Idiot no!");
      return;
    }
    loan += parseInt(wantedLoan);
    loanElement.innerText = "Loan : " + loan;
    repayButton.style.display = "block";
  }
}

async function buyPc() {
  const pc = await getComputersData();
  const pcprice = pc[selectedID].price;
  if (bank >= pcprice) {
    bank -= pcprice;
    balanceElement.innerText = "Balance: " + bank + " kr";
    alert("Congrats you bought the " + pc[selectedID].title);
    const imgElement = document.getElementById("donaldimg");
    imgElement.style =
      "position: absolute; top: 0; right: 0; padding: 0.1em; margin-right: 1.1em; margin-top: 1em";
    imgElement.src = "images/happy_donald.png";
    imgElement.style.width += 10;
  } else {
    alert("You don't have enough money in your account!");
  }
}

function repayLoan() {
  if (work - loan >= 0) {
    payElement.innerText = "Pay: " + (work - loan);
    bank += work - loan;
    loan = 0;
    work = 0;
    payElement.innerText = "Pay: " + work + " kr";
    loanElement.innerText = "Loan : " + loan + " kr";
    balanceElement.innerText = "Balance: " + bank + " kr";
    repayButton.style.display = "none";
  } else {
    alert("Work more to be eligible for a loan!");
  }
}

function storeMoney() {
  let deducted = work / 10;
  if (loan > 0) {
    work -= deducted;
    if (loan - deducted >= 0) {
      loan -= deducted;
      loanElement.innerText = "Loan : " + loan + " kr";
    } else {
      bank += loan - deducted;
      loan = 0;
      loanElement.innerText = "Loan : " + loan + " kr";
      balanceElement.innerHTML = "Balance: " + bank + " kr";
      repayButton.style.display = "none";
    }
  }

  bank += work;
  work = 0;
  payElement.innerText = "Pay : " + work + " kr";
  balanceElement.innerText = "Balance: " + bank + " kr";
}

function addWork() {
  work += 100;
  payElement.innerText = "Pay : " + work + " kr";
  // Since the meme love is real :P
  workClickCounter++;
  if (workClickCounter == 3)
    window.open("https://youtu.be/dQw4w9WgXcQ", "_blank");
}

async function addPcs() {
  const pcs = await getComputersData();
  for (let i = 0; i < pcs.length; i++) {
    populateSelect(pcs[i]);
  }
}

// Functions to populate select and it's options with data

const populateSelect = (pc) => {
  const selectElement = document.getElementById("selectlist");
  console.log(document.getElementById("loanbutton").innerText);
  const option = document.createElement("option");
  option.value = pc.price;
  option.text = pc.title;
  option.id = pc.id;
  selectElement.appendChild(option);
};

async function populateSelectedOption(id) {
  const pc = await getComputersData();
  let output = JSON.stringify(pc[id].specs)
    .replace(/[\[\]\"]/g, "")
    .replace(/,/g, ",\n");
  pcInfoText.innerText = output;
  descElement.innerText = pc[id].description;
  titleElement.innerText = pc[id].title;
  priceElement.innerText = "Price: " + pc[id].price + " kr";
  imgElement.src = "https://hickory-quilled-actress.glitch.me/" + pc[id].image;
  imgElement.onerror = function () {
    imgElement.src =
      "https://hickory-quilled-actress.glitch.me/" +
      pc[id].image.replace("jpg", "png");
  };
}

// Eventlistener to grab the right data according to what is selected
select.addEventListener("change", (event) => {
  const selectedIndex = event.target.selectedIndex;
  const options = event.target.options;
  const selectedOption = options[selectedIndex];
  selectedID = selectedOption.id - 1;
  console.log(selectedID);
  populateSelectedOption(selectedID);
});

// Function calls on page load
addPcs();
populateSelectedOption(0);
