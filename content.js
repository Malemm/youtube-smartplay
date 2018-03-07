/* Content Script */

var play_message_sent = false;


// Getting the video object
var video = document.querySelector("video");


// This function will check for update of video selector, especially for vimeo
var observer = setInterval(observe_function, 1000);

function observe_function() {

    if (video) {

        // Send message to the background when the video starts to play
        video.onplay = function () {

            // this condition is put to stop youtube from firing when tab is opened in new tab without focusing, DOESN'T WORK ON VIMEO !!!
            if (video.currentTime !== 0) {
                
                //console.log("onplay");

                chrome.runtime.sendMessage({
                    status: "played"
                });

                play_message_sent = true;

            }
        };


        video.onended = function () {

            //console.log("onended");

            chrome.runtime.sendMessage({
                status: "ended"
            });
        };

        //video.currentTime !== 0 video.played.end(0) - video.played.start(0)

        // onplay only is not enough for dynamic site like youtube! This is backup incase onplay failed to send the message
        video.ontimeupdate = function () {

            if (!play_message_sent && video.currentTime !== 0) {

                //console.log("ontimeupdate "+video.currentTime+" "+val+" "+video.muted);

                chrome.runtime.sendMessage({
                    status: "played"
                });

                play_message_sent = true;
            }

        }

        clearInterval(observer);
        //console.log("hodor: i've got it");

    } else {

        video = document.querySelector("video");
        //console.log("i am groot: still looking for it");
    }
}


// Set up message listener
chrome.runtime.onMessage.addListener(action_function);

// Callback function 
function action_function(message, sender, sendResponse) {

    //console.log("Received action: " + message.action);
    if (message.action === "pause") {

        video.pause();

    } else if (message.action === "play") {

        // Rewind the video 1 second
        video.currentTime = video.currentTime - 1;
        video.play();

    }
}