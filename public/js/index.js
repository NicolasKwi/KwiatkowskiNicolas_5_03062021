//compte les produit dans le panier et l'affiche
const comptePanier = () => {
  let temppanier = JSON.parse(localStorage.getItem("panier"));
  let tempComptePanier = 0;
  if (temppanier != null) tempComptePanier = temppanier.length;
  document.getElementById("nbre-produits-panier").textContent = `(${tempComptePanier})`;
};
// recupere l'element où sera affiché les cards
const listProduit = document.getElementById("cont-list");

const getProductsApi = async () => {
 await fetch("http://localhost:3000/api/cameras")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (data) {
      // Ajoute un card pour chaques elements de data
      data.forEach((element) => {
        afficheListeCamera(element);
      });
    })
    .catch(function (err) {
      // Une erreur est survenue
      alert(err);
    });
};

const afficheListeCamera = (camera) => {
  if (camera != undefined) {
    // Ajoute la card du produit dans la liste des produits
    listProduit.innerHTML += `<a href="./pages/produit.html?_id=${camera._id}" class="card card-perso col-9 col-md-4 col-lg-3 m-2 shadow text-decoration-none text-dark">
                                <img src="${camera.imageUrl}" alt="Image de ${camera.name}" class="card-img-top" />
                                <div class="card-body">
                                  <h3 class="card-title text-center text-primary">${camera.name}</h3>                                 
                                  <h6 class="card-subtitle mb-2 text-muted">
                                    ${camera.lenses.length > 1 ? camera.lenses.length + " choix de lentilles" : "Lentille de " + camera.lenses[0]}
                                  </h6>
                                   <h5 class="card-title mb-3 text-black-50">
                                     Prix : ${(camera.price/100).toString().replace('.',',')} €
                                   </h5>
                                    <p class="card-text truncate-overflow mx-3">${camera.description}</p>                
                                </div>
                              </a>`;
  }
};
window.addEventListener("DOMContentLoaded", () => {
  // Une fois que la page est chargé, on recupère la liste des produits sur le serveur  
  getProductsApi();
  comptePanier();
});
