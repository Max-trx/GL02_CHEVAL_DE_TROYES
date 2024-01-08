const prompt = require("prompt-sync")();
const vCard = require("./Vcard.js");
const {parser} = require("./giftParser.js");
const selectQ = require("./selectionQuestions.js")
const examen = require("./testExamen.js");
const searchQ = require("./searchQuestions.js");
const colors = require('colors');
const graphique = require("./graphique.js");

// Fonction qui affiche le menu d'accueil
let accueil = async (user) => {
    parser();


    // Vérifier le type d'utilisateur
    if (user.type === "etudiant") {
        // Afficher le menu
        console.log("1. Passer un test");
        console.log("2. Se déconnecter");
        // Demander le choix
        let choice = prompt("Votre Choix : ");
        // Vérifier le choix
        switch (choice) {
            case "1":
                // On lance la fonction pour passer un test
                console.log("Passage de test pour un étudiant");
                console.log("fonctionnalité non implémentée pour le moment".red);
                console("Fonctionnalité non présente dans le cahier des charges".red);
                accueil(user);
                break;
            case "2":
                // On se déconnecte
                break;
            default:
                // On affiche une erreur et on relance la fonction d'accueil
                console.log("Wrong choice".red);
                accueil(user);
                break;
        }

    }
    else if (user.type === "professeur") {
        console.log("=====================================");
        // Afficher le menu
        console.log("1. Créer un QCM");
        console.log("2. Créer une vCard");
        console.log("3. Simulation du passsage d'un test");
        console.log("4. Rechercher des questions")
        console.log("5. Générer un graphique d'examen");
        console.log("6. Se déconnecter");

        // Demander le choix
        let choice = prompt("Votre choix : ");
        // Vérifier le choix
        switch (choice) {
            case "1":
                // On lance la fonction pour créer un QCM
                await selectQ.fileGestion()
                accueil(user);
                break;
            case "2":
                // On lance la fonction pour créer une vCard
                vCard.createVCard();
                accueil(user);
                break;
            case "3":
                // On lance la fonction pour le passage d'un test
                examen.chargerExamen(user);
                accueil(user);
                break;
            case "4":
                // On lance la fonction pour rechercher des questions
                searchQ.searchQuestions();
                accueil(user);
                break;
            case "5":
                await graphique.demanderGenerationGraphique();
                accueil(user);
                break;

            case "6":
                // On se déconnecte
                console.log("Bye bye".blue);
                break;
            default:
                // On affiche une erreur et on relance la fonction d'accueil
                console.log("Wrong choice".red);
                accueil(user);
                break;
        }
    }
}


// Export de la fonction pour pouvoir l'appeler dans un autre fichier
module.exports = {accueil} ; 