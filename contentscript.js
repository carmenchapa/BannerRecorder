// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

// if (request.type === "start") {
//         //This fire the start function and top it with clearInterval after some time. As a result download images every x milliseconds until sopping.

//         // var starting = setInterval(start,750);
//         // setTimeout(function(){
//         //     clearInterval(starting);
//         // },6000);
//         start();

// }
//     if (request.type === "stop") {
//         stop(filesarr);
//     sendResponse(document.all[0].outerHTML);
// }
// });

function send(request) {
    chrome.extension.sendMessage(request, function(response) {});
}

function createScreenshot(iframe, name) {
    var dimensions = {};
    if (!(iframe.top + iframe.height > document.documentElement.clientHeight || iframe.top < 0)) {

        var pixelRatio = window.devicePixelRatio;
        dimensions.top = Math.round(Math.round(iframe.top) * pixelRatio);
        dimensions.left = Math.round(Math.round(iframe.left) * pixelRatio);
        dimensions.width = Math.ceil(iframe.width * pixelRatio);
        dimensions.height = Math.ceil(iframe.height * pixelRatio);
        dimensions.pixelRatio = pixelRatio;

        dimensions.name = name;
        send({ type: "up", dimensions: dimensions });

    }
}

var starting

function stop(filesarr) {
    clearInterval(starting);
    var tester = 1;
    // createvideo(filesarr);
    if (tester) {
        send({ type: "stopped" });
    }
    //Cretevideo
    // chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    //     if (request.type === "stop") {
    //         console.log('heard stop');
    //         createvideo();
    //     }
    //     sendResponse(document.all[0].outerHTML);
    // });
}

function start() {

    starting = setInterval(startRecord, 750);

    function startRecord() {
        var iframeBannerPreviewApp = document.getElementById('iframe');
        var creativeLocalHost = document.getElementById('container');
        var iframeDynamicPreview = document.getElementsByTagName('iframe');

        if (iframeBannerPreviewApp) {
            iframe = iframeBannerPreviewApp.getBoundingClientRect();
            createScreenshot(iframe, document.title);
        } else if (creativeLocalHost) {
            iframe = creativeLocalHost.getBoundingClientRect();
            createScreenshot(iframe, iframe.width + 'x' + iframe.height + ' - ' + document.title);
        } else {
            var i = 1;
            while (iframeDynamicPreview[i]) {
                iframe = iframeDynamicPreview[i].getBoundingClientRect();
                createScreenshot(iframe, iframe.width + 'x' + iframe.height + ' - ' + document.title);
                i++;
            }
        }
    }
}

send({ type: "enable" });
