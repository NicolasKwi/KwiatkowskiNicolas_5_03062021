// stock les information du produit
let produitDonne = null;
const quantiteproduit = document.getElementById("quantite-produit");
//affiche un message ,typeMessClassNom represente une class pour la gestion de l'affichage
const affichageAlerte = (message, typeMessClassNom) => {
  const div = document.createElement("div");
  div.className = `alert alert-${typeMessClassNom} rounded`;
  div.appendChild(document.createTextNode(message));

  // const containerMain=document.getElementById('main-container')
  const insertApres = document.getElementById("img-nom-produit");
  insertApres.parentNode.insertBefore(div, insertApres.nextSibling);
  // suprime le neud (message) apres 3 secondes
  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 3000);
};

//compte les produit dans le panier et l'affiche
const comptePanier = () => {
  let temppanier = JSON.parse(localStorage.getItem("panier"));
  let tempComptePanier = 0;
  if (temppanier != null) tempComptePanier = temppanier.length;
  document.getElementById(
    "nbre-produits-panier"
  ).textContent = `(${tempComptePanier})`;
};

//test si le produit existe dans le painer, change le textcontent du boutton "ajouter et ouvrir panier" et ajoute "ajouté au panier"
const SiIdDejaDansPanier = (change) => {
  let temppanier = JSON.parse(localStorage.getItem("panier"));
  let ret = -1;
  if (temppanier != null)
    ret = temppanier.map((e) => e._id).indexOf(nom_camera.dataset.id_camera);
  if (ret > -1) {
    if (change == null) inputChoseLense.value = temppanier[ret].lense;
   
    if (document.getElementById("ajout-panier") == null) {
      let ajoutPanier = document.createElement("div");
      ajoutPanier.id = "ajout-panier";
      ajoutPanier.className = "text-success text-center";
      ajoutPanier.innerHTML =
        '<i class="fas fa-cart-arrow-down display-6"></i><p>Ajouté au panier</p>';
      document.getElementById("img-nom-produit").appendChild(ajoutPanier);
    }

    //si la lentille correspond a la lentille du panier
    if (
      inputChoseLense.value != temppanier[ret].lense ||
      quantiteproduit.value != temppanier[ret].quantity
    ) {
      btn_ajout_panier.style = "display:block";
      btn_ajout_panier.innerHTML = `<i class="fas fa-shopping-cart"></i> <i class="fas fa-sync-alt"></i> Modifier l'article`;
      btn_ajout_panier_ouvrir.innerHTML = `<i class="fas fa-shopping-cart"></i> <i class="fas fa-sync-alt"></i> Modifier et ouvrir le panier`;
    } else {
      btn_ajout_panier_ouvrir.innerHTML = `<i class="fas fa-shopping-cart"></i> Ouvrir le panier`;
      btn_ajout_panier.style = "display:none";
    }
  }
};

const ajoutProduitPanier = () => {
  if (inputChoseLense.value == "...") {
    affichageAlerte(
      "Veuillez choisir une lentille avant de l'ajouter au panier",
      "danger"
    );
    return false;
  }

  let temppanier = JSON.parse(localStorage.getItem("panier"));
  let indextab = -1;

  if (temppanier != null) {
    //recupere l'index
    indextab = temppanier
      .map((e) => e._id)
      .indexOf(nom_camera.dataset.id_camera);
    if (indextab == -1) {
      produitDonne.lense = inputChoseLense.value;
      produitDonne.quantity = quantiteproduit.value;
      temppanier.push(produitDonne);
    } else {
      temppanier[indextab].lense = inputChoseLense.value;
      temppanier[indextab].quantity = quantiteproduit.value;
      affichageAlerte("L'article a bien été modifié", "success");
    }
  } else {
    produitDonne.lense = inputChoseLense.value;
    produitDonne.quantity = quantiteproduit.value;
    temppanier = [produitDonne];
  }
  localStorage.setItem("panier", JSON.stringify(temppanier));
  return true;
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
  if (
    camera._id &&
    camera.name &&
    camera.imageUrl &&
    camera.price &&
    camera.lenses
  ) {
    const enteteProduit = document.getElementById("img-nom-produit");
    const choixLentille = document.getElementById("inputChoseLense");
    const prixProduit = document.getElementById("prix-produit");
    const descProduit = document.getElementById("desc_produit");

    produitDonne = {
      _id: camera._id,
      name: camera.name,
      lense: "",
      imageUrl: camera.imageUrl,
      price: camera.price,
      quantity: 1,
    };

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
    // quantité du produit
    // let tempQuantiteArticle = 1;
    // if (quantiteproduit.value) tempQuantiteArticle = quantiteproduit.value;

    // 3-prix du produit
    prixProduit.textContent = `Prix : ${(
      (camera.price) /
      100
    )
      .toString()
      .replace(".", ",")} €`;
    //4-description du produit
    descProduit.textContent = camera.description;
    //5-
    SiIdDejaDansPanier();
  }
};

//recupere le produit et affiche les données
const getProductByIdApi = async () => {
  await fetch("http://localhost:3000/api/cameras/" + getParameter_id())
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (data) {
      if (data) {
        afficheProduit(data);
      } else {
        throw "Le produit n'a pas pu etre récupéré";
      }
    })
    .catch(function (err) {
      // Une erreur est survenue
      alert(err);
    });
};
// controle de validité de quantité
const controleInputQuantite = (e) => {
  let valeurInput = 1;
  if (e.target.value && !isNaN(e.target.value)) {
    valeurInput = eval(e.target.value);
    let maxInput = eval(e.target.max);
    let minInput = eval(e.target.min);

    if (valeurInput < minInput) valeurInput = minInput;
    if (valeurInput > maxInput) valeurInput = maxInput;
  }
  return valeurInput;
};
btn_ajout_panier.addEventListener("click", () => {
  ajoutProduitPanier();
  SiIdDejaDansPanier();
  comptePanier();
});
btn_ajout_panier_ouvrir.addEventListener("click", () => {
  if (ajoutProduitPanier() == true)
    document.location.href = "../pages/panier.html";
});
quantiteproduit.addEventListener("change", (e) => {
  //prix du produit
  e.target.value = controleInputQuantite(e);

  document.getElementById("prix-produit").textContent = `Prix : ${(
    (produitDonne.price * controleInputQuantite(e)) /
    100
  )
    .toString()
    .replace(".", ",")} €`;
  SiIdDejaDansPanier(true);
});
quantiteproduit.addEventListener("keydown", (e) => {
  if (isNaN(e.key)) {
    if (e.key != "Backspace" && e.key != "Delete") {
      e.preventDefault();
    }
  } else {
    e.target.value += e.key;
    e.target.value = controleInputQuantite(e);
    document.getElementById("prix-produit").textContent = `Prix : ${(
      (produitDonne.price * e.target.value) /
      100
    )
      .toString()
      .replace(".", ",")} €`;
    e.preventDefault();
  }
  SiIdDejaDansPanier(true);
});

inputChoseLense.addEventListener("change", () => SiIdDejaDansPanier(true));

window.addEventListener("DOMContentLoaded", () => {
  // Une fois que la page est chargé, on recupère la liste des produits sur le serveur
  getProductByIdApi();
  comptePanier();
});
