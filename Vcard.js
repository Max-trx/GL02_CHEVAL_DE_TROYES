var prompt = require('prompt-sync')();
var fs = require('fs');
var colors = require('colors');
var path = require('path');

function createVCard() {
    let myvCard = {
        firstName: "",
        lastName: "",
        email: "",
        cellPhone: "",
        title: "",
    };

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


    //set properties
    myvCard.firstName = prompt('Prénom : ');
    while (!/^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/.test(myvCard.firstName)) {
        myvCard.firstName = prompt('Veuillez entrer un prénom valide. Seules les lettres sont acceptées. '.red);
    }
    myvCard.lastName = prompt('Nom : ');
    while (!/^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/.test(myvCard.lastName)) {
        myvCard.lastName = prompt('Veuillez entrer un nom valide. Seules les lettres sont acceptées. '.red);
    }
    myvCard.email = prompt('Email : ');
    while (!/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(myvCard.email)) {
        myvCard.email = prompt('Veuillez entrer un email valide. '.red);
    }
    myvCard.cellPhone = prompt('Numéro de téléphone : ');
    while (!/^[0-9]{10}$/.test(myvCard.cellPhone)) {
        myvCard.cellPhone = prompt('Veuillez entrer un numéro de téléphone valide. '.red);
    }
    myvCard.title = prompt('Matière enseignée : ');
    while (!/^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/.test(myvCard.title)) {
        myvCard.title = "Professeur : " + prompt('Veuillez entrer un rôle valide. Seules les lettres sont acceptées. '.red);
    }

    //Vérifier que les informations sont correctes
    console.log('Prénom : '.green + myvCard.firstName.blue);
    console.log('Nom : '.green + myvCard.lastName.blue);
    console.log('Email : '.green + myvCard.email.blue);
    console.log('Numéro de téléphone : '.green + myvCard.cellPhone.blue);
    console.log('Matière enseignée : '.green + myvCard.title.blue);

    let correct = prompt('Les informations sont-elles correctes ? (O/N) : ');
    
    if (correct == 'N' || correct == 'n') {
        myvCard = {
            firstName: "",
            lastName: "",
            email: "",
            cellPhone: "",
            title: "",
        };
        createVCard();
    }
    else if (correct == 'O' || correct == 'o') {
        // Définir le chemin du dossier et du fichier
        var dirPath = path.join(__dirname, 'Contact');
        var filePath = path.join(dirPath, myvCard.lastName + '.vcf');

        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        // Écrire la vCard dans un fichier
        fs.writeFileSync(filePath, vCard());
        console.log('Le fichier à bien été créer dans le dossier contact.'.green);
    }
    else {
        console.log('Veuillez entrer O ou N : '.red);
    }


}

createVCard();