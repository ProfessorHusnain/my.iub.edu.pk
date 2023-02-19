const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress-bar');
const forms = document.querySelectorAll('.form');
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
const startBtn = document.querySelector('.startup-btn');
const formGroup = document.querySelector('.form-group');
const phoneInputField = document.querySelector("#phone");
const genderRadios = document.getElementsByName('gender');
const birthDate = document.querySelector("#date-of-birth");
const address = document.querySelector("#Address");
const street = document.querySelector("#street");
const zipCode = document.querySelector("#zip-code");
const imagePicker = document.querySelector("#taking-image");
const profileImage = document.querySelector("#profile");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const rePassword = document.querySelector("#rePassword");
const phoneOtpInputs = document.querySelectorAll('#phone-otp-1, #phone-otp-2, #phone-otp-3, #phone-otp-4, #phone-otp-5, #phone-otp-6');
const emailOtpInputs = document.querySelectorAll('#email-otp-1, #email-otp-2, #email-otp-3, #email-otp-4, #email-otp-5, #email-otp-6');
const info = document.querySelector(".info");


const phoneBoxes = document.querySelectorAll('.phone-verification-box');
const phoneInput = document.querySelector('.phone-verification-input');
var phoneErrorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
let currentForm = 0;

// Initialize the intlTelInput library
const iti = window.intlTelInput(phoneInputField, {
  separateDialCode: true,
  // Display only the country code with default number length
  separateDialCode: true,
  nationalMode: true,
  formatOnDisplay: true,
  autoFormat: true,
  preferredCountries: ["pk", "tr", "sa"],
  excludeCountries: ["il"],
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.min.js"

});



startBtn.addEventListener('click', function () {
  startBtn.style.display = "none";
  updateProgressBar();
  //forms[currentForm].classList.add('active');
  showForm(currentForm);
});

function showForm(index) {
  forms[currentForm].classList.remove('active');
  currentForm = index;
  forms[currentForm].classList.add('active');
  updateProgressBar();
}
function updateProgressBar() {
  const progressPercent = ((currentForm + 1) / forms.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

nextBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {

    if (currentForm < forms.length) {
      if (currentForm === 0 && validateFirst()) {
        showForm(currentForm + 1);
      } else if (currentForm === 1 && validateSecond()) {
        showForm(currentForm + 1);
      } else if (currentForm === 2 && validateThird()) {
        showForm(currentForm + 1);
      } else if(currentForm===3&&validateFourth()){
        forms[currentForm].classList.remove('active');
        info.style="visibility:visible;";
        progress.style="visibility:hidden;"
      }
    }

  });
});

prevBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    if (currentForm > 0) {
      showForm(currentForm - 1);
    }
  });
});



function validateFirst() {
  let firstName = document.getElementById("firstName");
  var lastName = document.getElementById("lastName");
  var email = document.getElementById("email");
  var phone = document.getElementById("phone");
  RestErrorFirst();
  // Validate name input


  if (firstName.value === "" || firstName.value === null) {
    setError(formGroup.querySelector("#fError"), "FirstName is Reqiured");
    firstName.focus();
    return false;
  } else {

    for (let i = 0; i < firstName.value.length; i++) {
      if (!isNaN(firstName.value[i])) {
        setError(formGroup.querySelector("#fError"),
          "You can't allow to enter number with name");
        firstName.focus();
        return false;
      }
    }
  }

  if (lastName.value === "") {

    setError(document.querySelector("#lastError"),
      "lastName is Reqiured");
    lastName.focus();
    return false;
  } else {

    for (let i = 0; i < lastName.value.length; i++) {
      if (!isNaN(lastName.value[i])) {
        setError(document.querySelector("#lastError")
          , "You can't alow to enter number with name is Reqiured");
        lastName.focus();
        return false;
      }
    }
  }



  // Validate email input
  if (email.value === "") {
    setError(document.querySelector("#eError"), "Email field is required");
    email.focus();
    return false;
  } else {
    // Regular expression to validate email format
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      setError(document.querySelector("#eError"), "Invalid email format");
      email.focus();
      return false;
    }
  }

  // Validate phone input

  if (phoneInputField.value.trim()) {
    if (!iti.isValidNumber()) {
      phoneInputField.classList.add("error");
      var errorCode = iti.getValidationError();
      var mess = phoneErrorMap[errorCode];
      if (errorCode === -99)
        mess = "Too short";
      setError(document.querySelector("#phError"), mess);
      phoneInputField.focus();
      return false;
    }
  } else {
    setError(document.querySelector("#phError"), "Phone number is required");
  }
  let isGenderSelected = false;
  for (let i = 0; i < genderRadios.length; i++) {
    if (genderRadios[i].checked) {
      isGenderSelected = true;
      break;
    }
  }

  if (!isGenderSelected) {
    setError(document.querySelector("#genError"), "Please select your gender.");
    return false;
  }

  // If all validations pass, submit the form
  return true;

}

birthDate.addEventListener('click', function () {
  const selectedDate = birthDate.value;

  const now = new Date();
  const year = now.getFullYear() - 5;
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  // Set the max attribute of the input element to today's date
  birthDate.setAttribute('max', today);

});



function validateSecond() {
  RestErrorSecond();
  if (address.value === "") {
    setError(document.querySelector("#addressError"), "Address is required");
    address.focus();
    return false;
  }
  if (street.value === "") {
    setError(document.querySelector("#streetError"), "Street is required");
    street.focus();
    return false;
  }

  if (street.value === "") {
    setError(document.querySelector("#streetError"), "Street is required");
    street.focus();
    return false;
  }
  if (zipCode.value === "" || zipCode.value === "0") {
    setError(document.querySelector("#zipError"), "zipCode is required for mailing purpose");
    zipCode.focus();
    return false;
  }
  if (birthDate.value === "") {
    setError(document.querySelector("#birthError"), "select date of birth");
    birthDate.focus();
    return false;
  }
  return true;
}
function validateThird() {
  RestErrorThird();
  if (username.value === "") {
    setError(document.querySelector("#usernameError"), "username is required");
    username.focus();
    return false;
  }
  if (password.value === "") {
    setError(document.querySelector("#passwordError"), "password is required");
    password.focus();
    return false;
  }
  if (password.value != rePassword.value) {
    setError(document.querySelector("#rePasswordError"), "Password Verification Required");
    rePassword.focus();
    return false;
  }
  return true;
}
function validateFourth() {

  RestErrorFourth();


  for(let i=0;i<phoneOtpInputs.length;i++){
    if (phoneOtpInputs[i].value === "") {
      setError(document.querySelector("#phoneOtpError"), "Phone Number Verification Required");
       return false;
    }
  }

  for(let i=0;i<emailOtpInputs.length;i++){
    if (emailOtpInputs[i].value === "")
    {
      setError(document.querySelector("#emailOtpError"), "Email Verification Required");
      return false;
    }
  }

 // phoneOtpInputs.forEach((input, index) => {
  //  console.log("phoneOtpInputs[index].value " + index + " " + phoneOtpInputs[index].value)
   // if (phoneOtpInputs[index].value === "") {
     // setError(document.querySelector("#phoneOtpError"), "Phone Number Verification Required");
       
    //}
  //});
  //emailOtpInputs.forEach((input, index) => {
   // console.log("emailOtpInputs[index].value " + index + " " + emailOtpInputs[index].value)
   
    //}
  //});

  return true;
}


function setError(source, message) {
  source.innerHTML = message;
}
function RestErrorFourth() {
  document.querySelector("#emailOtpError").innerHTML = "";
  document.querySelector("#phoneOtpError").innerHTML = "";
}
function RestErrorThird() {
  document.querySelector("#usernameError").innerHTML = "";
  document.querySelector("#passwordError").innerHTML = "";
  document.querySelector("#rePasswordError").innerHTML = "";
}
function RestErrorSecond() {
  document.querySelector("#addressError").innerHTML = "";
  document.querySelector("#streetError").innerHTML = "";
  document.querySelector("#zipError").innerHTML = "";
  document.querySelector("#birthError").innerHTML = "";
}

function RestErrorFirst() {
  document.querySelector("#fError").innerHTML = "";
  document.querySelector("#lastError").innerHTML = "";
  document.querySelector("#eError").innerHTML = "";
  document.querySelector("#phError").innerHTML = "";
  document.querySelector("#genError").innerHTML = "";

}
imagePicker.addEventListener('change', (event) => {

  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.addEventListener('load', (event) => {
      const imageUrl = event.target.result;
      profileImage.src = imageUrl;
    });
    reader.readAsDataURL(file);
  }
  imagePicker.style = "display:none";
});



phoneOtpInputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    if (e.data === null) {
      phoneOtpInputs[index - 1].focus();
      phoneOtpInputs[index - 1].value = '';
    } else if (e.target.value.length === 1) {
      if (phoneOtpInputs[index + 1] != phoneOtpInputs[phoneInputField.length])
        phoneOtpInputs[index + 1].focus();
    }
  });
});

emailOtpInputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    if (e.data === null) {
      emailOtpInputs[index - 1].focus();
      emailOtpInputs[index - 1].value = '';
    } else if (e.target.value.length === 1) {
      if (emailOtpInputs[index + 1] != emailOtpInputs[emailOtpInputs.length])
        emailOtpInputs[index + 1].focus();
    }
  });
});

phoneOtpInputs[0].addEventListener('keydown', (e) => {
  if (e.keyCode === 8 && phoneOtpInputs[0].value.length === 0) {
    e.preventDefault();
  }
});

emailOtpInputs[0].addEventListener('keydown', (e) => {
  if (e.keyCode === 8 && emailOtpInputs[0].value.length === 0) {
    e.preventDefault();
  }
});

phoneOtpInputs.forEach((input, index) => {
  input.addEventListener('keydown', (e) => {
    if (e.keyCode === 8 && phoneOtpInputs[index].value.length === 0) {

      phoneOtpInputs[index - 1].focus();
      phoneOtpInputs[index - 1].value = '';
    }
  });
});

emailOtpInputs.forEach((input, index) => {
  input.addEventListener('keydown', (e) => {
    if (e.keyCode === 8 && emailOtpInputs[index].value.length === 0) {
      emailOtpInputs[index - 1].focus();
      emailOtpInputs[index - 1].value = '';
    }
  });
});
