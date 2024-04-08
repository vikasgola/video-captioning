var captionCount = 1;

const captionForm = document.getElementById("captionForm");
const addCaptionButton = document.getElementById("addCaptionButton");
const captionsContainer = document.getElementById("captionsContainer");

// add new caption form in caption container
function addNewCaptionForm(){
    captionCount++;

    const captionInput = document.createElement("div");
    captionInput.innerHTML = `
        <label for="startTimestamp${captionCount}">Start Timestamp:</label>
        <input type="text" id="startTimestamp${captionCount}" name="startTimestamp${captionCount}" required>
        <label for="endTimestamp${captionCount}">End Timestamp:</label>
        <input type="text" id="endTimestamp${captionCount}" name="endTimestamp${captionCount}" required>
        <label for="caption${captionCount}">Caption:</label>
        <textarea id="caption${captionCount}" name="caption${captionCount}" rows="4" required></textarea>
    `;

    captionsContainer.appendChild(captionInput);
}

// load video with caption
function loadVideoWithCaption(){
    // set video url to video element
    const videoUrl = document.getElementById("videoUrl").value;
    const video = document.getElementById("videoPlayer");
    video.src = videoUrl;

    // Add caption to video player
    const track = video.textTracks[0] || video.addTextTrack("captions");
    for (let i = 1; i <= captionCount; i++) {
        // get submitted timestamp and caption values in the form
        const startTimestamp = document.getElementById(`startTimestamp${i}`).value;
        const endTimestamp   = document.getElementById(`endTimestamp${i}`).value;
        const caption        = document.getElementById(`caption${i}`).value;

        track.addCue(new VTTCue(startTimestamp, endTimestamp, caption));
    }
}

// add listner for add caption button
addCaptionButton.addEventListener("click", addNewCaptionForm);

// add listener for submiting form
captionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadVideoWithCaption();
});
