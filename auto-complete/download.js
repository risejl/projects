const request = require('request')
const fs = require('fs')

const BOOKLIST = [
'https://www.gutenberg.org/ebooks/2641.txt.utf-8',
'https://www.gutenberg.org/ebooks/145.txt.utf-8',
'https://www.gutenberg.org/ebooks/37106.txt.utf-8'
];

for (let i = 0; i < BOOKLIST.length; i += 1) {
  request(BOOKLIST[i]).pipe(fs.createWriteStream(`${i}.txt`));
}
