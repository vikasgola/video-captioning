var captionCount = 0;

const captionForm = document.getElementById("captionForm");
const addCaptionButton = document.getElementById("addCaptionButton");
const captionsContainer = document.getElementById("captionsContainer");
const clearButton = document.getElementById("clearButton");

// add new caption form in caption container
function addNewCaptionForm(){
    captionCount++;

    const captionsAccordion = document.getElementById("captionsAccordion");

    // close all existing accordion items
    const existingItems = captionsAccordion.querySelectorAll(".accordion-item");
    existingItems.forEach(item => {
        const collapseElement = item.querySelector(".accordion-collapse");
        const collapseInstance = new bootstrap.Collapse(collapseElement, { toggle: false });
        collapseInstance.hide();
    });

    // create new accordion item
    const captionInput = document.createElement("div");
    captionInput.classList.add("accordion-item");

    captionInput.innerHTML = `
        <h2 class="accordion-header" id="captionHeading${captionCount}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#captionCollapse${captionCount}" aria-expanded="true" aria-controls="captionCollapse${captionCount}">
                Caption ${captionCount}
            </button>
        </h2>
        <div id="captionCollapse${captionCount}" class="accordion-collapse collapse show" aria-labelledby="captionHeading${captionCount}" data-bs-parent="#captionsAccordion">
            <div class="accordion-body">
                <div class="row mb-3">
                    <div class="col">
                        <label class="form-label">Start Timestamp (HH:MM:SS):</label>
                        <div class="row">
                            <div class="col">
                                <input type="number" class="form-control start-hour" id="startHour${captionCount}" name="startHour${captionCount}" min="0" placeholder="HH" required>
                            </div>
                            <div class="col">
                                <input type="number" class="form-control start-minute" id="startMinute${captionCount}" name="startMinute${captionCount}" min="0" max="59" placeholder="MM" required>
                            </div>
                            <div class="col">
                                <input type="number" class="form-control start-second" id="startSecond${captionCount}" name="startSecond${captionCount}" min="0" max="59" placeholder="SS" required>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <label class="form-label">End Timestamp (HH:MM:SS):</label>
                        <div class="row">
                            <div class="col">
                                <input type="number" class="form-control end-hour" id="endHour${captionCount}" name="endHour${captionCount}" min="0" placeholder="HH" required>
                            </div>
                            <div class="col">
                                <input type="number" class="form-control end-minute" id="endMinute${captionCount}" name="endMinute${captionCount}" min="0" max="59" placeholder="MM" required>
                            </div>
                            <div class="col">
                                <input type="number" class="form-control end-second" id="endSecond${captionCount}" name="endSecond${captionCount}" min="0" max="59" placeholder="SS" required>
                            </div>
                        </div>
                    </div>
                </div>
                <label for="caption${captionCount}" class="form-label">Caption:</label>
                <textarea class="form-control" id="caption${captionCount}" name="caption${captionCount}" rows="4" required></textarea>
            </div>
        </div>
    `;

    captionsAccordion.appendChild(captionInput);
}

// function to validate timestamp format
function isValidTimestamp(hour, minute, second) {
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59;
}

// function to convert timestamp to seconds
function convertToSeconds(hour, minute, second) {
    return parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second);
}

// load video with caption
function loadVideoWithCaption(){
    // set video url to video element
    const videoUrl = document.getElementById("videoUrl").value;
    const video = document.getElementById("videoPlayer");

    var track = video.textTracks[0];
    if(!track){
        if(captionCount > 0){
            // add text track if there is no text track and at least 1 caption is provided
            track = video.addTextTrack("captions");
        }
    }else{
        // remove previous cues
        while(track.cues.length > 0){
            track.removeCue(track.cues[0])
        }
    }

    // Add caption to video player
    for (let i = 1; i <= captionCount; i++) {
        // get submitted timestamp and caption values in the form
        const startHour = document.getElementById(`startHour${i}`).value;
        const startMinute = document.getElementById(`startMinute${i}`).value;
        const startSecond = document.getElementById(`startSecond${i}`).value;
        const endHour = document.getElementById(`endHour${i}`).value;
        const endMinute = document.getElementById(`endMinute${i}`).value;
        const endSecond = document.getElementById(`endSecond${i}`).value;
        const caption = document.getElementById(`caption${i}`).value;

        // Validate timestamps
        if (!isValidTimestamp(startHour, startMinute, startSecond) || !isValidTimestamp(endHour, endMinute, endSecond)) {
            alert("Invalid timestamp format. Please enter valid hour, minute, and second values.");
            return;
        }

        // convert input timestamp format to seconds
        const startSeconds = convertToSeconds(startHour, startMinute, startSecond);
        const endSeconds = convertToSeconds(endHour, endMinute, endSecond);

        // validate end timestamp greater than start timestamp
        if (endSeconds <= startSeconds) {
            alert("End timestamp should be greater than start timestamp.");
            return;
        }

        // Create cue with caption text and add it to the track
        const cue = new VTTCue(startSeconds, endSeconds, caption);
        track.addCue(cue);
    }
    video.src = videoUrl;
}

function clearForm(){
    document.getElementById("captionForm").reset();

    // Clear video player
    const video = document.getElementById("videoPlayer");
    video.src = "";
    video.load();

    // reset caption count
    captionCount = 0;

    // remove all accordion items
    const captionsAccordion = document.getElementById("captionsAccordion");
    captionsAccordion.innerHTML = "";
}

// add listner for clear button
clearButton.addEventListener("click", clearForm);

// add listner for add caption button
addCaptionButton.addEventListener("click", addNewCaptionForm);

// add listener for submiting form
captionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadVideoWithCaption();
});
