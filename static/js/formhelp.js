const hintText = document.getElementById("hint");

function inputSelected(e) {
  switch(e.target.id) {
    case "id_email":
      hintText.innerText = "Enter your email.";
      break;
    case "id_username":
      hintText.innerText = "Enter the username you would like to use.";
      break;
    case "id_password1":
      hintText.innerText = "Enter your password.\n➔ It cannot be too similar to your other personal information\n➔ It cannot be a common password\n➔ It cannot be entirely numeric\n➔ It must be at least 8 characters";
      break;
    case "id_password2":
      hintText.innerText = "Confirm your password by entering it again.";
      break;
  }
  hintText.style.display = "block";
}

function checkUnfocus(e) {
  if(document.activeElement.nodeName != "INPUT") hintText.style.display = "none";
}

for(const input of document.getElementsByTagName("input")) {
  input.addEventListener("focus", inputSelected);
  input.addEventListener("focusout", checkUnfocus);
}