function appliquer(f: (a: number) => number, x: number): number {
  return f(x);
}

const r = appliquer((a) => a * a, 4);

// Fermeture
// const x = 5;
// const f = () => x * 2;
// equivalent à const f = => 5 * 2 => 10
// mais

let x = 5;
const f = () => x * 2;

console.log(f());

x = 10;

console.log(f());

const creerGenerateur = (base: number) => {
  return (pas: number) => {
    let compteur = 0;
    return () => {
      const r = base + pas * compteur;
      compteur++;
      return r;
    };
  };
};

const g = creerGenerateur(10);
const compteur1 = g(2); // base = 10, pas = 2, compteur = 0

console.log(compteur1()); // 10  (10 + 2 * 0, puis compteur devient 1)
console.log(compteur1()); // 12  (10 + 2 * 1, puis compteur devient 2)

const c2 = g(5); // base = 10, pas = 5, compteur = 0 (Nouvel environnement !)
console.log(c2()); // 10  (10 + 5 * 0)
console.log(c2()); // 15  (10 + 5 * 1)
