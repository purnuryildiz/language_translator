const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  selectTag = document.querySelectorAll("select"),
  translateBtn = document.querySelector("button"),
  icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
  for (const country_code in countries) {
    //selecting English by default as FROM language and Turkish as TO language
    let selected;
    if (id == 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id == 1 && country_code == "tr-TR") {
      selected = "selected";
    }
    let option = ` <option value = "${country_code}" ${selected}> ${countries[country_code]}</option>`;
    //adding options tag inside select tag:
    tag.insertAdjacentHTML("beforeend", option);
  }
});

exchangeIcon.addEventListener("click", () => {
  //exchanging textarea and select tag values
  let tempText = fromText.value;
  tempLang = selectTag[0].value;
  fromText.value = toText.value;
  selectTag[0].value = selectTag[1].value;
  toText.value = tempText;
  selectTag[1].value = tempLang;
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value;
  let translateFrom = selectTag[0].value; // getting fromSelect tag value
  let translateTo = selectTag[1].value; // getting toSelect tag value
  if (!text) return;
  toText.setAttribute("placeholder", "Translating..");

  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");
    });
});

fromText.addEventListener("input", () => {
  toText.value = ""; // Herhangi bir değişiklik olduğunda toText alanını sıfırla
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard
          .writeText(fromText.value)
          .then(() => console.log("Copied fromText"))
          .catch((err) => console.error("Failed to copy fromText: ", err));
      } else {
        navigator.clipboard
          .writeText(toText.value)
          .then(() => console.log("Copied toText"))
          .catch((err) => console.error("Failed to copy toText: ", err));
      }
    } else {
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      console.log(
        `Speaking text: ${utterance.text} with lang: ${utterance.lang}`
      );
      speechSynthesis.speak(utterance); // Doğru kullanımı bu şekilde
    }
  });
});
