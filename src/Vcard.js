var prompt = require('prompt-sync')();
var fs = require('fs');
var colors = require('colors');
var path = require('path');

// Créer une vCard
function createVCard() {
    // Définir la vCard
    let myvCard = {
        firstName: "",
        lastName: "",
        email: "",
        cellPhone: "",
        title: [],
    };
    //Définir la fonction qui crée la vCard
    function vCard() {
        start = "BEGIN:VCARD\nVERSION:4.0\n";
        end = "END:VCARD";
        info = "";
        info += "N:" + myvCard.lastName + ";" + myvCard.firstName + ";;\n";
        info += "FN:" + myvCard.lastName + "\n";
        info += "EMAIL:" + myvCard.email + "\n";
        info += "TEL;TYPE=cell:" + myvCard.cellPhone + "\n";
        return start + info + end;
    }


    // Demander les informations
    myvCard.firstName = prompt('Prénom : ');
    while (!/^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/.test(myvCard.firstName)) {
        myvCard.firstName = prompt('Veuillez entrer un prénom valide. Seules les lettres sont acceptées. '.red);
    }
    myvCard.lastName = prompt('Nom : ');
    while (!/^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/.test(myvCard.lastName)) {
        myvCard.lastName = prompt('Veuillez entrer un nom valide. Seules les lettres sont acceptées. '.red);
    }
    myvCard.email = prompt('Email : ');
    myvCard.email = myvCard.email.toLowerCase();
    while (!/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(myvCard.email)) {
        myvCard.email = prompt('Veuillez entrer un email valide. '.red);
    }
    myvCard.cellPhone = prompt('Numéro de téléphone : ');
    while (!/^[0-9]{10}$/.test(myvCard.cellPhone)) {
        myvCard.cellPhone = prompt('Veuillez entrer un numéro de téléphone valide. '.red);
    }
    myvCard.title.push(prompt('Première matière enseignée : '));
    while (!/^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/.test(myvCard.title[0])) {
        myvCard.title[0] = prompt('Veuillez entrer un nom valide. Seules les lettres sont acceptées. '.red);
    }
    let temp = 0, index=1;
    while (temp == 0){
        temp = prompt("Enseigne-t-il d'autres matières ? (0-Oui / 1-Non)");
        if (temp == 0){
            myvCard.title[index] = prompt ('Autre matière enseignées :');
            while (!/^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/.test(myvCard.title[index])) {
                myvCard.title[index] = prompt('Veuillez entrer un nom valide. Seules les lettres sont acceptées. '.red);
            }
            index = index+1;   
        }
    }


    //Vérifier que les informations sont correctes
    console.log('Prénom : '.green + myvCard.firstName.blue);
    console.log('Nom : '.green + myvCard.lastName.blue);
    console.log('Email : '.green + myvCard.email.blue);
    console.log('Numéro de téléphone : '.green + myvCard.cellPhone.blue);
    myvCard.title.forEach(function (item) {
        console.log('Matière enseignée : '.green + item.blue);});
    let correct = prompt('Les informations sont-elles correctes ? (O/N) : ');
    
    // Demander si les informations sont correctes
    if (correct == 'N' || correct == 'n') {
        // Informations ne vont pas, on réinitialise la vCard, et on recommence la fonction
        myvCard = {
            firstName: "",
            lastName: "",
            email: "",
            cellPhone: "",
            title: [],
        };
        createVCard();
    }
    else if (correct == 'O' || correct == 'o') {
        // Informations sont corrects, on crée la vCard
        // Définir le chemin du dossier et du fichier
        var dirPath = path.join(__dirname, 'Contact');
        var filePath = path.join(dirPath, myvCard.lastName + '.vcf');

        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        // Écrire la vCard dans un fichier
        fs.writeFileSync(filePath, vCard());
        console.log('Le fichier a bien été créé dans le dossier contact.'.green);
    }
    else {
        console.log('Veuillez entrer O ou N : '.red);
    }


}

module.exports = {createVCard};
