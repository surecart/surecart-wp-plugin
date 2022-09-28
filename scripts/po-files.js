const http = require('https');
const fs = require('fs');

function getRemoteFile(file, url) {
    // let localFile = fs.createWriteStream(file);
    let fileName = '';
    const request = http.get(url, function(response) {
        // debugger
        var len = parseInt(response.headers['content-length'], 10);
        var cur = 0;
        var total = len / 1048576; //1048576 - bytes in 1 Megabyte

        response.on('data', function(chunk) {
            cur += chunk.length;
            showProgress(fileName, cur, len, total);
        });

        response.on('end', function() {
            console.log("Download complete");
        });

        fileName = response.headers['content-disposition'].split('filename=')[1].split('"')[1].replace("wp-plugins-", "").replace("stable-", "");
        let localFile = fs.createWriteStream( "./languages/" + fileName);

        response.pipe(localFile);
    });
}

function showProgress(file, cur, len, total) {
    console.log("Downloading " + file + " - " + (100.0 * cur / len).toFixed(2)
        + "% (" + (cur / 1048576).toFixed(2) + " MB) of total size: "
        + total.toFixed(2) + " MB");
}

const targets = [
    {
        name: "surecart-fr.po",
        file: "surecart-fr.po",
        url: "https://translate.wordpress.org/projects/wp-plugins/surecart/stable/mr/default/export-translations/?format=po"
    }
];

/*let file = 'jettison.jar';
let url = '';
getRemoteFile(file, url);*/

targets.forEach(function(item) {
    getRemoteFile(item.file, item.url);
})
