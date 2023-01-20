const shell = require('shelljs');
const glob = require('glob');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'languages');

// Get all po files
glob('*.po', { cwd: dirPath}, function (er, files) {

  files.forEach(function (file) {
    console.log( file );
    let target_filename = file.replace( '.po' , '.json');

    // Convert .po to .json file
    shell.exec(
      'po2json languages/' + file + ' languages/' + target_filename + ' -f jed1.x'
    );
  });
})
