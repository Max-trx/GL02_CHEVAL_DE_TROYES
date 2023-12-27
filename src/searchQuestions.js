const readline = require("readline");
const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")();
const colors = require('colors');

//filter syntax : [”MC”,”SHORT”,”TF”,”NUM”]
// true if if you want questions of this type, false else
let filters = { MC: false, SHORT: false, TF: false, NUM: false };
let keywords = [];
let questionsFilteredByType = [];

//display the number of questions found and active filters.
function displayResultsActiveFilters(resultsQuestions, filters, keywords) {
  console.log(
    `Found ${resultsQuestions.length}${
      resultsQuestions.length > 1 ? " questions" : " question"
    } with :\n - Filters: ${filters.MC ? " -MC" : ""}${
      filters.SHORT ? " -SHORT" : ""
    }${filters.TF ? " -TF" : ""}${filters.NUM ? " -NUM" : ""}${
      keywords ? "\n - Keywords: -" + keywords.join(" -") : ""
    }`,
  );
}
//display the questions in a readable format.
function prettyDisplayQuestion(questions) {
  for (let question of questions) {
    console.log(
      question.result[0][0].type +
        " | " +
        question.result[0][0].title +
        " | " +
        question.result[0][0].stem.text,
    );
  }
}
//get all the questions with the keywords from keywords list.
function getQuestionsWithKeywords(listOfQuestions, keywords) {
  // Array to store questions containing all keywords
  const matchingQuestions = [];
  //console.log("Current list of Questions " + listOfQuestions);

  // Iterate through each question
  for (let question of listOfQuestions) {
    // Check if all keywords are present in the current question
    if (
      keywords.every((keyword) =>
        question.result[0][0].stem.text.includes(keyword),
      )
    ) {
      // If all keywords are present, add the question to the result array
      matchingQuestions.push(question);
    }
  }

  // Return the array of questions containing all keywords
  return matchingQuestions;
}
//get all the questions from a list of files in a folder
function readFilesFromFolder(folderPath) {
  try {
    // Read the files in the folder synchronously
    const files = fs.readdirSync(folderPath);

    // An array to store the content of each file
    const allFileContent = [];

    // Iterate through the files
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Read the content of each file synchronously
      const data = readQuestionsFromFile(filePath);

      // Add the content to the array
      allFileContent.push(data);
    });
    //console.log("allFilContent 1");
    //console.log(allFileContent[1][0].result[0][0].type);
    //console.log(JSON.parse(allFileContent.toString()));

    return allFileContent;
  } catch (err) {
    console.error(("Error reading folder:", err).red);
    return null;
  }
}
//get all the questions from a a file
function readQuestionsFromFile(filePath) {
  let readQuestions = fs.readFileSync(filePath).toString();
  return JSON.parse(readQuestions.toString());
}

//display all the question with the user's keywords.
function displayMatchingQuestions(keywords) {
  let folderPath = "../jsonResult";

  let allFiles = readFilesFromFolder(folderPath);
  for (let file of allFiles) {
    for (let i = 0; i < file.length; i++) {
      let currentQuestion = file[i];
      if (file[i].result[0] !== null) {
        if (filters.MC) {
          if (currentQuestion.result[0][0].type === "MC") {
            questionsFilteredByType.push(currentQuestion);
          }
        }
        if (filters.SHORT) {
          if (currentQuestion.result[0][0].type === "Short") {
            questionsFilteredByType.push(currentQuestion);
          }
        }
        if (filters.TF) {
          if (currentQuestion.result[0][0].type === "TF") {
            questionsFilteredByType.push(currentQuestion);
          }
        }
        if (filters.NUM) {
          if (currentQuestion.result[0][0].type === "Numeral") {
            questionsFilteredByType.push(currentQuestion);
          }
        }
      }
    }
  }

  let resultsQuestions = getQuestionsWithKeywords(
    questionsFilteredByType,
    keywords,
  );
  prettyDisplayQuestion(resultsQuestions);
  console.log(
    "----------------------------------------------------------------------------",
  );
  displayResultsActiveFilters(resultsQuestions, filters, keywords);

  //console.log(resultsQuestions);
}
//read the keywords until `/`is pressed.
function readKeywords() {
  console.log(
    `Filters : Multiple Choices=${filters.MC ? "On " : "Off"} SHORT=${
      filters.SHORT ? "On " : "Off"
    } TF=${filters.TF ? "On " : "Off"} NUM=${filters.NUM ? "On " : "Off"}`,
  );
  let userInput = prompt("Enter a keyword or '/' to escape : ");
  if (userInput === "/") {
    if (
      filters.MC === false &&
      filters.SHORT === false &&
      filters.TF === false &&
      filters.NUM === false
    ) {
      console.log("Please Select at least 1 type of question : ".red);
      readKeywords();
    } else {
      console.log(
        "----------------------------------------------------------------------------",
      );
    }
  } else if (userInput === "MC") {
    if (!filters.MC) {
      filters.MC = true;
      readKeywords();
    } else {
      filters.MC = false;
      readKeywords();
    }
  } else if (userInput === "SHORT") {
    if (!filters.SHORT) {
      filters.SHORT = true;
      readKeywords();
    } else {
      filters.SHORT = false;
      readKeywords();
    }
  } else if (userInput === "TF") {
    if (!filters.TF) {
      filters.TF = true;
      readKeywords();
    } else {
      filters.TF = false;
      readKeywords();
    }
  } else if (userInput === "NUM") {
    if (!filters.NUM) {
      filters.NUM = true;
      readKeywords();
    } else {
      filters.NUM = false;
      readKeywords();
    }
  } else {
    // Check if the keyword is already in the list
    const keywordIndex = keywords.indexOf(userInput);
    if (keywordIndex !== -1) {
      // If the keyword is already in the list, remove it
      keywords.splice(keywordIndex, 1);
    } else {
      // If the keyword is not in the list, add it
      keywords.push(userInput);
    }
    readKeywords();
  }
}
//returns all the questions according to a list of keywords and type filters.
function searchQuestions() {
  console.log("Search");
  console.log("Keywords : ");
  readKeywords();
  displayMatchingQuestions(keywords);
}
module.exports= {searchQuestions};
