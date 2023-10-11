const inputSlider = document.querySelector(".slider");
const lenghtDisplay = document.querySelector(".count");
const passwordDisplay = document.querySelector(".text-input");
const copybtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-copyMsg]"); //warn
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector(".circle");
const generateBtn = document.querySelector(".generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '!@#$%^&*()_+-={}[]<>,.?/:";\|`~';

function handleSlider() {
    inputSlider.value = passwordLength;
    lenghtDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

let password = "";
let passwordLength = 10;
let checkCount = 1;
uppercaseCheck.checked = true;
setIndicator("#ccc");
handleSlider(); // this function sets the default value of the slider

// console.log(Math.floor(Math.random() * (70-25)) + 25);
function getRndInteger(min, max) { // this is the formula to get a randow floor no. in b/w a range
    return Math.floor(Math.random() * (max - min)) + min;
}
function genRndNumber() {
    return getRndInteger(0, 9);
}
function genLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}
function genUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}
function genSymbol() {
    return symbol.charAt(getRndInteger(0, symbol.length));
}

function calcStrength() {
    let hasUpp = false;
    let hasLow = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpp = true;
    if (lowercaseCheck.checked) hasLow = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;
    if (hasUpp && hasLow && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLow || hasUpp) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}
async function copyContent(params) {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copymsg.innerText = "Copied";
    } catch (e) {
        copymsg.innerText = "Failed";
    }
    copymsg.classList.add("active");
    setTimeout(() => {
        copymsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener("input", function (e) {
    passwordLength = e.target.value;
    handleSlider();
})

function sufflePassword(arr) {
    // fisher yates method
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    let str = "";
    arr.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach(function (checkbox) {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach(function (checkbox) {
    checkbox.addEventListener("change", handleCheckBoxChange);

})

copybtn.addEventListener("click", function () {
    if (passwordDisplay.value) {
        copyContent();
    }
})

generateBtn.addEventListener("click", () => {
    // none of the checkboxes are selected
    if (checkCount <= 0) return;
    // password-length should be >= selected no. of checkbox
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    // remove the previous password
    if (password.length) password = "";

    // add selected checkbox functions to an array
    let funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(genUpperCase);
    if (lowercaseCheck.checked) funcArr.push(genLowerCase);
    if (numberCheck.checked) funcArr.push(genRndNumber);
    if (symbolCheck.checked) funcArr.push(genSymbol);

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndx = getRndInteger(0, funcArr.length);
        password += funcArr[randIndx]();
    }

    password = sufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});


