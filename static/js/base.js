const decodeEls = document.getElementsByClassName("decode");
const animationLength = 750, animationDelay = 250;
let start;

function animateDecoding(time) {
  if (!start) start = time;
  const elapsed = time - start - animationDelay;
  for(const el of decodeEls) {
      const plain = el.getAttribute("plaintext");
      el.innerText = plain.split("").map((letter, index) => {
        if(index < Math.floor(plain.length * elapsed / animationLength) || letter == " ") return letter;
        return String.fromCharCode(65 + Math.floor(Math.random() * 26) + (32 * Math.round(Math.random())));
      }).join("");
  }
  if(elapsed < animationLength) requestAnimationFrame(animateDecoding);
}

for(const el of decodeEls) el.setAttribute("plaintext", el.innerText);

requestAnimationFrame(animateDecoding);