import {
  bloquerCompte,
  compte,
  Compte,
  deposer,
  ResultatBlocage,
  ResultatDepot,
  ResultatRetrait,
  retirer,
} from "./passage-etat-3.js";
import { stateExecutor, StateExecutor } from "./state-executor.js";
import { andThen, flatMap, get, of, run, State } from "./state.js";

export const actionRetrait =
  (montant: number): State<Compte, ResultatRetrait> =>
  (c: Compte) =>
    retirer(montant)(c);

export const actionDepot =
  (montant: number): State<Compte, ResultatDepot> =>
  (c: Compte) =>
    deposer(montant)(c);

export const actionBloquer =
  (motif: string): State<Compte, ResultatBlocage> =>
  (c: Compte) =>
    bloquerCompte(motif)(c);

const compteInitial = compte("c-101", 100);

// Construction de la chaîne d’opération (aucune exécution pour le moment)
const scenario: State<Compte, string> = flatMap(actionDepot(50), (resDepot) =>
  flatMap(actionRetrait(20), (resRetrait) =>
    flatMap(actionBloquer("Suspicion de fraude"), () =>
      flatMap(actionRetrait(10), (dernierRetrait) =>
        of(`Opérations terminées. Dernier retrait réussi ? ${dernierRetrait.succes}`),
      ),
    ),
  ),
);

// On exécute les opérations avec run et un état initial
const [compteFinal, message] = run(scenario, compteInitial);
console.log(message);
console.log(compteFinal);

const scenario2: State<Compte, string> = andThen(actionDepot(50), (resDepot) =>
  andThen(actionRetrait(20), (resRetrait) =>
    andThen(actionBloquer("Suspicion de fraude"), () =>
      andThen(actionRetrait(10), (dernierRetrait) =>
        of(`Opérations terminées. Dernier retrait réussi ? ${dernierRetrait.succes}`),
      ),
    ),
  ),
);

const [compteFinal2, message2] = run(scenario2, compteInitial);
console.log(message2);
console.log(compteFinal2);

const scenario3: StateExecutor<Compte, string> = stateExecutor(actionDepot(50))
  .andThen(() => actionRetrait(20))
  .andThen(() => actionBloquer("Suspicion de fraude"))
  .andThen(() => actionRetrait(10))
  .andThen((dernierRetrait) => (etat: Compte) => {
    return [etat, `Opérations terminées. Dernier retrait réussi ? ${dernierRetrait.succes}. Solde final ${etat.solde}`];
  });

const [compteFinal3, message3] = scenario3.run(compteInitial);
console.log(message3);
console.log(compteFinal3);

const [compteFinal4, message4] = stateExecutor(actionDepot(50))
  .andThen(() => actionRetrait(200))
  .andThen((resRetrait: ResultatRetrait) => {
    if (resRetrait.succes) {
      return stateExecutor(actionRetrait(15)).andThen((secondRetrait) =>
        of(
          `Retrait initial réussi (${resRetrait.montantRetire} $). ` +
            `Second retrait réussi ? ${secondRetrait.succes}`,
        ),
      ).run;
    }
    const brancheEchec: StateExecutor<Compte, string> = stateExecutor(actionBloquer("Erreur lors du retrait"))
      .andThen((r) => get())
      .andThen((etat) =>
        of(
          `Retrait initial échoué (${resRetrait.raison}). Le compte a été verrouillé par précaution. Solde final : ${etat.solde}`,
        ),
      );

    return brancheEchec.run;
  })
  .run(compteInitial);
console.log(message4);
console.log(compteFinal4);
