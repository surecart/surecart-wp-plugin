const shell = require('shelljs');
const path = require('path');
const glob = require('glob');

const dirPath = path.join(__dirname, '..', 'languages', 'temp');

// Get all pot files
glob('*.pot', { cwd: dirPath}, function (er, files) {

  // Tranalte each file and create final file in languages folder
  files.forEach(function (file) {
    let language_code = file.replace('surecart-', '').replace('.pot', '');
    console.log( file );
    console.log( language_code );
    shell.exec(
    	'./languages/vendor/bin/potrans google languages/temp/' + file + ' ./languages/ --credentials=./languages/credentials.json --from=en --to=' + language_code
    );
  });
})

