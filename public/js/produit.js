//compte les produit dans le panier et l'affiche
const comptePanier = () => {
  let temppanier = JSON.parse(localStorage.getItem("panier"));
  let tempComptePanier = 0;
  if (temppanier != null) tempComptePanier = temppanier.length;
  document.getElementById(
    "nbre-produits-panier"
  ).textContent = `(${tempComptePanier})`;
};
//test si le produit existe dans le painer et change le textcontent du boutton "ajouter et ouvrir panier"
const modBouttonSiIdExiste = () => {
  let temppanier = JSON.parse(localStorage.getItem("panier"));
  let ret = -1;
  console.log(nom_camera.dataset.id_camera);
  if (temppanier != null)
    ret = temppanier.indexOf(nom_camera.dataset.id_camera);
  if (ret > -1){
      btn_ajout_panier_ouvrir.innerHTML = `<i class="fas fa-shopping-cart"></i> Ouvrir le panier`;
    btn_ajout_panier.remove();
    document.getElementById("img-nom-produit").innerHTML+='<div class="text-success text-center"><i class="fas fa-cart-arrow-down display-6"></i><p>Ajouté au panier</p></div>';
  }  
};

const ajoutProduitPanier = () => {
  let temppanier = JSON.parse(localStorage.getItem("panier"));
  if (temppanier != null) {
    if (temppanier.indexOf(nom_camera.dataset.id_camera) == -1) {
      temppanier.push(nom_camera.dataset.id_camera);
    }
  } else {
    temppanier = [nom_camera.dataset.id_camera];
  }
  localStorage.setItem("panier", JSON.stringify(temppanier));
};

//recupere l'id du produit dans l'argument de l'url de la page
function getParameter_id() {
  let search_params = new URLSearchParams(window.location.search);
  if (search_params.has("_id")) {
    return search_params.get("_id");
  }
}

// fonction principal pour afficher les informations du produit
const afficheProduit = (camera) => {
  const enteteProduit = document.getElementById("img-nom-produit");
  const choixLentille = document.getElementById("inputChoseLense");
  const prixProduit = document.getElementById("prix-produit");
  const descProduit = document.getElementById("desc_produit");

  //1-image et nom du produit
  enteteProduit.innerHTML = `<a class="lien-photo" href="${camera.imageUrl}"><img src="${camera.imageUrl}" alt="Photo de ${camera.name}" class="col-4 my-3 img-camera img-thumbnail">
                            </a><h1 id="nom_camera" data-id_camera="${camera._id}" class="col-8 text-center border-bottom my-3">${camera.name}</h1>`;

  //2-pour geré l'affichage des options de lentilles
  if (camera.lenses.length == 1) {
    choixLentille.setAttribute("disabled", "disabled");
    choixLentille.innerHTML = `<option selected>${camera.lenses[0]}</option>`;
  } else if (camera.lenses.length > 1) {
    choixLentille.innerHTML = "<option hidden selected>...</option>";
    camera.lenses.forEach((element) => {
      choixLentille.innerHTML += `<option>${element}</option>`;
    });
  } else {
    choixLentille.parentElement.remove();
  }
  // 3-prix du produit
  prixProduit.textContent = `Prix : ${(camera.price / 100)
    .toString()
    .replace(".", ",")} €`;
  //4-description du produit
  descProduit.textContent = camera.description;
  //5-
  modBouttonSiIdExiste();
};

//recupere le produit et affiche les données
const getProductByIdApi = async () => {
  fetch("http://localhost:3000/api/cameras/" + getParameter_id())
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (data) {
      afficheProduit(data);
    })
    .catch(function (err) {
      // Une erreur est survenue
      alert(err);
    });
};

btn_ajout_panier.addEventListener("click", () => {
  ajoutProduitPanier();
  modBouttonSiIdExiste()
  comptePanier();
});
btn_ajout_panier_ouvrir.addEventListener("click", () => {
  ajoutProduitPanier();
  document.location.href = "../index.html";
});

window.addEventListener("DOMContentLoaded", () => {
  // Une fois que la page est chargé, on recupère la liste des produits sur le serveur
  getProductByIdApi();
  comptePanier();
});
