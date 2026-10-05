const creerGenerateur = (base) => {
   return (pas) => {
       let compteur = 0;
       return () => {
           const r = base + pas * compteur;
           compteur++;
           return r;
       };
   };
}; debugger;
const g = creerGenerateur(10); debugger;
const f1 = g(2); debugger;
f1(); debugger;
f1(); debugger;
const f2 = g(5)
f2(); debugger;
