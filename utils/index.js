const fs = require('fs');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const removeInvalidIds = (arr) => {
    const validIds = [];
    arr.forEach((id) => {
      if (ObjectId.isValid(id)) {
        validIds.push(id);
      }
    });
    return validIds;
  };

const readFileLines = filename =>{
  return (fs
    .readFileSync(filename)
    .toString('UTF8')
    .split('\n'))
}

const cleanFileLines = (fileLines) => {
  const cleanedResult = [];
  for(let i = 0 ; i < fileLines.length; i++){
    fileLines[i] = fileLines[i].split('\r')[0]
    // checking against things like - empty lines, blank spaces
    if (fileLines[i] && fileLines[i].length > 0) cleanedResult.push(fileLines[i])
  }
  return cleanedResult
}

const parseFile = (filePath) => {
  const dirtyFileContent = readFileLines(filePath);
  const cleanFileContent = cleanFileLines(dirtyFileContent);
  return cleanFileContent;
}

const computeUserResult = (referenceResultFilePath, userResultFilePath) => {
  const referenceResult = parseFile(referenceResultFilePath);
  const userResult = parseFile(userResultFilePath);
  const totalTestCases = parseInt(referenceResult[0]);
  let passedTestCases = 0;
  try {
    // starts from 1 since the result file ideally has the first entry as the number of test cases
    let resultPtr = 1;
    while (resultPtr < Math.min(referenceResult.length,userResult.length)){
      if (referenceResult[resultPtr] === userResult[resultPtr]){
        passedTestCases+=1
      }
      resultPtr+=1
    }
  } catch (error) {
    console.log(error)
    
  }
  return passedTestCases/totalTestCases
  

}

// console.log(computeUserResult('file1.txt','file2.txt'))

module.exports = {
    removeInvalidIds,
    computeUserResult,
}