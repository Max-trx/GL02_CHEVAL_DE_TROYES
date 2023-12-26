
const colors = require('colors');
const pathFile = "../utils/users.json";
const fs = require("fs");
const { accueil } = require("./accueil");
const prompt = require("prompt-sync")();




let login = () => {
    console.log("Login : ");
    let username = prompt("Username : ");
    let password = prompt("Password : ");
    let jsonData = fs.readFileSync(pathFile, "utf8");
    let jsonContent = JSON.parse(jsonData);
    let user = jsonContent.users.find((user) => user.username === username && user.password === password);
    while (!user) {
        console.log("Wrong username or password".red);
        let choice = prompt("Voulez-vous réessayer ou vous inscrire ? (1) Réessayer | (2) S'inscrire | (3) Exit  : ".red)
        switch (choice) {
            case "1":
                console.log("Login : ");
                let username = prompt("Username : ");
                let password = prompt("Password : ");
                let jsonData = fs.readFileSync(pathFile, "utf8");
                let jsonContent = JSON.parse(jsonData);
                user = jsonContent.users.find((user) => user.username === username && user.password === password);
                break;
            case "2":
                register();
                break;
            case "3":
                console.log("Bye bye".blue);
                process.exit();
                break;
            default:
                console.log("Wrong choice".red);
                break;
        }
    }
    console.log("Welcome " + user.username);
    return user;
}

let register = () => {
    console.log("Register : ");
    let username = prompt("Username : ");
    let password = prompt("Password (min: 8 char, uppercase, lowercase, number, special char): ");
    const regexUpperCase = /[A-Z]/;
    const regexLowerCase = /[a-z]/;
    const regexNumber = /[0-9]/;
    const regexSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    while (password.length < 8 || !regexUpperCase.test(password) || !regexLowerCase.test(password) || !regexNumber.test(password) || !regexSpecialChar.test(password) {
        console.log("Password doesn't meet the requirements");
        password = prompt("Password (min: 8 char, uppercase, lowercase, number, special char): ");
    }
    console.log("Password is very secure!");
    let type = prompt("Type(etudiant|professeur) : ");
    while (type !== "etudiant" && type !== "professeur") {
        console.log("Wrong type");
        type = prompt("Type(etudiant|professeur) : ");
    }
    let jsonData = fs.readFileSync(pathFile, "utf8");
    let jsonContent = JSON.parse(jsonData);
    const users = jsonContent.users;
    let user = users.find((user) => user.username === username);
    if (user) {
        console.log("Username already taken");
        register();
    } else {
        jsonContent.users.push({ username: username, password: password, type: type, tests: [] });
        fs.writeFileSync(pathFile, JSON.stringify(jsonContent));
        console.log("User created");
        let user = login();
        accueil(user);
    }
}


module.exports = { login, register };

