Start with manifest.json file
- Specify what version of the extensions platform we're using
- Every extension needs this file (most important file)

permissions:
- storage:
  - Store things in the users browser
- tabs:
  - Helps us access browsers tab system so we can read the tabs
  - Grab URL of current tab

host_permissions:
- send "cores" requests???

service_worker:	
- js file that runs separately from the main browser thread
- Will not have access to the content of a webpage (separate from main processes)
  - Can speak to extension through extensions messaging system

content_scripts:
- files that run in context of the webpages that we're on
- use these to manipulate the dom
- Specify the file

default_popup
- specifies which file was served as our UI
- popup.html specifies that the corresponding file that helps with interactivity is the popup.js file.


## Add a button

- This is the first thing we need to do to test the app, because the button is the only thing that does anything.
- Need to manipulate the dom to add the button
- Write this in the contentScript.js file
  - Operates in the context of the webpage
- Start by defining the variables `youtubeLeftControls` and `youtubePlayer` so that we can place the button.
  - Before we can do this though, we need to set up a listener so we know when to run these operations, otherwise none of this will ever run.
  - This is done in the 'background.js' file >>

## Background.js

- Listen for new tab and check if tab url includes 'youtube.com/watch'
- Store a unique id for each video in the `queryParameters` variable
  - Use split() on the url string to get this unique value.
- Create URLSearchParams (an interface to work with URLs)
  - apparently to pass into it the non-url id???
- Send a message to the content script
  - Says: a new video has loaded, here is the id
  - chrome.tabs.sendMessage()
    - Takes tabId and an object with the parameters
    - The object of parameters is really just some variables that are passed to the content script
    - Can also take a callback function
    - 

## Back to the contentScript

- Now that the Background.js is checking for tabs and passing info back, we can add the listener here
  - use chrome.runtime.onMessage.addListener()
  - accepts obj, sender, response
  - deconstruct these variables
  - Check if type === "NEW"
    - assign the videoId to currentVideo (a global variable in contentScript.js)
    - Call a separate function to handle the new video

- newVideoLoaded()
  - First, lets get back to adding the button
  - Check the if the button exists with some native dom/javascript methods
    - document.getElementsByClassName()
  - If it does not exist, add the button to the page
  - Create the button with document.createElement()
  - Then add some attributes
    - .src = chrome.runtime.getURL("assets/bookmark.png")
      - The image that is displayed to click on
    - .className = "ytp-button " + "bookmark-btn"
      - the class name for styling
    - .title = "Click to bookmark current timestamp"
      - Just a description

    - Next we need to grab the youtube video player and controls:
      - document.getElementsByClassName("ytp-left-controls")[0]
      - document.getElementsByClassName("video-stream")[0]
    - Then set them to variables in the function
    - Add to the video with .appendChild() on the video controls variable
      - Need to add a listener to listen for any "clicks" on the button

** Disclaimer **
- manifest.json indicates which website to run the contentScript.js file on.
- background.js makes sure it is youtube.com, then runs the logic
- Unfortunately, the listener used is chrome.tabs.onUpdated.addListener, which only runs on an "updated" tab
- This means that a refresh will not make any changes
- This can be fixed by running the newvideoloaded() function a second time, outside of the "listening" function that observes background.js in the contentScript.js
- This function will be called twice, but a conditional could be used to ensure this doesn't have it
- The only thing this function does is "add the button", which is not problematic to do twice.

** Disclaimer **

Back to listening for a click:
- 






IMDB code:

Check that title is movie:
document.querySelectorAll('[property="og:type"]')[0].content === "video.movie"

Get rating:
rating = document.querySelectorAll('[data-testid="hero-rating-bar__aggregate-rating__score"]')[0].getElementsByTagName("span")[0].textContent


old:

let genre_list = document.getElementsByClassName("ipc-chip-list__scroller")[0]

let num_genres = genre_list.getElementsByTagName("span").length

for (let i = 0; i <= num_genres; i++) {
  let genre = genre_list.getElementsByTagName("span")[i] 
  let genre_text = genre.textContent

  genre.textContent = genre_text.concat("(82)")
}

Alternative:

if (document.querySelectorAll('[property="og:type"]')[0].content === "video.movie"){
  rating = document.querySelectorAll('[data-testid="hero-rating-bar__aggregate-rating__score"]')[0].getElementsByTagName("span")[0].textContent

  let genre_div = document.getElementsByClassName("ipc-chip-list__scroller")[0]
  let genre_list = genre_div.getElementsByTagName("span")

  for (let genre of genre_list) {
    let genre_text = genre.textContent
    let rank = genre_dict[genre_text][rating]

    genre.textContent = genre_text.concat(" (", Math.round(rank), ")")
  }
}