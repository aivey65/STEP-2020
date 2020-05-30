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
* Change height of diamond on page by randomly changing the diamond's top margin.
*/
function moveDiamondOnclick() {
    const diamond = document.getElementById('diamond');
    var heightMax = document.getElementById('trifecta').offsetHeight;
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
    const diaGame = document.getElementById('diaGame');
    const description = document.getElementById('diaDescription');

    diaGame.innerText = "Hit the Diamond!";

    if (hitCount == 1) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " time! This means nothing..."

    } else if (hitCount <= 5) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! This means nothing..."

    } else if (hitCount <= 10) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! This really means nothing. Please stop."

    } else if (hitCount <= 15) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! Do what you want, I guess, but it is a waste of time..."

    } else if (hitCount <= 20 ) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! What? But why tho?"

    } else if (hitCount <= 30 ) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! I have no words, I-"

    } else if (hitCount <= 100 ) {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! Please spend your time NOT hitting the diamond, okay?"
        
    } else {
        description.innerText = "You've hit the Diamond " + hitCount + 
        " times! There is something wrong with you. You did this for what?" +
        " Please, and I mean PLEASE, stop hitting the diamond. You have" +
        " nothing more to gain from this."
    }
}
