const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputFolder = '/Users/riad_gh/Documents/cources/Adobe XD/04-Creating Design';
const outputFolder = '/Users/riad_gh/Documents/cources/Adobe XD/04-Creating Design NewVr';

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error('Could not list the directory.', err);
    process.exit(1);
  }

  // Copy non-video files to the output folder
  files.forEach((file) => {
    const inputFilePath = path.join(inputFolder, file);
    const outputFilePath = path.join(outputFolder, file);

    if (path.extname(file).toLowerCase() !== '.mp4') {
      fs.copyFile(inputFilePath, outputFilePath, (err) => {
        if (err) {
          console.error(`Error copying file ${file}:`, err.message);
        } else {
          console.log(`File ${file} has been copied to output folder`);
        }
      });
    }
  });

  // Convert .mp4 files to 720p
  files.forEach((file) => {
    const inputFilePath = path.join(inputFolder, file);
    const outputFilePath = path.join(outputFolder, file);

    if (path.extname(file).toLowerCase() === '.mp4') {
      const ffmpeg = spawn('ffmpeg', ['-i', inputFilePath, '-vf', 'scale=1280:720', outputFilePath]);

      ffmpeg.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      ffmpeg.stderr.on('data', (data) => {
        console.error(`hello: ${data}`);
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          console.log(`File ${file} has been converted to 720p`);
        } else {
          console.error(`Error converting file ${file}: ffmpeg exited with code ${code}`);
        }
      });
    }
  });
});
