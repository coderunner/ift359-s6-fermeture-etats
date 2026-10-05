import { bloquerCompte, Compte, compte, deposer, executer, OperationCompte, retirer } from "./passage-etat-3.js";

const deposer50 = deposer(50);
const retirer20 = retirer(20);
const bloquerFraude = bloquerCompte("Suspicion de fraude");
const retirer10 = retirer(10);

const c0 = compte("c-101", 100);

// Scénario : déposer 50, tenter de retirer 20, bloquer le compte, tenter de retirer 10
const [c1, r1] = deposer50(c0);
const [c2, r2] = retirer20(c1);
const [c3, r3] = bloquerFraude(c2);
const [c4, r4] = retirer10(c3);

console.log(JSON.stringify(r4)); // {"succes":false,"raison":"Compte bloqué"}
console.log(JSON.stringify(c4)); // {"statut":"bloque","id":"c-101","solde":130,"note":"Suspicion de fraude"}

const [c5, r5] = executer(deposer50, () => executer(retirer20, () => executer(bloquerFraude, () => retirer10)))(c0);

console.log(JSON.stringify(r5)); // {"succes":false,"raison":"Compte bloqué"}
console.log(JSON.stringify(c5)); // {"statut":"bloque","id":"c-101","solde":130,"note":"Suspicion de fraude"}

const [c6, r6] = [deposer50, retirer20, bloquerFraude, retirer10].reduce(
  (c: readonly [Compte, any], op: OperationCompte<any>) => op(c[0]),
  [c0, null] as const,
);

console.log(JSON.stringify(r6)); // {"succes":false,"raison":"Compte bloqué"}
console.log(JSON.stringify(c6)); // {"statut":"bloque","id":"c-101","solde":130,"note":"Suspicion de fraude"}
