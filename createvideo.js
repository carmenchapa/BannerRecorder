    function createvideo() {
        console.log('IN CreateVideo');

        var span = document.createElement('span');
        span.id = 'status';
        document.body.appendChild(span);

        var video = document.createElement('video');
        video.id = 'awesome';
        video.controls;
        video.autoplay;
        video.loop;
        document.body.appendChild(video);

        aTag = document.createElement('a');
        aTag.style.display = 'none';
        aTag.id = 'download';
        aTag.download = "video.webm"
        document.body.appendChild(aTag);

        var canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        document.body.appendChild(canvas);

        var context = canvas.getContext("2d");

        //image to video via Whammy
        var video = new Whammy.Video(1);

        // document.getElementById('status').innerHTML = "Working... Please Wait.";
        // document.getElementById('awesome').src = "";
        ctx = 0;

        canvas.width = 728;
        canvas.height = 90;
        video = new Whammy.Video(45);

        //if we have images loaded
        if (filesarr.length > 0) {
            console.log(filesarr.length);

            //loop through them and process
            for (i = 0; i < filesarr.length; i++) {
                var file = filesarr[i];
                console.log(file);
                if (file.type.match(/image.*/)) {
                    process(file, context, video);
                } else {
                    console.log("This file does not seem to be a image.");
                    // document.getElementById('status').innerHTML = "This file does not seem to be a image.";
                }
            }
            finalizeVideo(newVideo);


        } else {
            console.log("Please select some images.");
            // document.getElementById('status').innerHTML = "Please select some images.";
        }

    };

    /* main process function */

    function process(file, context, video) {
        console.log('IN process');

        var reader = new FileReader();
        reader.onload = function(event) {
            var dataUri = event.target.result;
            var img = new Image();

            //load image and drop into canvas
            img.onload = function() {

                //a custom fade in and out slideshow
                context.globalAlpha = 0.2;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                video.add(context);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.globalAlpha = 0.4;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                video.add(context);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.globalAlpha = 0.6;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                video.add(context);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.globalAlpha = 0.8;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                video.add(context);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.globalAlpha = 1;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);

                //this should be a loop based on some user input
                video.add(context);
                video.add(context);
                video.add(context);
                video.add(context);
                video.add(context);
                video.add(context);
                video.add(context);

                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.globalAlpha = 0.8;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                video.add(context);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.globalAlpha = 0.6;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                video.add(context);
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                context.globalAlpha = 0.4;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                video.add(context);

                ctx++;
                // finalizeVideo(video);


            };
            img.src = dataUri;
        };

        reader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };

        reader.readAsDataURL(file);
        console.log(video);
        var newVideo = video;
        return newVideo;

    }

    var output;
    var url;

    function finalizeVideo(video) {
        //check if its ready
        console.log('IN finalizeVideo');
        if (ctx == filesarr.length) {

            var start_time = +new Date;
            output = video.compile();
            console.log("output " + output)
            var end_time = +new Date;
            url = URL.createObjectURL(output);

            document.getElementById('awesome').src = url; //toString converts it to a URL via Object URLs, falling back to DataURL
            document.getElementById('download').style.display = '';
            document.getElementById('download').href = url;
            document.getElementById('status').innerHTML = "Compiled Video in " + (end_time - start_time) + "ms, file size: " + Math.ceil(output.size / 1024) + "KB";

        }
        // aTag.click();
        //With the download thing is compiling and downloading one video per image (thats what it seems)
        download(output, "NAME" + '.webm', 'video/webm');
        console.log("downloading");

    }


    // var myPromise = new Promise(
    //     function(resolve, reject) {
    //         if (1 + 1 == 2) {
    //             finalizeVideo();
    //         } else {
    //             console.log("The promise wasn't succeed");
    //         }
    //         // We call resolve(...) when what we were doing async succeeded, and reject(...) when it failed.
    //         // In this example, we use setTimeout(...) to simulate async code. 
    //         // In reality, you will probably be using something like XHR or an HTML5 API.

    //         // createvideo();
    //     });


    // myPromise.then((successMessage) => {
    //     // successMessage is whatever we passed in the resolve(...) function above.
    //     // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
    //     finalizeVideo(video)
    // });
