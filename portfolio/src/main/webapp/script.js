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

const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_AVG_MONTH = 2628288;
const SECONDS_IN_YEAR = 31536000;

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MAX_DAYS_IN_MONTH = 31;
const MONTHS_IN_YEAR = 12;

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
* Temporary function that formats and displays comment on page. This does not yet save comments.
*/
function displayComment() {
    fetch('/data').then(response => response.text()).then((dataResponse) => {
        const commentHTML = document.getElementById('comment-container');
        var commentData = JSON.parse(dataResponse);

        var allComments = commentData.commentArray;
        var currentTime = commentData.retrieveTime;
        var newHTML = "";

        for (var i = 0; i < allComments.length; i++) {
            newHTML = "<br><p class=\"comment-style-1\">"
            + allComments[i].name
            + " - "
            + timeSince(allComments[i].date.dateTime, currentTime.dateTime)
            + "</p><br><p class=\"comment-style-2\">"
            + allComments[i].comment
            + "</p><br><hr> "
            + newHTML;
        }     

        commentHTML.innerHTML = newHTML;
    });
}

/**
 * Function inspired by solutions on this StackOverflow post: 
 * https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
 * 
 * @return string telling how long ago the comment was posted in 
 * relation to the current time.
 */
 function timeSince(commentTime, currentTime) {
    var timeDifference = "";
    var timeUnit = "";

    /**
     * Date constructor takes months in range of 0 to 11, so the second parameter subtracts 1.
     * Format: year, month, day, hour, minute
    */
    var commentDate = new Date(
        commentTime.date.year, commentTime.date.month - 1, commentTime.date.day, commentTime.time.hour, commentTime.time.minute);
    var currentDate = new Date(
        currentTime.date.year, currentTime.date.month - 1, currentTime.date.day, currentTime.time.hour, currentTime.time.minute);

    var seconds = Math.floor(
        Math.abs((currentDate.getTime() / MILLISECONDS_IN_SECOND) - (commentDate.getTime() / MILLISECONDS_IN_SECOND)));
    var timeDifference = Math.floor(seconds / SECONDS_IN_MINUTE);

    if (timeDifference < MINUTES_IN_HOUR) {
        timeUnit = "minute"
    } else {
        timeDifference = Math.floor(seconds / SECONDS_IN_HOUR);
        if (timeDifference < HOURS_IN_DAY) {
            timeUnit = "hour";
        } else {
            timeDifference = Math.floor(seconds / SECONDS_IN_DAY);
            if (timeDifference < MAX_DAYS_IN_MONTH) {
                timeUnit = "day";
            } else {
                timeDifference = Math.floor(seconds / SECONDS_IN_AVG_MONTH);
                if (timeDifference < MONTHS_IN_YEAR) {
                    timeUnit = "month";
                } else {
                    timeDifference = Math.floor(seconds / SECONDS_IN_YEAR);
                    timeUnit = "year";
                }
            }
        }
    }

    if (timeDifference == "1") {
        return timeDifference + " " + timeUnit + " ago";
    } else {
        return timeDifference + " " + timeUnit + "s ago";
    }
}