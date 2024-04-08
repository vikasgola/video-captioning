var captionForm = document.getElementById("captionForm");

captionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // get all the submitted values in the form
    const videoUrl = document.getElementById("videoUrl").value;
    const startTimestamp = document.getElementById("startTimestamp").value;
    const endTimestamp = document.getElementById("endTimestamp").value;
    const caption = document.getElementById("caption").value;

    // set video url to video element
    const video = document.getElementById("videoPlayer");
    video.src = videoUrl;

    // Check if a TextTrack already exists, if not, create one
    if (!video.textTracks[0]) {
        video.addTextTrack("captions");
    }

    // Add cue to the TextTrack
    const track = video.textTracks[0];
    track.addCue(new VTTCue(startTimestamp, endTimestamp, caption));
});
