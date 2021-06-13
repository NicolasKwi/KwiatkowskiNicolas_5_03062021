export function comptePanier(idElement){
 let temppanier = JSON.parse(localStorage.getItem("panier"));
    let tempComptePanier = 0;
    if (temppanier != null) tempComptePanier = temppanier.length;
    document.getElementById(idElement).textContent = `(${tempComptePanier})`; 
}
