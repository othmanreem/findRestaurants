// javaScript för sökrutan 
var smapiKey = "6OP4TY35"; // smapi nyckel
var lat1= localStorage.getItem("xLat"); //användarens lat
var lng1= localStorage.getItem("xLon");  //användarens lng 
var nmElem; // referns till element där visas hotdog ställen
var nms // namn på maträtt i sökrutan
var searchElem; // referense till sökrutan 
var but // knapp för slumpmässig restaurang
var result // element för att göra utskrift av den slumpmässig restaurang
var endButt // knapp för att avsluta slumpa 
var ranBtsHolder  // element som innehåller slumpa knappen
var holderElem // element för filtrering kanppar¨
// intit funktion
function init() {
  nmElem = document.getElementById("resulte");
  searchElem = document.getElementById("search");
  ranBtsHolder = document.getElementById("rndmHolder");
  endButt = document.getElementById("endbutt");
  searchElem.searchButton.addEventListener("click", searchName);
  holderElem = document.getElementById("buttons");
  but = document.getElementById("butt");
  result = document.getElementById("restext");
  searchElem.names.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchName();
    }
  });
  but.addEventListener("click", random);
  endButt.addEventListener("click", endRandom);
  //navigator.geolocation.getCurrentPosition(loc, error);
} // slut init
window.addEventListener("load", init);
// funktion som tar ord i sökrutan och skickar dem till rqst funktionen
function searchName() {
  if (searchElem.names.value == "") {
    nmElem.innerHTML = "";
    holderElem.innerHTML= "";
    ranBtsHolder.style.display = "block";
    return;
  }
  else {
    nms = searchElem.names.value;
    rqst(nms);
  }
} // slut searchName
// funktion för användarens lat och lng 
function loc(position) {
  lat1 = position.coords.latitude;
  lng1 = position.coords.longitude;
}// slut loc
// error funktion
function error() {
  console.log("plats gick inte att hämtas:", error);
}// slut error
// funktion för att begära ställen efter angivet ord i sökrutan 
function rqst(nms) {
  holderElem.innerHTML="";
  nmElem.innerHTML = "<img src='img/waitingicon.gif' alt='wait-icon'>";
  let request = new XMLHttpRequest(); // object för Ajax-anropet
  request.open("GET", "https://smapi.lnu.se/api/?api_key="+smapiKey+"&debug=false&controller=food&method=getfromlatlng&lat="+lat1+"&lng="+lng1+"&search_tags="+nms+"&order_by=distance_in_km&sort_in=ASC", true);
  request.send(null);
  // funktion som avläser status i kommunikayionen
  request.onreadystatechange = function () {
    if (request.readyState == 4 ) {
    if (request.status == 200) {
      getCtgry(request.responseText);
      fltrbuts(nms)
      }
    else {
      console.log("Den begärda resursen finns inte.");
    }
  }
  };
} // slut rqst
// funktion för att skapa filter knappar 
function fltrbuts (nms) {
      let filterPElem = document.createElement("p"); //  ett tomt p element 
      let filterPElemTxt = document.createTextNode("Filtrera resultaten");// text i filterPElem
      filterPElem.appendChild(filterPElemTxt); 
      holderElem.appendChild(filterPElem);
      let butHighPrice = document.createElement("button"); // knapp för att visa objekt  med högst pris längst upp
      let butHighPriceTxt = document.createTextNode("Högst pris"); // text för butHighPrice
      butHighPrice.appendChild(butHighPriceTxt);
      holderElem.appendChild(butHighPrice);
      butHighPrice.setAttribute( "value", "HighPrice");
      butHighPrice.setAttribute( "class", "fltrBtns");
      let butLowPrice = document.createElement("button"); // knapp för att visa objekt med lägst pris längst upp
      let butLowPriceTxt = document.createTextNode("Lägst pris"); // text för butLowPrice
      butLowPrice.appendChild(butLowPriceTxt);
      holderElem.appendChild(butLowPrice);
      butLowPrice.setAttribute( "value", "LowPrice")
      butLowPrice.setAttribute( "class", "fltrBtns")
      let butHighrat = document.createElement("button"); // knapp för att visa objekt med högst längst upp
      let butHighratTxt = document.createTextNode("Högst betyg"); // text för butHighrat
      butHighrat.appendChild(butHighratTxt);
      butHighrat.setAttribute( "value", "HighRat")
      butHighrat.setAttribute( "class", "fltrBtns")
      holderElem.appendChild(butHighrat);
      let takeOut = document.createElement("button"); // knapp för att visa objekt som erbjude take out längst upp
      let takeOutTxt = document.createTextNode("Ta med"); // text för takeOut
      takeOut.appendChild(takeOutTxt);
      takeOut.setAttribute( "value", "to");
      takeOut.setAttribute( "class", "fltrBtns");
      holderElem.appendChild(takeOut);
       let btns = document.getElementsByClassName("fltrBtns");  // arrey med alla knappar 
     for ( let i = 0; i <btns.length; i ++ ){
        btns[i].addEventListener("click", function(){
          fltrFunc(nms, btns[i].getAttribute("value"));
        });
      }
}// slut fltrbuts
// funktion för att begära data baserat på vilken filter knapp användaren klicker 
function fltrFunc (nms, fltrX) {
  nmElem.innerHTML = "<img src='img/waitingicon.gif' alt='wait-icon'>";
  let request = new XMLHttpRequest(); // object för Ajax-anropet
  let url; // url som begäras
  // switch sats som switchar url efter den klickda knappen
  switch (fltrX) {
    case "HighRat":
      url = "https://smapi.lnu.se/api/?api_key=" + smapiKey + "&debug=false&controller=food&method=getfromlatlng&lat="+lat1+"&lng="+lng1+"&search_tags="+nms+"&order_by=distance_in_km&sort_in=ASC&order_by=rating&sort_in=DESC";
   
    break;
    case "HighPrice":
      url = "https://smapi.lnu.se/api/?api_key=" + smapiKey + "&debug=false&controller=food&method=getfromlatlng&lat="+lat1+"&lng="+lng1+"&search_tags="+nms+"&order_by=distance_in_km&sort_in=ASC&order_by=avg_lunch_pricing&sort_in=DESC";

    break;

    case "LowPrice":
    url = "https://smapi.lnu.se/api/?api_key="+ smapiKey+"&debug=false&controller=food&method=getfromlatlng&lat="+lat1+"&lng="+lng1+"&search_tags="+nms+"&order_by=distance_in_km&sort_in=ASC&order_by=avg_lunch_pricing&sort_in=ASC";
    break;

    case "to":
     url =  "https://smapi.lnu.se/api/?api_key=" + smapiKey + "&debug=false&controller=food&method=getfromlatlng&lat="+lat1+"&lng="+lng1+"&search_tags="+nms+"&order_by=distance_in_km&sort_in=ASC&drive_through=Y"
     break;
  }
  request.open("GET", url, true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.readyState == 4 ) {
    if (request.status == 200) {
      getCtgry(request.responseText);
     
      }
    else {
      console.log("Den begärda resursen finns inte.");
    }
  }
  };
} // slut fltrFunc
// funktion för att göra utskrift av sök resultat 
function getCtgry(resData) {
  ranBtsHolder.style.display="none";
  result.innerHTML = "";
  nmElem.innerHTML = "";
  let res = JSON.parse(resData).payload; // arrey med alla resultat
  if (res.length === 0) {
    nmElem.innerHTML = "Inga resultat hittades att filtrera ";
    return;
  } 
  for (let i = 0; i < res.length; i++) {
    let data = res[i]; // data om aktuel restaurang
    let name = res[i].name; // egenskapen namn 
    let lat2 = res[i].lat; // egenskapen lat för aktuel restaurang
    let lan2 = res[i].lng;// egenskapen lng för aktuel restaurang
    let R = 6371; // jordens radia
    let dLat = (lat2 - lat1) * Math.PI / 180; // variabel för skilnaden mellan användarens och restaurang lat
    let dLng = (lan2 - lng1) * Math.PI / 180; //  variabel för skilnaden mellan användarens och restaurang lng
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2); // hälften av avståndet  mellan användaren och restaurangen i kvadrat
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // beräkna vinkeln mellan Math.sqrt(a) och Math.sqrt(a)
    let d = R * c; // avståndet mellan punkterna 
    let km = "Avståndet är Cirka: " + Math.round(d) + " km";  // avrunda avståndet + lägga till lämplig text 
    let htmlElem = document.createElement("p"); // element för namn
    let rstName = document.createTextNode(name); // spara namn egenskapen som text sträng
    htmlElem.appendChild(rstName);
    nmElem.appendChild(htmlElem);
    let rat = res[i].rating;// rating egenskapen 
    let ratRound = Math.round(rat); // avrunda till hel tal
    let ratelem = document.createElement("p"); // rating element 
    let ratTxt = document.createTextNode("Betygssättning: " + ratRound + " "); // spara rating i text 
    ratelem.appendChild(ratTxt);
    for (let l = 0; l < ratRound; l++) {
      let ratImg = document.createElement("img"); // bild på stjärna
      ratImg.setAttribute("src", "img/star.png");
      ratImg.style.width = "20px";
      ratelem.appendChild(ratImg);
    }
    nmElem.appendChild(ratelem);
    let price = res[i].avg_lunch_pricing; // pris egenskapen 
    let htmlelem = document.createElement("p"); // element för priset
    let pricetxt = " Genomsnittligt lunchpris är: " +
      price + " Kr "; // priset i text sträng
    let text = document.createTextNode(pricetxt); // spara priset i text node
    htmlelem.appendChild(text);
    nmElem.appendChild(htmlelem);
    let disElem = document.createElement("p"); // element för avståndet 
    let dis = document.createTextNode(km); // spara avståndet i text node 
    disElem.appendChild(dis);
    nmElem.appendChild(disElem);
    htmlElem.style.color = "white";
    htmlElem.style.fontSize = "30px";
    htmlElem.style.margin = "10px";
    htmlElem.style.padding = "10px";
    let mapElem = document.createElement("div"); // emenent för att behålla karta objektet
    nmElem.appendChild(mapElem);
    searchMap(data, mapElem);
    line = document.createElement("hr");  // rad element mellan restaurangerna
    nmElem.appendChild(line);
  }
}// slut getCtgry
// funktion för kartan
function searchMap(res, mapElem) {
 
  let lat3 = res.lat;  // restaurangens lat
  let lan3 = res.lng; //  restaurangens lng
  lat3 = parseFloat(lat3);  // göra värdet i lat3 till sifror
  lan3 = parseFloat(lan3);  // göra värdet i lng3 till sifror
  mapElem.style.height = "200px";
  mapElem.style.width = "300px";
  mapElem.style.marginLeft = "30px";
  // karta objktet
  let map = new google.maps.Map(mapElem, {
    center: { lat: lat1, lng: lng1 },
    zoom: 12,
  });
  // markör för användaren
  let pos = new google.maps.Marker({
    position: { lat: lat1, lng: lng1 },
    map: map,
    label: "din position"
  });
  // markör för restaurang
  let desti = new google.maps.Marker({
    position: { lat: lat3, lng: lan3 },
    map: map,
    label: "din destination"
  });
  let directionsService = new google.maps.DirectionsService(); // objektet skickar behäran till Maps Directions api för vägbeskrivning
  let directionsRenderer = new google.maps.DirectionsRenderer(); // objektet visar vägbeskrivning som begäras med objektet directionsService 
  directionsRenderer.setMap(map);
  // vägbeskrivning bägran mellan två punkter 
  let diReq = {
    origin: { lat: lat1, lng: lng1 },
    destination: { lat: lat3, lng: lan3 },
    travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(diReq, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(response);
    } else {
      console.log("Directions begäran misslyckades. Status: " + status);
    }
  });
}// slut searchMap
// funktion för slumpmässigt val
function random() {
  holderElem.innerHTML = "";
  result.innerHTML = "<img src='img/waitingicon.gif' alt='wait-icon'>";
  nmElem.innerHTML = "";
  let request = new XMLHttpRequest(); // object för Ajax-anropet
  request.open(
    "GET","https://smapi.lnu.se/api/?api_key="+smapiKey+"&debug=false&controller=food&method=getfromlatlng&lat="+lat1+"&lng="+lng1+"&order_by=distance_in_km&sort_in=ASC&radius=3",true);
  request.send(null);
  // funktion som avläser status i kommunikayionen
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      getRandom(request.responseText);
    }
  };
} // slut random
// funktion för slumpmässig restaurang 
function getRandom(res) {
  result.innerHTML = "";
  res = JSON.parse(res).payload;
  let randomIndex = Math.floor(Math.random() * res.length);
  let randomFood = res[randomIndex];
  let name = randomFood.name;
  let nameElem = document.createElement("p");// element för namn
  let nmTxt = document.createTextNode(name); // text
  nameElem.appendChild(nmTxt);
  result.appendChild(nameElem)
  let lat2 = randomFood.lat; // egenskapen lat för aktuel restaurang
  let lan2 = randomFood.lng;// egenskapen lng för aktuel restaurang
  let R = 6371; // jordens radia
  let dLat = (lat2 - lat1) * Math.PI / 180; // variabel för skilnaden mellan användarens och restaurang lat
  let dLng = (lan2 - lng1) * Math.PI / 180; //  variabel för skilnaden mellan användarens och restaurang lng
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2); // hälften av avståndet  mellan användaren och restaurangen i kvadrat
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // beräkna vinkeln mellan Math.sqrt(a) och Math.sqrt(a)
  let d = R * c; // avståndet mellan punkterna 
  let km = "Avståndet är Cirka: " + Math.round(d) + " km";  // avrunda avståndet + lägga till lämplig text 
  let rat = randomFood.rating;// rating egenskapen 
  let ratRound = Math.round(rat); // avrunda till hel tal
  let ratelem = document.createElement("p"); // rating element 
  let ratTxt = document.createTextNode("Betygssättning: " + ratRound + " "); // spara rating i text 
  ratelem.appendChild(ratTxt);
  for (let l = 0; l < ratRound; l++) {
    let ratImg = document.createElement("img"); // bild på stjärna
    ratImg.setAttribute("src", "img/star.png");
    ratImg.style.width = "20px";
    ratelem.appendChild(ratImg);
  }
  result.appendChild(ratelem);
  let price = randomFood.avg_lunch_pricing; // pris egenskapen 
  let htmlelem = document.createElement("p"); // element för priset
  let pricetxt = " Genomsnittligt lunchpris är: " +
  price + " Kr "; // priset i text sträng
  let text = document.createTextNode(pricetxt); // spara priset i text node
  htmlelem.appendChild(text);
  result.appendChild(htmlelem);
  let disElem = document.createElement("p"); // element för avståndet 
  let dis = document.createTextNode(km); // spara avståndet i text node 
  disElem.appendChild(dis);
  result.appendChild(disElem);
  nameElem.style.color = "white";
  nameElem.style.fontSize = "30px";
  nameElem.style.margin = "10px";
  nameElem.style.padding = "10px";
  let mapElem = document.createElement("div"); // emenent för att behålla karta objektet
  result.appendChild(mapElem);
  searchMap(randomFood, mapElem);
  line = document.createElement("hr");  // rad element mellan restaurangerna
  result.appendChild(line);
} // slut getRandom
// funktion för att stänga slumpmässigt valet 
function endRandom() {
  result.innerHTML = "";
} // slut endRandom 