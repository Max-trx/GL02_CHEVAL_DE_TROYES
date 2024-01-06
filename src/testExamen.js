const fs = require('fs');
const login = require('./login.js');
const prompt = require("prompt-sync")();
const pathFile = ("../utils/users.json");
const {updateUser} = require("./updateUser.js");
const colors = require('colors');

let nomFichierTest;

let affichageDossier = () => {
    const files = fs.readdirSync("../jsonResult");
    let compteur = 1;

    for (const file of files) {
        console.log(compteur + ". " + file);
        compteur++;
    }
}


/**
 * Permet de charger ke fichier JSON contenant les questions et les réponses
 */
let chargerExamen = (user) =>{
    let jsonExamen;
    affichageDossier();
    const files = fs.readdirSync("../jsonResult");

    let choix = prompt("Votre choix : ");
    while(choix < 0 || choix > files.length || isNaN(choix)){
        choix = prompt("Votre choix : ");
    }
    
    let file = files[choix-1];
    console.log(file);



    // Charger le fichier JSON
    let data = fs.readFileSync(`../jsonResult/${file}`, "utf8");
    jsonExamen = JSON.parse(data);
    nomFichierTest = file;
    //commencer le test
    testExamen(jsonExamen, user);
}

/**
 * Permet d'éxécuter le test
 * @param jsonExamen : le fichier JSON contenant les questions et les réponses
 */
let testExamen = (jsonExamen, user) =>{


    let score = 0;
    let nbQuestions = 0;
    let exit = false
    //Parcourir le fichier JSON
    jsonExamen.forEach(question => {
        if(question.result[0] === null || exit === true){
            return;
        }
        //Récupérer le type de la question
        const type = question.result[0][0]?.type;
        if (type !== "Description") console.log('Pour interrompre la simulation tapez exit'.blue)

        //Vérifier le type de la question
        switch (type) {
            case "Description":
                console.log(question.result[0][0]?.stem.text);
                break;
            case "MC":
                console.log(question.result[0][0]?.stem.text);
                nbQuestions++;
                afficherReponses(question.result[0][0]?.choices);
                let reponse = prompt("Votre réponse : ");
                if (reponse==='exit'){
                    console.log('Simulation interrompue'.blue);
                    exit = true;
                    return;
                }
                while(reponse==="" || reponse < 0 || reponse > question.result[0][0]?.choices.length|| isNaN(reponse)){
                    reponse = prompt("Votre réponse (veuillez choisir l'index !)  : ".red);
                    if (reponse==='exit'){
                        console.log('Simulation interrompue'.blue);
                        exit = true;
                        return
                    }
                }
                if(question.result[0][0]?.choices[reponse-1].isCorrect){
                    score++;
                    console.log("Correct".green);
                }else{
                    console.log("Incorrect".red);
                }
                break;
            case "Numerical":
                console.log(question.result[0][0]?.stem.text);
                nbQuestions++;
                let reponseNumerical = prompt("Votre réponse : ");
                if (reponseNumerical==='exit') {
                    console.log('Simulation interrompue'.blue);
                    exit = true;
                    return;
                }
                while(reponseNumerical==="" || isNaN(reponseNumerical) || reponse !== 'exit'){
                    reponseNumerical = prompt("Votre réponse (un nombre !) : ".red);
                    if (reponseNumerical==='exit') {
                        console.log('Simulation interrompue'.blue);
                        exit = true;
                        return;
                    }
                }
                if(verifierReponseNumerical(question.result[0][0]?.choices, reponseNumerical)){
                    score++;
                    console.log("Correct".green);
                }else{
                    console.log("Incorrect".red);
                }
                break;
            case "TF":
                console.log(question.result[0][0]?.stem.text);
                nbQuestions++;
                let reponseTF = prompt("Votre réponse (true/false) : ");
                if (reponseTF==='exit') {
                    console.log('Simulation interrompue'.blue);
                    exit = true;
                    return;
                }
                while(reponseTF.toLowerCase() !== "true" && reponseTF.toLowerCase() !== "false" || reponse !== 'exit'){
                    reponseTF = prompt("Votre réponse (true/false) : ".red);
                    if (reponseTF==='exit') {
                        console.log('Simulation interrompue'.blue);
                        exit = true;
                        return;
                    }
                }
                score+=verifierReponseTF(question.result[0][0], reponseTF);
                break;
            case "Matching":
                // affichage du titre de la question
                console.log(question.result[0][0]?.title);
                nbQuestions++;
                // affichage des questions de gauche
                let lstQuestions = getQuestionMatching(question.result[0][0]?.matchPairs);
                // affichage des réponses de droite
                let lstReponses = getReponsesMatching(question.result[0][0]?.matchPairs);
                let dictionnaireQuestionReponse = {};
                let nbreQuestions = lstQuestions.length;
                for(let i = 0; i < nbreQuestions; i++){
                    // affichage des questions et des réponses
                    afficherMatchings(lstQuestions, lstReponses);
                    // récupération des index des questions et des réponses
                    let questionMatching = prompt("veuillez entrer l'index de votre question de gauche : ");
                    if (questionMatching==='exit') {
                        console.log('Simulation interrompue'.blue);
                        exit = true;
                        return;
                    }
                    while(questionMatching < 0 || questionMatching >= lstQuestions.length || reponse !== 'exit'){
                        questionMatching = prompt("veuillez entrer l'index de votre question de gauche : ");
                        if (questionMatching==='exit') {
                            console.log('Simulation interrompue'.blue);
                            exit = true;
                            return;
                        }
                    }
                    let reponseMatching = prompt("veuillez entrer l'index de votre question de droite : ");
                    if (reponseMatching==='exit') {
                        console.log('Simulation interrompue'.blue);
                        exit = true;
                        return;
                    }
                    while(reponseMatching < 0 || reponseMatching >= lstReponses.length || reponse !== 'exit'){
                        reponseMatching = prompt("veuillez entrer l'index de votre question de droite : ");
                        if (reponseMatching==='exit') {
                            console.log('Simulation interrompue'.blue);
                            exit = true;
                            return
                        }
                    }

                    // ajout de la question et de la réponse dans le dictionnaire
                    dictionnaireQuestionReponse[lstQuestions[questionMatching]] = lstReponses[reponseMatching];
                    // suppression de la question et de la réponse dans les listes
                    lstQuestions[questionMatching] = null;
                    lstReponses[reponseMatching] = null;
                }
                //calcul du score
                score += verifierReponseMatching(question.result[0][0]?.matchPairs, dictionnaireQuestionReponse);
                break;
            case "Short":
                console.log(question.result[0][0]?.stem.text);
                nbQuestions++;
                let reponseShort = prompt("Votre réponse : ");
                while(reponseShort===""){
                    reponseShort = prompt("Votre réponse : ".red);
                }
                if (reponseShort==='exit') {
                    console.log('Simulation interrompue'.blue);
                    exit = true;
                    return;
                } else if(verifierReponseShort(question.result[0][0]?.choices, reponseShort)){score++;}
                console.log(score);

                break;
        }
    });
    if (exit === true) return;
    if (nbQuestions === 0) {
        console.log("Aucune question n'a été trouvée dans ce fichier.".red);
        console.log("Il semble que le fichier ne soit pas au bon format.".red);
        return;
    }


    // Check if the user object has a 'tests' property
    if (!user.hasOwnProperty('tests')) {
        user.tests = [];
    }

    //ajouter le score dans la liste d'examen avec le nom du fichier et le score
    let examen = {
        nomFichier : nomFichierTest,
        score : score,
        nbQuestions : nbQuestions
    }
    user.tests.push(examen);

    updateUser(user);



    //afficher le score
    console.log(("Votre score est de : " + score + "/" + nbQuestions).green);

}

let verifierReponseNumerical = (choices, reponseUtilisateur)=> {
    // Convertir la réponse utilisateur en nombre
    const reponseNumerique = parseFloat(reponseUtilisateur);
    // Vérifier si la réponse utilisateur est un nombre
    if (isNaN(reponseNumerique)) {
        return false;
    }
    // Vérifier chaque choix de la question
    for (const choix of choices) {
        // Vérifier si la réponse utilisateur est dans la plage spécifiée par le choix
        if (choix.isCorrect && verifierPlageNumerique(choix.text, reponseNumerique)) {
            return true;
        }
    }
    // Aucun choix n'a été trouvé correspondant à la réponse utilisateur
    return false;
}

let verifierPlageNumerique = (plage, reponseNumerique)=> {
    // Vérifier si la réponse utilisateur est dans la plage spécifiée
    const numeroPlage = parseFloat(plage.number);
    const demiPlage = parseFloat(plage.range) / 2;
    return reponseNumerique >= numeroPlage - demiPlage && reponseNumerique <= numeroPlage + demiPlage;
}

let verifierReponseTF = (question, reponse) =>{
    console.log(question.isTrue);
    if(String(question.isTrue).toLowerCase() === reponse.toLowerCase()){
        console.log(question.correctFeedback.text);
        return 1;
    }else{
        console.log(question.incorrectFeedback.text);
        return 0;
    }
}

let verifierReponseShort = (question, reponse) =>{
    let estCorrect = false;
    question.forEach(mot => {
        if(mot.text.text.toLowerCase() === reponse.toLowerCase()){
            console.log("Correct".green);
            estCorrect = true;
        }
    })
    return estCorrect;
}

/**
 * Permet de créer un tableau contenant les questions d'une question de type Matching
 * @param matchPairs : la liste des réponses d'une question de matching
 * @returns {*[]} : le tableau des questions
 */
let getQuestionMatching = (matchPairs) =>{
    let lstQuestion = [];
    matchPairs.forEach(matchPair => {
        lstQuestion.push(matchPair.subquestion.text);
    });
    return lstQuestion
}

/**
 * Permet de créer un tableau contenant les réponses d'une question de type Matching et de les mélanger
 * @param matchPairs : la liste des réponses d'une question de matching
 * @returns {*[]} : le tableau des réponses mélangées
 */
let getReponsesMatching = (matchPairs) =>{
    let lstReponses = [];
    matchPairs.forEach(matchPair => {
        lstReponses.push(matchPair.subanswer);
    });
    //melanger la liste
    lstReponses.sort(() => Math.random() - 0.5);
    return lstReponses
}

/**
 * Permet d'afficher les questions au format Matching
 * @param questions : le tableau des questions
 * @returns {string} : la chaine de caractère contenant les questions
 */
let afficherQuestionsMatching = (questions) =>{
    let res ="";
    for (i = 0; i < questions.length; i++) {
        if (questions[i]!==null)
            res += `${i} --> ${questions[i]}\n`;
    }
    return res;
}

/**
 * Permet d'afficher les réponses au format Matching
 * @param reponses : le tableau des réponses
 * @returns {string} : la chaine de caractère contenant les réponses
 */
let afficherReponsesMatching = (reponses) =>{
    let res ="";
    for (i = 0; i < reponses.length; i++) {
        if (reponses[i]!==null)
            res += `${i} --> ${reponses[i]}\n`;
    }
    return res;
}

/**
 * Permet d'afficher les questions et les réponses au format Matching
 * @param lstQuestions : le tableau des questions
 * @param lstReponses : le tableau des réponses
 */
let afficherMatchings = (lstQuestions, lstReponses) =>{
    console.log("Questions : ");
    console.log(afficherQuestionsMatching(lstQuestions));
    console.log("Reponses : ");
    console.log(afficherReponsesMatching(lstReponses));
}

/**
 * Permet de vérifier les réponses au format Matching
 * @param matchPairs : la liste des réponses d'une question de matching
 * @param dictionnaireQuestionReponse : le dictionnaire contenant les questions et les réponses
 * @returns {number} : le score
 */
let verifierReponseMatching = (matchPairs, dictionnaireQuestionReponse) =>{
    let score = 0;
    matchPairs.forEach(matchPair => {
        if(matchPair.subanswer === dictionnaireQuestionReponse[matchPair.subquestion.text]){
            score++;
        }
    });
    return score;
}

/**
 * Permet d'afficher les réponses d'une question de type MC
 * @param reponses : la liste des réponses
 */
let afficherReponses = (reponses) =>{
    for (i = 0; i < reponses.length; i++) {
        console.log(`${i+1} : ${reponses[i].text.text}`);
    }
}

module.exports = {chargerExamen};
