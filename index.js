var captionCount = 0;

const captionForm = document.getElementById("captionForm");
const addCaptionButton = document.getElementById("addCaptionButton");
const captionsContainer = document.getElementById("captionsContainer");

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
                        <label for="startTimestamp${captionCount}" class="form-label">Start Timestamp:</label>
                        <input type="text" class="form-control" id="startTimestamp${captionCount}" name="startTimestamp${captionCount}" required>
                    </div>
                    <div class="col">
                        <label for="endTimestamp${captionCount}" class="form-label">End Timestamp:</label>
                        <input type="text" class="form-control" id="endTimestamp${captionCount}" name="endTimestamp${captionCount}" required>
                    </div>
                </div>
                <label for="caption${captionCount}" class="form-label">Caption:</label>
                <textarea class="form-control" id="caption${captionCount}" name="caption${captionCount}" rows="4" required></textarea>
            </div>
        </div>
    `;

    captionsAccordion.appendChild(captionInput);
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
