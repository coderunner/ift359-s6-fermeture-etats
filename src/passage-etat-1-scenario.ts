import { compte, retirer } from "./passage-etat-1.js";

// maFonction est une fonction nommée sans fermeture
function maFonction(nom: string) {
  return "Allô " + nom;
}

// (x) => x * 2 est une fonction lambda
[1, 2, 3].map((x) => x * 2);

function creerAdditionneur(x: number) {
  // plusX est une fonction nommée et une fermeture (autour de x)
  function plusX(c: number[]) {
    // (a) => a + x est une fonction lambda et une fermeture (autour de x)
    return c.map((a) => a + x);
  }
  return plusX;
}

let solde = 100;

function retrait(montant: number): number | "Fonds insuffisants" {
  if (solde < montant) {
    return "Fonds insuffisants";
  }
  solde -= montant;
  return solde;
}

const c0 = compte("c-001", 100);

// Étape 1 : retrait de 25
const [c1, res1] = retirer(c0, 25);
console.log(res1); // { succes: true, montantRetire: 25 }
console.log(c1.solde); // 75
console.log(c0.solde); // 100

// Étape 2 : retrait de 25 sur le nouvel état
const [c2, res2] = retirer(c1, 25);
console.log(c2.solde); // 50

// Étape 3 : retrait de 60 sur c2 (échec)
const [c3, res3] = retirer(c2, 60);
console.log(res3); // { succes: false, raison: 'Fonds insuffisants' }
console.log(c3.solde); // 50 (le solde n'a pas bougé)

// Étape 4 : retrait de 15 sur c3
const [c4, res4] = retirer(c3, 15);
console.log(c4.solde); // 35
