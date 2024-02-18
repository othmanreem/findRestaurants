var smapiKey = "6OP4TY35"; // smapi nyckeln
var lat1 = 56.843834;
var lan1 = 14.807560;
var lat //användarens lat
var lon; //användarens lng 
var keyWords; // en arrye med alla kategori knappar
var keyWord; // name värdet i den klickade kategorien
// funktion för att initiera sidan
function init() {
  keyWords = document.getElementsByClassName("ctgrys");
  for (let i = 0; i < keyWords.length; i++) {
    keyWords[i].addEventListener("click", sortCtgrys)
  }
  navigator.geolocation.getCurrentPosition(geoLoc, error);
}// slut init
window.addEventListener("load", init);
// Funktion för att identifiera den klickade kategorins namn attribut 
function sortCtgrys(event) {
  event.preventDefault();
  keyWord = this.getAttribute("rel");
  localStorage.setItem("xKey", keyWord)
  if (keyWord === "cafe") {
    getCafes(keyWord);
  }
  else {
    getCtgrys(keyWord);
  }
} // slut sortCtgrys
// funktion för att hämta användarens koordinater
function geoLoc(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  localStorage.setItem("xLat", lat);
  localStorage.setItem("xLon", lon);
}// slut geoLoc
// error meddelande i fall det inte går att hämta koordinatena
function error() {
  console.log("plats gick inte att hämtas:", error);
} //slut error
// funktion för att hämta kategorier pasera på värdet i namn attr
function getCtgrys(kW) {
  loadingMessage();
  let request = new XMLHttpRequest(); // object för Ajax-anropet
  if (kW === "vegetarian_option") {
    request.open("GET", "https://smapi.lnu.se/api/?api_key=" + smapiKey + "&debug=false&controller=food&method=getfromlatlng&lat=" + lat1 + "&lng=" + lan1 + "&" + kW + "=Y&order_by=distance_in_km&sort_in=ASC", true);
    request.send(null);
  }
  else {
    request.open("GET", "https://smapi.lnu.se/api/?api_key=" + smapiKey + "&debug=false&controller=food&method=getfromlatlng&lat=" + lat1 + "&lng=" + lan1 + "&sub_types=" + kW + "&order_by=distance_in_km&sort_in=ASC", true);
    request.send(null);
  }
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        getRspns(request.responseText)
        window.location.href = "food.html";
      }
      else {
        console.log("error: " + request.status);
      }
    }
  }
}// slut getCtgrys
// funcktion för att spara responsen från smapi i funktionen innan i localStorage
function getRspns(response) {
  let rspnsData = JSON.parse(response).payload; // arrey med alla objekt i responsen
  localStorage.setItem("rspns", JSON.stringify(rspnsData))
} // slut getRspns
// funktion för att hämta kafeer från lokal json fil 
function getCafes(kW) {
  loadingMessage();
  window.location.href = "cafe.html"
  let request = new XMLHttpRequest();  // objektet för Ajax-anropet
  request.open("GET", "json/" + kW + ".json", true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        let response = JSON.parse(request.responseText); // responsen på begäran 
        localStorage.setItem("cafesOb", JSON.stringify(response.cafe));
      } else {
        console.log("error: " + request.status);
      }
    }
  };
} // slut getCafes
// funktion för att visa ett meddelande medan sidan ladar
function loadingMessage() {
  let loadingMessage = document.createElement("div"); // ett div element för att visa meddelandet i
  let loadingImg = document.createElement("img");
  loadingImg.setAttribute("src", "img/waitingicon.gif");
  loadingMessage.appendChild(loadingImg);
  let loadingMng = document.createTextNode("");
  loadingMessage.appendChild(loadingMng);// läggs till som textnod under bilden
  loadingMessage.style.transform = "translate(-50%, -50%)";
  loadingMessage.style.position = "fixed";
  loadingMessage.style.top = "50%";
  loadingMessage.style.left = "50%";
  loadingMessage.style.padding = "20px";
  loadingMessage.style.zIndex = "9999";
  document.body.appendChild(loadingMessage);
} // slut loadingMessage console