// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var diamondHitCount = 0;

/**
 * Adds a random greeting to the page.
 */

function addRandomGreeting() {
  const greetings =
      ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!',
       'こんにちは,世界', 'Привет мир'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

/**
* Shows more information about the diamond gif used.
*/
function showMoreGifInfo() {
    const infoContainer = document.getElementById('information-container');
    const infoButton = document.getElementById('info-button');

    if (infoContainer.style.display === "none" || infoContainer.style.display === '') {
        infoContainer.style.display = "inline";
        infoButton.innerHTML = "Less Information"
    } else {
        infoContainer.style.display = "none";
        infoButton.innerHTML = "More Information"
    }
}


/**
* Change height of diamond on page by randomly changing the diamond's top margin.
*/
function moveDiamondOnclick() {
    const diamond = document.getElementById('diamond');
    var heightMax = document.getElementById('page-container').offsetHeight;
    heightMax = heightMax - diamond.offsetHeight;

    var changeTo = Math.floor(Math.random() * heightMax);

    diamond.style.paddingTop = changeTo + "px";
    diamondHitCount = diamondHitCount + 1;
    
    diamondDescriptionUpdate(diamondHitCount);
}

/**
* Change the description to show how many times the diamond has been pressed, 
* along with a little message.
*/
function diamondDescriptionUpdate(hitCount) {
    const diaGame = document.getElementById('dia-title');
    const description = document.getElementById('dia-description');

    diaGame.innerText = "Hit the Diamond!";

    if (hitCount == 1) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " time! This has no meaning."

    } else if (hitCount <= 5) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! This has no meaning."

    } else if (hitCount <= 10) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! This really means nothing. You can stop now."

    } else if (hitCount <= 15) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! Do what you want, I guess, but this is just a waste of time."

    } else if (hitCount <= 20 ) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! But why tho?"

    } else if (hitCount <= 30 ) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! I have no words, I-"

    } else if (hitCount <= 100 ) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! Please spend your time NOT hitting the diamond, okay?"

    } else {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! You did this for what?" +
        " Please, and I mean PLEASE, stop hitting the diamond. You have" +
        " nothing more to gain from this."
    }
}

/**
 * Function that calls all of the onload functions.
 */
function onload() {
    displayComments();
}

/**
* Function that recieves the indicated number of comments from datastore and displays the result after formatting.
*/
function displayComments() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('max-comments') || 5;
    
    fetch('/data?max-comments=' + query).then(response => response.json()).then((commentData) => {
        const commentHTML = document.getElementById('comment-container');
        var newHTML = "";

        for (var i = 0; i < commentData.length; i++) {
            newHTML = "<br><p class=\"comment-style-1\">"
            + commentData[i].name
            + "</p><br><p class=\"comment-style-2\">"
            + commentData[i].comment
            + "</p><br><hr> "
            + newHTML;
        }     

        commentHTML.innerHTML = newHTML;
    });
}

/**
* Function that deletes all comments stored in Datastore.
*/
async function deleteComments() {
    await fetch('/delete-data');
    displayComments();
}

/**
 * Creates a chart to visualize user data about boba.
 */
function displayPieChart() {
    fetch('/tea-vote').then(response => response.json()).then((voteData) => {
        //Options used to create the two charts
        const options = {
            pieHole: 0.4,
            legend: 'none',
            backgroundColor: '#ffdfba',
            fontName: 'Josefin Sans',
            fontSize: 12,
            pieSliceTextStyle: {
                color: '#323232',
            },
            chartArea: {
                left: 10,
                top: 10,
                width: 250,
                height:260
            },
            colors: ['#ffb3ba', '#ffffba', '#baffc9', '#bae1ff', '#e0d6ff', '#ffe4e1', '#cdc9c9']
        };

        // Create chart for flavors
        const flavorData = new google.visualization.DataTable();
        flavorData.addColumn('string', 'flavor');
        flavorData.addColumn('number', 'votes');
        Object.keys(voteData.flavorVotes).forEach((flavor) => {
            flavorData.addRow([flavor, voteData.flavorVotes[flavor]]);
        });

        const flavorChart = new google.visualization.PieChart(
            document.getElementById('flavor-chart'));
        flavorChart.draw(flavorData, options);

        // Create chart for toppings
        const toppingData = new google.visualization.DataTable();
        toppingData.addColumn('string', 'topping');
        toppingData.addColumn('number', 'votes');
        Object.keys(voteData.toppingVotes).forEach((topping) => {
            toppingData.addRow([topping, voteData.toppingVotes[topping]]);
        });

        const toppingChart = new google.visualization.PieChart(
            document.getElementById('topping-chart'));
        toppingChart.draw(toppingData, options);
    });
}

/**
 * Shows map on page.
 */
 function initMap() {
  // The map, centered at Oak Park
    var map = new google.maps.Map(
      document.getElementById('custom-map'), {
          zoom: 13, 
          center: {lat: 41.88831, lng: -87.7901},
          backgroundColor: "#ffdfba",
          styles: stylesArray
        });

  // Location markers of restaurants with info windows
    var sweetmonster = new google.maps.Marker({
      position: {lat: 41.86538, lng: -87.78914}, 
      map: map, 
      title: "Sweet Monster"
    });
    sweetmonster.addListener('click', function() {
      new google.maps.InfoWindow({
          content: "<h1>Sweet Monster</h1><p>Sweet Monster is a cute little shop that sells rolled ice cream" +
          " and boba tea. It's only open during the summer, so I do not go here often.</p>"
      }).open(map, sweetmonster);
    });

    var pokeburrito = new google.maps.Marker({
      position: {lat: 41.88847, lng: -87.80151},
      map: map,
      title: "Poke Burrito"
    });
    pokeburrito.addListener('click', function() {
      new google.maps.InfoWindow({
          content: "<h1>Poke Burrito</h1><p>Poke Burrito is where I order my poke bowls. I usually order mine" +
          " with raw tuna, avocado, cucumber and other delicious toppings! It's expensive, but one of my favorites.</p>"
      }).open(map, pokeburrito);
    });

    var newpot = new google.maps.Marker({
      position: {lat: 41.88835, lng: -87.79391},
      map: map,
      title: "New Pot"
    });
    newpot.addListener('click', function() {
      new google.maps.InfoWindow({
          content: "<h1>New Pot</h1><p>New Pot has Thai food. My family has been ordering from them pretty regularly" +
          " for years now. I love thai food, especially thai noodles and curries.</p>"
      }).open(map, newpot);
    });

    var tacobros = new google.maps.Marker({
      position: {lat: 41.89485, lng: -87.77539},
      map: map,
      title: "Taco Bros"
    });
    tacobros.addListener('click', function() {
      new google.maps.InfoWindow({
          content: "<h1>Taco Bros</h1><p>Taco Bros is a small taco place that makes really good tacos. It is my go-to" +
          " taco place to order from. </p>"
      }).open(map, tacobros);
    });

    var coldstone = new google.maps.Marker({
      position: {lat: 41.88853, lng: -87.80234},
      map: map,
      title: "Coldstone"
    });
    coldstone.addListener('click', function() {
      new google.maps.InfoWindow({
          content: "<h1>Coldstone</h1><p>Coldstone is my favorite place to get ice cream in Oak Park. The reason for that" +
          " is because I can get my favorite dessert combo there: Coffee ice cream with brownies mixed in. There is no better flavor.</p>"
      }).open(map, coldstone);
    });

    var bossburrito = new google.maps.Marker({
      position: {lat: 41.88797, lng: -87.80290},
      map: map,
      title: "Boss Burrito"
    });
    bossburrito.addListener('click', function() {
      new google.maps.InfoWindow({
          content: "<h1>Boss Burrito</h1><p>Boss Burrito is another good place to get tacos. It has also been around longer than" +
          " Taco Bros. If ever I find my self in this part of Oak Park, this is my choice for a casual eating experience.</p>"
      }).open(map, bossburrito);
    });
 }

/**
 * Array containing all of the map style customizations.
 */
 var stylesArray = [
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#6f6d6d"
      },
      {
        "weight": 2.5
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffffba"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffb3ba"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffdfba"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffffba"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#baffc9"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bae1ff"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#baffc9"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffdfba"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffdfba"
      }
    ]
  }
]