const fs = require('fs'); 

const readFilesIntoWordArray = function (filenames) { 

    let data = ''; 
    filenames.forEach(file => {
        data = data + ' ' +  fs.readFileSync(file, 'utf8'); 
    });

    data = data.replace(/\r?\n|\r/g, ' '); 
    
    const replacements = [',','.',':','!','?','"','“','”',';','(',')','-','_']; 
    replacements.forEach((value) => {
        data = data.replace(RegExp('\\' + value,'g'), ' ' + value + ' '); 
    }); 

    let wordArray = data.split(' '); 

    wordArray = wordArray.filter(word => word.trim().length !== 0); 
    return wordArray; 
}

const buildMap = function (tokens, depth) {
    let map = {};

    for (let index = 0; index < tokens.length - depth; index += 1) {
       
        let phrase = ""; 
        for (let depthIndex = 0; depthIndex < depth; depthIndex += 1) {
            const currWord = tokens[depthIndex + index];
            phrase = phrase + ' ' + currWord; 
        }

        phrase = phrase.trimStart(); 

        if (!map[phrase]){
            map[phrase] = {}; 
        }

        let nextWord = tokens[index + depth];

        let nextWordList = map[phrase]; 
        if (!nextWordList[nextWord]){
            nextWordList[nextWord] = 1
        } else
        {
            nextWordList[nextWord] += 1; 
        }
    }
    
    return map; 
}

const chooseWordWeighted = function (wordList) {
    let keys = Object.keys(wordList);

    let sumOfWeights = 0; 
    keys.forEach(key => {
        sumOfWeights += wordList[key]; 
    });

    let random = Math.random() * sumOfWeights; 

    let currWord = ''; 
    keys.every(word => {
        currWord = word; 
        random -= wordList[word]; 
        return (random > 0); 
    });

    return currWord; 
} 

const suggestWord = function (startPhrase, wordMap) {
    let wordList = wordMap[startPhrase];
    let suggestedWord = chooseWordWeighted(wordList);
    return suggestedWord; 
}

const createSentence = function (startPhrase, wordMap, sentenceLength, depth) {
  let sentence = '';
  for (let wordCount = 0; wordCount < sentenceLength; wordCount += 1) {
    let nextWord = chooseWordWeighted(wordMap[startPhrase]);
    sentence = sentence + nextWord + ' ';
    tokenizedPhrase = startPhrase.split(' ');
    startPhrase = '';
    for (let i = 1; i < depth; i += 1) {
      startPhrase = startPhrase + tokenizedPhrase[i] + ' ';
    }
    startPhrase = startPhrase + nextWord;
  }
  return sentence;
}

const depth = 3;
let allWords = readFilesIntoWordArray(["0.txt", "1.txt", "2.txt"]); 
let map = buildMap(allWords, depth); 

const INITIALPHRASE = "and then I"; 
let sentence = createSentence(INITIALPHRASE, map, 50, depth); 
console.log(INITIALPHRASE + ': ' + sentence); 


const chooseWord = function (wordList) {
    let keys = Object.keys(wordList);
    let word = keys[keys.length * Math.random() << 0];
    return word; 
}

