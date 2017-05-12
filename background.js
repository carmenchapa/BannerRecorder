    var filesarr = [];
    var aTag;
    var stage = null;

    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.type === "enable") {
            chrome.pageAction.show(sender.tab.id);
        } else if (request.type === "up") {
            capture(sender.tab.id, request.dimensions);
        } else if (request.type === "stopped") {
            // $.when($.ajax(createvideo())).then(function() {

            //     finalizeVideo(video);

            // });
            createvideo();

            // chrome.tabs.get(tabId, function(tab) {
            //     chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, function(dataUrl) {
            //         chrome.tabs.executeScript(tabId, { file: "whammy.js" });
            //         // We call resolve(...) when what we were doing async succeeded, and reject(...) when it failed.
            //         // In this example, we use setTimeout(...) to simulate async code. 
            //         // In reality, you will probably be using something like XHR or an HTML5 API.
            //         myPromise;
            //     });
            // });
            // myPromise;
        }

        sendResponse({
            message: 'send()'
        });

        function send() {
            chrome.tabs.sendMessage(sender.tab.id, request,
                function(response) {});
        }
    });


    function clickPlay(tab) {
        chrome.tabs.executeScript(null, { code: "start();" });
        window.close();
    }

    function clickStop(tab) {
        // send({ type: "stop", dimensions: filesarr });
        // // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // //     chrome.tabs.sendMessage(tab.id, { type: "stop" }, function(response) {
        // //         // createvideo(filesarr);
        // //     });
        // // });

        chrome.tabs.executeScript(null, { code: "stop();" });
        window.close();
    }

    document.addEventListener('DOMContentLoaded', function() {
        var divs = document.querySelectorAll('#green');
        for (var i = 0; i < divs.length; i++) {
            divs[i].addEventListener('click', clickPlay);
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        var divs = document.querySelectorAll('#red');
        for (var i = 0; i < divs.length; i++) {
            divs[i].addEventListener('click', clickStop);
        }
    });


    var canvas = null;

    function capture(tabId, dimensions) {

        chrome.tabs.get(tabId, function(tab) {
            chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, function(dataUrl) {

                chrome.tabs.executeScript(tabId, { file: "createvideo.js" });
                chrome.tabs.executeScript(tabId, { file: "whammy.js" });
                chrome.tabs.executeScript(tabId, { file: "download.js" });

                if (!canvas) {
                    canvas = document.createElement("canvas");
                    document.body.appendChild(canvas);
                }

                var image = new Image();
                image.onload = function() {

                    var pixelRatio = 1 / dimensions.pixelRatio;
                    canvas.width = Math.round(dimensions.width * pixelRatio);
                    canvas.height = Math.round(dimensions.height * pixelRatio);
                    var context = canvas.getContext("2d");
                    context.drawImage(image, dimensions.left, dimensions.top, dimensions.width, dimensions.height, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(function(blob) {
                        // download(blob, dimensions.name + '.png', 'image/png');

                        console.log(blob);

                        //Convert blob to file
                        var file = new File([blob], dimensions.name, { type: 'image/png', lastModified: Date.now() });
                        console.log("file " + file);
                        console.dir("file " + file);

                        filesarr.push(file);

                        console.log('filesarr ' + filesarr);
                        console.dir('filesarr dir ' + filesarr);

                    }, 'image/png');

                };
                image.src = dataUrl;

            });
        });
    }
