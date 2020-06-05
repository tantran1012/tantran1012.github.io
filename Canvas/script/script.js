//Source: Au Duong Tan Sang - 1712145

window.onload = function () {

    //Get all necessary HTML elements
    var canvas1 = document.getElementById("myCanvas1");
    var context1 = canvas1.getContext("2d");

    var canvas2 = document.getElementById("myCanvas2");
    var context2 = canvas2.getContext("2d");

    var video = document.getElementById("myVideo");
    var button = document.getElementById("myButton");

    //Play/Pause button event handler
    button.onclick = function () {
        if (video.paused) {
            video.play();
            button.innerHTML = "Pause";
        }
        else {
            video.pause();
            button.innerHTML = "Play";
        }
    };

    //Do some initializations when video is ready
    video.oncanplay = function () {
        var vid = this;

        canvas1.width = canvas2.width = vid.videoWidth;
        canvas1.height = canvas2.height = vid.videoHeight;

        button.disabled = false;
    };

    //Extract video frames and detect edge while video is playing
    video.onplay = function () {
        var vid = this;

        (function loop() {
            if (!vid.paused && !vid.ended) {

                //Draw original current frame on context1
                context1.drawImage(vid, 0, 0);

                //Get image data from context1 and detect edge
                var frameData = context1.getImageData(0, 0, vid.videoWidth, vid.videoHeight);
                var frameEdge = sobel(frameData);

                //Draw edge image data on context2
                context2.putImageData(frameEdge, 0, 0);

                //Loop these things every 1000/30 miliseconds (30 fps)
                setTimeout(loop, 1000 / 30);
            }
        })();
    };

    //Change button to "Play" when video has ended
    video.onended = function () {
        button.innerHTML = "Play";
    };
};

function sobel(imgData) {

    //Some image information
    var row = imgData.height;
    var col = imgData.width;

    var rowStep = col * 4;
    var colStep = 4;

    var data = imgData.data;

    var newImgData = new ImageData(col, row);

    //Loop for each pixel
    for (var i = 1; i < row - 1; i += 1)
        for (var j = 1; j < col - 1; j += 1) {

            //Current position
            var center = i * rowStep + j * colStep;
            var dx = data[center - rowStep + colStep] - data[center - rowStep - colStep] +    //topR - topL
                     ((data[center + colStep] - data[center - colStep]) << 1) +               //R - L
                     data[center + rowStep + colStep] - data[center + rowStep - colStep];     //botR - botL

            var dy = data[center + rowStep - colStep] - data[center - rowStep - colStep] +    //botL - topL
                     ((data[center + rowStep] - data[center - rowStep]) << 1) +               //bot - top
                     data[center + rowStep + colStep] - data[center - rowStep + colStep];     //botR - topR

            if (Math.sqrt(dx * dx + dy * dy) >= 150)
                newImgData.data[center] = newImgData.data[center + 1] = newImgData.data[center + 2] = 255;
            else
                newImgData.data[center] = newImgData.data[center + 1] = newImgData.data[center + 2] = 0;

            newImgData.data[center + 3] = 255;
        }

    return newImgData;
}