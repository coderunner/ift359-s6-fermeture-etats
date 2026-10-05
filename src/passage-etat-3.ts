export type CompteActif = {
  readonly statut: "actif";
  readonly id: string;
  readonly solde: number;
};

export type CompteBloque = {
  readonly statut: "bloque";
  readonly id: string;
  readonly solde: number;
  readonly note: string;
};

export type Compte = CompteActif | CompteBloque;

export type RaisonEchecRetrait = "Fonds insuffisants" | "Compte bloqué";
export type RaisonEchecDepot = "Compte bloqué";

export type ResultatRetrait =
  | { readonly succes: true; readonly montantRetire: number }
  | { readonly succes: false; readonly raison: "Fonds insuffisants" | "Compte bloqué" };

export type ResultatDepot =
  | { readonly succes: true; readonly montantDepose: number }
  | { readonly succes: false; readonly raison: "Compte bloqué" };

export type ResultatBlocage = { readonly succes: true; readonly note: string };

export type ResultatDeblocage = { readonly succes: true };

export function compte(id: string, soldeInitial: number): CompteActif {
  return { statut: "actif", id, solde: soldeInitial };
}

export function compteBloque(id: string, soldeInitial: number, note: string): CompteBloque {
  return { statut: "bloque", id, solde: soldeInitial, note: note };
}

export function id(c: Compte): string {
  return c.id;
}

export function solde(c: Compte): number {
  return c.solde;
}

export function note(c: CompteBloque): string {
  return c.note;
}

export function succesRetrait(montant: number): ResultatRetrait {
  return { succes: true, montantRetire: montant };
}

export function echecRetrait(raison: RaisonEchecRetrait): ResultatRetrait {
  return { succes: false, raison };
}

export function succesDepot(montant: number): ResultatDepot {
  return { succes: true, montantDepose: montant };
}

export function echecDepot(raison: RaisonEchecDepot): ResultatDepot {
  return { succes: false, raison };
}

export function succesBlocage(note: string): ResultatBlocage {
  return { succes: true, note };
}

export function succesDeblocage(): ResultatDeblocage {
  return { succes: true };
}

export function estActif(c: Compte): c is CompteActif {
  return c.statut === "actif";
}

export function estBloque(c: Compte): c is CompteBloque {
  return c.statut === "bloque";
}

export type OperationCompte<R> = (c: Compte) => readonly [Compte, R];

export function retirer(montant: number): OperationCompte<ResultatRetrait> {
  return (c: Compte) => {
    switch (c.statut) {
      case "bloque":
        return [c, echecRetrait("Compte bloqué")] as const;

      case "actif": {
        if (c.solde < montant) {
          return [c, echecRetrait("Fonds insuffisants")] as const;
        }
        const nouveau: CompteActif = {
          ...c,
          solde: c.solde - montant,
        };
        return [nouveau, succesRetrait(montant)] as const;
      }
    }
  };
}

export function deposer(montant: number): OperationCompte<ResultatDepot> {
  return (c: Compte) => {
    switch (c.statut) {
      case "bloque":
        return [c, echecDepot("Compte bloqué")] as const;

      case "actif": {
        const nouveauCompte: Compte = {
          ...c,
          solde: c.solde + montant,
        };
        return [nouveauCompte, succesDepot(montant)] as const;
      }
    }
  };
}

export function bloquerCompte(note: string): OperationCompte<ResultatBlocage> {
  return (c: Compte) => {
    switch (c.statut) {
      case "bloque":
        return [c, succesBlocage(c.note)] as const;

      case "actif": {
        return [compteBloque(c.id, c.solde, note), succesBlocage(note)] as const;
      }
    }
  };
}

export function debloquerCompte(): OperationCompte<ResultatDeblocage> {
  return (c: Compte) => {
    switch (c.statut) {
      case "bloque":
        return [compte(c.id, c.solde), succesDeblocage()] as const;

      case "actif": {
        return [c, succesDeblocage()] as const;
      }
    }
  };
}

export function executer<R1, R2>(
  op1: OperationCompte<R1>,
  // pour le chaînage, on veut que l'appelant puisse prendre une décision selon le résultat précédent
  creerOp2: (r1: R1) => OperationCompte<R2>,
): OperationCompte<R2> {
  return (compteInitial: Compte) => {
    // Exécuter la première opération
    const [compteIntermediaire, res1] = op1(compteInitial);
    // Détermine la deuxième action grâce au premier résultat
    const action2 = creerOp2(res1);
    // Injecte le compte intermédiaire pour la 2e opération
    return action2(compteIntermediaire);
  };
}
