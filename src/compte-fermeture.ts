function l(o: any) {
  console.log(o);
}

type Operation = "depot" | "retrait" | "solde";
function creerCompteF(soldeInitial: number): (op: Operation, montant?: number) => number | "Fonds insuffisants" {
  let solde = soldeInitial;
  return (op: Operation, montant: number = 0) => {
    switch (op) {
      case "depot":
        solde += montant;
        return solde;
      case "retrait":
        if (solde < montant) {
          return "Fonds insuffisants";
        }
        solde -= montant;
        return solde;
      case "solde":
        return solde;
    }
  };
}

const compteA = creerCompteF(100);
l(compteA("retrait", 20)); // 80
l(compteA("depot", 10)); // 90
l(compteA("retrait", 100)); // Fonds insuffisants
l(compteA("solde")); // 90

interface Compte {
  depot(montant: number): number;
  retrait(montant: number): number | "Fonds insuffisants";
  solde(): number;
}

function creerCompte(soldeInitial: number): Compte {
  let solde = soldeInitial;
  return {
    depot(montant: number) {
      solde += montant;
      return solde;
    },
    retrait(montant: number) {
      if (solde < montant) {
        return "Fonds insuffisants";
      }
      solde -= montant;
      return solde;
    },
    solde() {
      return solde;
    },
  };
}

const compte = creerCompte(100);
l(compte.retrait(20)); // 80
l(compte.depot(10)); // 90
l(compte.retrait(111)); // Fonds insuffisants
l(compte.solde()); // 90
