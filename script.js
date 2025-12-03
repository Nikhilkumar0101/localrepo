const billInput = document.querySelector("#bill");
const tipButtons = document.querySelectorAll(".tip-percent-btn");
const customTipInput = document.querySelector("#custom-tip");
const peopleInput = document.querySelector("#num-people");
const tipAmountDisplay = document.querySelector("#tip-amount-display");
const totalAmountDisplay = document.querySelector("#total-amount-display");
const resetButton = document.querySelector("#reset-button");

billInput.addEventListener("input", calculateTip);

tipButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // tipPercentage=button.dataset.tip;
    tipButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    tipButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
    customTipInput.value = "";
    // console.log(`Button ${tipPercentage}% clicked`);
    calculateTip();
  });
});

customTipInput.addEventListener("input", () => {
  tipButtons.forEach((btn) => {
    btn.classList.remove("active");
    btn.classList.remove("selected");
  });
  // console.log(`Custom Tip:${customTipInput.value}%`);
  calculateTip();
});

peopleInput.addEventListener("input", calculateTip);

resetButton.addEventListener("click", () => {
  console.log("reset btn clicked");
  resetCalculator();
});

function calculateTip() {
  // console.log("calculateTip( ) function executed");
  const billValueStr = billInput.value;
  const peopleValueStr = peopleInput.value;
  const customTipValueStr = customTipInput.value;
  // let selectedButtonTipStr=null;
  // const activeButton=document.querySelector(".tip-percent-btn.active");
  // if(activeButton){
  //     selectedButtonTipStr=activeButton.dataset.tip;
  // }

  const billAmount = parseFloat(billValueStr);
  const numberOfPeople = parseFloat(peopleValueStr);
  const customTipPercent = parseFloat(customTipValueStr);
  // const selectedButtonTipPercent = selectedButtonTipStr ? parseFloat(selectedButtonTipStr) : null;

  const isBillValid = !isNaN(billAmount) && billAmount >= 0;
  // console.log(`validating - bill amount (${billAmount}) is valid: ${isBillValid}`);
  let isTipValid = false;
  let isPeopleValid = false;
  const isCustomTipValid =
    customTipValueStr === "" ||
    (!isNaN(customTipPercent) && customTipPercent >= 0);

  let actualTipPercent = 0;
  if (
    customTipValueStr !== "" &&
    !isNaN(customTipPercent) &&
    customTipPercent >= 0
  ) {
    actualTipPercent = customTipPercent;
  } else if (customTipValueStr === "") {
    const activeButton = document.querySelector(".tip-percent-btn.active");
    if (activeButton) {
      const selectedButtonTipPercent = parseFloat(activeButton.dataset.tip);
      if (!isNaN(selectedButtonTipPercent) && selectedButtonTipPercent >= 0) {
        actualTipPercent = selectedButtonTipPercent;
      }
    }
  }
  isTipValid = !isNaN(actualTipPercent) && actualTipPercent >= 0;
  // console.log(`validating - Actual Tip percent (${actualTipPercent}) is valid: ${isTipValid}`);

  let totalTipAmount = 0;
  if (isBillValid && isTipValid) {
    totalTipAmount = billAmount * (actualTipPercent / 100);
  }
  let totalBillAmount = 0;
  if (isBillValid) {
    totalBillAmount = billAmount + totalTipAmount;
  }

  isPeopleValid =
    !isNaN(numberOfPeople) &&
    numberOfPeople > 0 &&
    Number.isInteger(numberOfPeople);
  // console.log(`validating - Number of people (${numberOfPeople}) is valid: ${isPeopleValid}`);

  let tipAmountPerPerson = 0;
  let billAmountPerPerson = 0;
  if (isBillValid && isTipValid && isPeopleValid) {
    if (!isNaN(totalBillAmount)) {
      tipAmountPerPerson = totalTipAmount / numberOfPeople;
      billAmountPerPerson = totalBillAmount / numberOfPeople;
    } else {
      tipAmountPerPerson = 0;
      billAmountPerPerson = 0;
      console.warn(
        "Per-person calculation aborted: totalBillAmount was NaN despite other flags."
      );
    }
  } else {
    if (!isPeopleValid) {
      console.warn(
        `Cannot calculate per-person amounts. Number of People (${numberOfPeople}) is not a positive integer.`
      );
    } else if (!isBillValid) {
      console.warn(
        "Cannot calculate per-person amounts due to invalid Bill Amount."
      );
    } else if (!isTipValid) {
      console.warn(
        "Cannot calculate per-person amounts due to invalid Tip Percentage."
      );
    }
  }

  // console.log({billAmount,numberOfPeople,actualTipPercent,totalTipAmount,totalBillAmount,tipAmountPerPerson,billAmountPerPerson});

  const formattedTipAmount = tipAmountPerPerson.toFixed(2);
  const formattedBillAmount = billAmountPerPerson.toFixed(2);

  const displayTipAmount = `$${formattedTipAmount}`;
  const displayBillAmount = `$${formattedBillAmount}`;

  // console.log("Formatted for Display - Tip Amount Per Person:", displayTipAmount);
  // console.log("Formatted for Display - Bill Amount Per Person:", displayBillAmount);

  if (tipAmountDisplay) {
    tipAmountDisplay.textContent = displayTipAmount;
  }
  // else {
  //     console.error('Error: tipAmountDisplay element not found in the DOM.');
  // }

  if (totalAmountDisplay) {
    totalAmountDisplay.textContent = displayBillAmount;
  }
  // else{
  //     console.error('Error: totalAmountDisplay element not found in the DOM.');
  // }

  if (billInput) {
    billInput.classList.toggle("error", !isBillValid);
  }

  if (peopleInput) {
    peopleInput.classList.toggle("error", !isPeopleValid);
  }

  if (customTipInput) {
    customTipInput.classList.toggle("error", !isCustomTipValid);
  }
}

function resetCalculator() {
  billInput.value = "";
  customTipInput.value = "";
  tipButtons.forEach((button) => {
    button.classList.remove("active");
    button.classList.remove("selected");
  });
  peopleInput.value = "";
  tipAmountDisplay.textContent = "$0.00";
  totalAmountDisplay.textContent = "$0.00";
  billInput.classList.remove("error");
  customTipInput.classList.remove("error");
  peopleInput.classList.remove("error");
} 
// document.addEventListener("DOMContentLoaded",calculateTip);