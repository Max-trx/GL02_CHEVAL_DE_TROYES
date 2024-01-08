const vegalite = require("vega-lite");
const vg = require("vega");
const path = require("path");
const fs = require("fs");
const folderPath = "../files/";
const prompt = require("prompt-sync")();

function affichageDossier() {
    const files = fs.readdirSync(folderPath);
    let compteur = 1;

    for (const file of files) {
        const parsedPath = path.parse(file);
        console.log("\n" + compteur + " - " + parsedPath.name + parsedPath.ext);
        compteur++;
    }
}

let demanderGenerationGraphique = async () => {
    let jsonExamen;
    affichageDossier();
    const files = fs.readdirSync("../jsonResult");

    let choix = prompt("Votre choix : ");
    while (choix < 0 || choix > files.length || isNaN(choix)) {
        choix = prompt("Votre choix : ");
    }

    // affichage du nom de fichier choisi
    let file = files[choix - 1];
    console.log(file);

    // Charger le fichier JSON
    let data = fs.readFileSync(`../jsonResult/${file}`, "utf8");
    jsonExamen = JSON.parse(data);
    fileNameGift = file;

    await genererGraphique(jsonExamen, fileNameGift)

  }

let genererGraphique = async (jsonExamen, fileNameGift) => {
    //compter combien de questions de chaque type
    let nbQuestionType = [];
    jsonExamen.forEach((question) => {

        if (question.result[0]) {
            if (nbQuestionType.some(e => e.name === question.result[0][0].type)) {
                nbQuestionType.forEach((element) => {
                    if (element.name === question.result[0][0].type) {
                        element.nbQuestion++;
                    }
                });
            } else {
                nbQuestionType.push({ name: question.result[0][0].type, nbQuestion: 1 });
            }
        } else {
            if (nbQuestionType.some(e => e.name === "null")) {
                nbQuestionType.forEach((element) => {
                    if (element.name === "") {
                        element.nbQuestion++;
                    }
                });
            } else {
                nbQuestionType.push({ name: "null", nbQuestion: 1 });
            }
        }
    });

    if (jsonExamen.length === 0) {
        console.log("Aucune question n'a été ajoutée pour générer le graphe.".red);
        return;
    }else {
        let typesDeQuestionsDifferents = new Set();
        jsonExamen.forEach(question => {
            if(question.result[0] === null ){
                return;
            }
            const type = question.result[0][0]?.type;
            typesDeQuestionsDifferents.add(type);
        });

        if (typesDeQuestionsDifferents.size === 1) {
            console.log("Il n'y a qu'un seul type de question dans le test. L'histogramme ne sera pas généré.".yellow);
            console.log(`Le type unique de question est `, questions.type);
            console.log(`Il y en a `, questions.length);
            return;
        } else {
            var avgChart = {
                "width": 320,
                "height": 460,
                "data": {
                    "values": nbQuestionType
                },
                "mark": "bar",
                "title": "Répartition des types de questions de l'examen : " + fileNameGift,
                "encoding": {
                    "x": {
                        "field": "name", "type": "nominal",
                        "axis": {"title": "Types de questions"}
                    },
                    "y": {
                        "field": "nbQuestion", "type": "quantitative",
                        "axis": {"title": "Nombre de questions"}
                    },
                    "color": {
                        "field": "name",
                        "type": "nominal",
                        "scale": {
                            "range": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]
                        }
                    }
                },
                "legend": {
                    "title": "Légende",
                    "labelFontSize": 12,
                    "values": [
                        "MC: Choix Multiples",
                        "SHORT: Questions Courtes",
                        "TF: Question Vrai/Faux",
                        "NUM: Question à nombre"
                    ]
                }
            }

            const myChart = vegalite.compile(avgChart).spec;

            /* SVG version */
            var runtime = vg.parse(myChart);
            var view = new vg.View(runtime).renderer('svg').run();
            var mySvg = view.toSVG();

            try {
                var res = await mySvg;

                //créer le dossier pour le graphique
                // Définir le chemin du dossier et du fichier
                var dirPath = path.join(__dirname, '../charts');
                var chartPath = path.join(dirPath, fileNameGift + '.svg');

                // Créer le dossier s'il n'existe pas
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(chartPath, res)
                view.finalize();
                console.log("Chart output : ../charts/" + fileNameGift + ".svg");
            } catch (err) {
                console.error(("Error generating chart: ", err).red);
            }
        }
    }
}

module.exports = {demanderGenerationGraphique, genererGraphique}