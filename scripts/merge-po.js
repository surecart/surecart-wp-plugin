const shell = require('shelljs');
const path = require('path');
const glob = require('glob');


const dirPath = path.join(__dirname, '..', 'languages', 'temp');

// Get all po files
glob('*.po', { cwd: dirPath}, function (er, files) {

  files.forEach(function (file) {
    console.log( file );
    // Merge downloaded files with new pot file and create new language pot files for translation
    shell.exec(
    	'msgcat --no-wrap --use-first  languages/surecart.pot languages/temp/' + file + ' -o languages/temp/' + file + 't'
    );
  });
})

