import { bloquerCompte, compte, deposer, retirer } from "./passage-etat-2.js";

const c0 = compte("c-101", 100);

// Scénario : déposer 50, tenter de retirer 20, bloquer le compte, tenter de retirer 10
const [c1, r1] = deposer(c0, 50);
const [c2, r2] = retirer(c1, 20);
const [c3, r3] = bloquerCompte(c2, "Suspicion de fraude");
const [c4, r4] = retirer(c3, 10);

console.log(JSON.stringify(r4)); // {"succes":false,"raison":"Compte bloqué"}
console.log(JSON.stringify(c4)); // {"statut":"bloque","id":"c-101","solde":130,"note":"Suspicion de fraude"}
