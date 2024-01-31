// Charger les variables d'environnement à partir d'un fichier .env
require("dotenv").config();

// Importer le module mongoose pour la gestion de la base de données MongoDB
const mongoose = require("mongoose");

// Connecter à la base de données MongoDB en utilisant l'URI spécifié dans le fichier .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Afficher un message de succès après la connexion à MongoDB
    console.log(`MongoDB connectée depuis : ${mongoose.connection.host}`);

    // Définir le schéma pour une personne
    const PersonSchema = new mongoose.Schema({
      name: { type: String, required: true },
      age: Number,
      favoriteFoods: [String],
    });

    // Créer le modèle de personne à partir du schéma
    const PersonModel = mongoose.model("Person", PersonSchema);

    // Créer et sauvegarder un enregistrement avec le modèle
    const personne = new PersonModel({
      name: "Amad",
      age: 25,
      favoriteFoods: ["Burger", "Pizza"],
    });

    personne
      .save()
      .then((data) => {
        if (data === personne) console.log("Document inséré avec succès !");
      })
      .catch((err) => {
        console.error("Échec de l'insertion du document : " + err);
      });

    // Créer plusieurs enregistrements avec model.create()
    const tableauDePersonnes = [
      { name: "Abdou", age: 30, favoriteFoods: ["Tieb"] },
      { name: "Marcel", age: 32, favoriteFoods: ["sandwich", "pizza", "hamburger"] },
      { name: "Aliou", age: 45, favoriteFoods: ["Mafé", "Sauce gombo"] },
    ];

    PersonModel.create(tableauDePersonnes).then((resultat) => {
      console.log(resultat);
    });

    // Utiliser model.find() pour rechercher dans la base de données
    PersonModel.find({ name: "Marcel" })
      .then((docs) => {
        console.log("Résultat de find() :", docs);
      })
      .catch((err) => {
        console.log(err);
      });

    // Utiliser model.findOne()
    PersonModel.findOne({ favoriteFoods: "pizza" })
      .then((docs) => {
        console.log("Résultat de findOne() :", docs);
      })
      .catch((err) => {
        console.log(err);
      });

    // Utiliser model.findById()
    PersonModel.findById("65534ff98e09b7d0e653cc0f")
      .then((docs) => {
        console.log("Résultat de findById() :", docs);
      })
      .catch((err) => {
        console.log(err);
      });

    // Effectuer des mises à jour classiques en recherchant, éditant, puis sauvegardant
    PersonModel.findById("65ba2d9addd88d913e708548")
      .then((docs) => {
        // docs.favoriteFoods.push("hamburger");
        // docs.save();
        console.log("Personne mise à jour par recherche, édition, puis sauvegarde");
      })
      .catch((err) => {
        console.log(err);
      });

    // Mettre à jour un document en utilisant model.findOneAndUpdate()
    PersonModel.findOneAndUpdate(
      { name: "Aliou" },
      { $set: { age: 42 } },
      { new: true }
    )
      .then((docs) => {
        console.log("Personne mise à jour par findOneAndUpdate");
      })
      .catch((err) => {
        console.log(err);
      });

    // Utiliser model.findByIdAndRemove
    PersonModel.findByIdAndDelete("65534ff98e09b7d0e653cc0f")
      .then((docs) => {
        console.log("Personne supprimée");
      })
      .catch((err) => {
        console.log(err);
      });

    // Supprimer plusieurs documents avec model.remove()
    PersonModel.remove({ name: "Abdou" }).then((resultat) => {
      console.log(resultat);
    });

    // Enchaîner les assistants de requête de recherche pour affiner les résultats
    PersonModel.find({ favoriteFoods: "Pizza" })
      .sort('name')
      .limit(2)
      .select("-age")
      .then((donnees) => {
        console.log(donnees);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((error) => {
    // Afficher un message d'erreur si la connexion à MongoDB échoue
    console.error(error.message);
  });