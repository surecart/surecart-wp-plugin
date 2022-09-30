const http = require('https');
const fs = require('fs');

// Create directory if not exist
fs.mkdir('./languages/temp', { recursive: true }, (err) => {
  if (err) throw err;
});

function getRemoteFile(url) {
  let fileName = '';
  const request = http.get(url, function(response) {
    let cur = 0;

    response.on('data', function(chunk) {
      cur += chunk.length;
      console.log("Downloading " + fileName + " - " + (cur / 1048576).toFixed(2) + " MB");
    });

    response.on('end', function() {
      console.log("Download completed");
    });

    fileName = response.headers['content-disposition'].split('filename=')[1].split('"')[1].replace("wp-plugins-", "").replace("stable-", "");
    let localFile = fs.createWriteStream( "./languages/temp/" + fileName);

    response.pipe(localFile);
  });
}

const languages = [
  // {
  //   code: "de"
  // },
  {
    code: "es"
  },
  // {
  //   code: "fr"
  // },
];

languages.forEach(function(item) {
  let url = "https://translate.wordpress.org/projects/wp-plugins/surecart/stable/" + item.code + "/default/export-translations/?format=po"
  getRemoteFile(url);
})
