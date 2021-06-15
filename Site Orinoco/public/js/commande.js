//objet global qui stock la commande à envoyer
let commande = null;
let ListePanier = [];
//recupere dans le localstorage l'objet contact et produits du panier
const recupCommande = () => {
  //stock le panier et l'objet contact
  let contact = null;

  let temppanier = Utils.getLocalStore("panier");
  if (temppanier != null) ListePanier = temppanier;

  let tempcontact = JSON.parse(localStorage.getItem("contact"));
  if (tempcontact != null) contact = tempcontact;

  if (ListePanier.length > 0 && contact != null) {
    //recup dans un tableau la liste des _id des produits
    let tempListePanier = ListePanier.map((x) => x._id);

    //recupere la commande dans le bon format
    commande = { contact: contact, products: tempListePanier };
    return true;
  } else {
    //   si pas bon , on met la commande a null par securité
    commande = null;
    return false;
  }
};
//recupere qunatity dans le panier
const recupQuantiteProduit = (id) => {
  for (const prod of ListePanier) {
    if (prod._id == id) return parseInt(prod.quantity);
  }
  return 1;
};
//Reception des donnée de la reponse du serveur (si de la status reponse = ok)
const traitementReponseOk = (data) => {
  if (data || data.contact || data.products || data.orderId) {
    //affichage dans la page
    document.getElementById("status-commande").innerHTML =
      '<i class="fas fa-check"></i> Valider';
    //
    document.getElementById(
      "details-entete"
    ).innerHTML = `Votre commande a été enregistré avec succès sous la référence
      : <br/><span class="text-primary mx-2">${data.orderId}</span>`;
    // details de la commande (articles) ajout des lignes dans le tableau
    const tbodyDetails = document.getElementById("tbody-details");
    let totalArticles = 0;
    for (const product of data.products) {
      let nbrProduit = recupQuantiteProduit(product._id);
      totalArticles += product.price * nbrProduit;
      tbodyDetails.innerHTML += `<tr>
                                  <td>
                                    <div class="d-flex flex-wrap">
                                      <img src="${product.imageUrl}"
                                        class="thumb-commande"
                                        alt=""/>
                                          <div class="d-flex flex-nowrap align-items-center text-nowrap mx-3 mt-2">
                                            <p class="text-primary fs-4 my-0">${
                                              product.name
                                            }</p>
                                            <p class="text-muted fs-5 mx-1 my-0">x ${nbrProduit}</p>
                                          </div>
                                      </div>
                                    </td>
                                  <td class="align-middle text-center text-nowrap text-black-50 px-3 fs-5">${(
                                    (product.price * nbrProduit) / 100
                                  )
                                    .toString()
                                    .replace(".", ",")} €</td>
                              </tr>`;
    }
    document.getElementById("total-details").textContent = `${(
      totalArticles / 100
    )
      .toString()
      .replace(".", ",")} €`;
    //comme tout s'est bien passé on supprime le panier du local storage
    localStorage.removeItem("panier");
  }
};
// Traitement d'une mauvaise reponse du serveur
const traitementReponseMauvaise = (erreur, panier) => {
  //affichage dans la page
  console.log(erreur);
  const statCommande = document.getElementById("status-commande");
  statCommande.innerHTML = '<i class="fas fa-times-circle"></i> Echec';
  statCommande.classList.replace("bg-success", "bg-danger");
  //
  document
    .getElementById("reponse-details")
    .classList.replace("reponse-details-ok", "reponse-details-erreur");
  //
  document.getElementById("details-entete").innerHTML = `${
    panier ? "" : "Votre commande n'a pas été valider : "
  }
  <br/><span class="text-danger">${erreur}</span>`;
  //
  document.getElementById("details-corps").innerHTML =
    'Nous sommes désolés pour la gêne occasionné. Veuillez réessayer plus tard ou si le problème persiste vous pouvez nous  <a class="text-decoration-none" href="mailto:camera@orinoco.com">contacter</a >';
  // supprime les details de la commande
  document.getElementById("detail-commande").remove();
};

//envoie la commande au serveur, order represente un objet contact avec un tableau d'id de produits
const postCommande = (order) => {
  fetch("http://localhost:3000/api/cameras/order", {
    method: "POST",
    body: JSON.stringify(order),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then(function (res) {
      if (res.ok) {
        return res.json();
      } else {
        throw "Erreur " + res.status + " : " + res.statusText;
      }
    })
    .then(function (data) {
      if (data) {
        traitementReponseOk(data);
      } else {
        throw "Les données de la commande n'ont pas pu etre récupéré";
      }
    })
    .catch(function (err) {
      // Une erreur est survenue
      traitementReponseMauvaise(err);
    });
};

//
function validationCommande() {
  //cree l'objet commande a partir du local storage et lance le post, sinon affiche une erreur
  recupCommande()
    ? postCommande(commande)
    : traitementReponseMauvaise(
        "Les données enregistrés de votre panier n'ont pas pu être récupéré",
        true
      );
}
window.addEventListener("DOMContentLoaded", () => {
  // Une fois que la page est chargé
  validationCommande();
});
