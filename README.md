# GL02_CHEVAL_DE_TROYES
# Générateur d'Examens CLI pour le Ministère de l'Éducation nationale de la République de Sealand

## Présentation

Bienvenue dans le projet de développement d'un générateur d'examens en ligne de commande, conçu pour moderniser les procédures de création et de gestion des examens scolaires du Ministère de l'Éducation nationale de la République de Sealand. Ce projet émerge de la volonté de numériser la pédagogie et l'apprentissage, avec pour objectif ultime l'amélioration de la qualité et de l'efficacité des évaluations pédagogiques au sein du système éducatif sealandais.

## Objectifs du Projet

1. **Création Facilitée d'Examens en Ligne :** L'outil en ligne de commande permet aux enseignants de créer facilement des examens et des questionnaires au format GIFT, simplifiant ainsi le processus de préparation des évaluations.

2. **Sélection dans une Banque de Données Certifiée :** Les enseignants peuvent choisir des questions à partir d'une banque de données certifiée, garantissant la qualité des questions incluses dans les examens.

3. **Visualisation des Questions :** Avant de finaliser l'examen, les enseignants ont la possibilité de visualiser les questions choisies pour s'assurer de leur pertinence.

4. **Simulation de Test :** L'outil propose une simulation de test pour évaluer la composition du questionnaire, garantissant ainsi que les performances et les connaissances attendues par l'enseignant sont bien représentées.

5. **Génération de Fichier Vcard :** Le logiciel peut générer un fichier d'identification et de contact au format Vcard pour chaque professeur, simplifiant ainsi la gestion des données.

## Utilisation

Pour utiliser l'outil en ligne de commande, suivez les étapes suivantes :

1. Clonez ce dépôt sur votre machine locale.
2. Ouvrez une console et accédez au répertoire du projet.
3. Exécutez l'application en utilisant la commande `node app.js` (ou la commande spécifique à votre configuration).
ATTENTION : Veillez à bien exécuter les installations npm nécessaires, telles que Jasmine pour les tests unitaires ou `npm install gift-parser-ide` pour le parser.
4. Suivez les instructions à l'écran pour créer et gérer des examens.

   ### Remarques :
     - Afin que tous les fichiers soient créés, corrigés ou analysés, merci de prévoir un court temps d'attente avant que ceux-ci ne soient correctement chargés.
     - La fonctionnalité de passage d'examen a été initialement conçue uniquement pour les professeurs, comme le spécifie le cahier des charges. Cependant, nous avons commencé à développer une fonctionnalité similaire pour le côté étudiant, que nous jugeons nécessaire pour la suite.

## Auteurs

* Florian Chaffard
* Clément Guinet
* Fantin Schmitt
* Rémy Kinzelin

# Révision

## Bug
   * Possibilité de l'arrêt de la simulation de test
   * Révision d'une boucle infinie lors de la création de VCard
   * Annulation lors de la création d'un test
   * Suppresion de mot clé dans la recherche
   * Fautes d'orthographes 
   
## Amélioration
   * Fonctionnalité des graphes non comprise pour un fichier
   * Graphes non foncitonnel lors de test avec un unique type de question
   * Affichage des graphes sans questions
   * Graphes plus jolis
   * Plus de sécurité pour le mot de passe
   * Possibilité d'enseigner plusieurs matières pour les professeur dans leur VCard

## Auteurs de la révision

* Maxime Trarieux
* Robin Nadal
* Thomas Chabannes 

