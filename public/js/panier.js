// stock le panier
let ListePanier = [];
let totalprix = 0;

let ListeProduitPanier = document.getElementById("liste-des-produits");

//recupere la liste du panier
const recupPanier = () => {
  let temppanier = JSON.parse(localStorage.getItem("panier"));
  if (temppanier != null) ListePanier = temppanier;
};
const supprProduitPanier = (id_Produit) => {
  if (id_Produit != null && id_Produit != "") {
    //met à jour le tableau ListePanier
    recupPanier();
    //cherche l'index et retire le produit
    let tempPanierIndex = ListePanier.map((e) => e._id).indexOf(id_Produit);
    if (tempPanierIndex > -1) ListePanier.splice(tempPanierIndex, 1);
    localStorage.setItem("panier", JSON.stringify(ListePanier));
    afficheCardsproduits();
  }
};

//carte d'un pruduit dans le panier
const cardProduit = (produit) => {
  let cardHtmlProd = `<div class="d-flex justify-content-start flex-wrap m-2 shadow bg-sm-primary bg-md-secondary bg-lg-success">
                        <div class="max-taille-panier d-flex m-2 align-self-center flex-grow-1">
                          <img src="${
                            produit.imageUrl
                          }" class="thumb-panier" alt="Photo de ${
    produit.name
  }"/>
                          <div class="d-flex flex-wrap flex-column justify-content-center mx-3">
                            <p class="fs-4 m-0 text-primary">${produit.name}</p>
                            <div class="d-flex flex-wrap">
                              <p class="fs-6 mx-1 my-0 text-muted">Lentille :</p>
                              <p class="fs-6 mx-1 my-0 text-muted">${
                                produit.lense
                              }</p>
                            </div>
                          </div>
                        </div>
                        <div class="d-flex justify-content-around align-items-center flex-wrap flex-grow-1">
                          <div class="flex-grow-1 d-flex">
                            <div class="border p-2 m-2">
                              <p class="fs-5 my-0 text-black-50">Prix : ${(
                                produit.price / 100
                              )
                                .toString()
                                .replace(".", ",")} €</p>
                              <p class="fs-6 my-0 text-black-50">Quantité : 1</p>
                            </div>
                          </div>
                          <div class="m-2">
                            <button class="btn btn-outline-info btn-lg m-3 shadow-sm" type="button" data-id_produit="${
                              produit._id
                            }">
                            <i class="fas fa-trash-alt" data-id_produit="${
                              produit._id
                            }"></i>
                            </button>
                          </div>
                        </div>
                      </div>`;
  return cardHtmlProd;
};

//Ajoute le prix et le nombre de produit en fin de liste des articles
const afficheTotalPorduit = () => {
  //recupere le panier en premier
  recupPanier();

  if (ListePanier != null) {
    if (ListePanier.length > 0) {
      ListeProduitPanier.innerHTML += `  <div class="d-flex justify-content-start flex-wrap mx-2 my-4 border bg-secondary bg-gradient text-white shadow">
                                          <div class="d-flex flex-wrap border m-3 p-2 shadow rounded-3">
                                              <p class="fs-5 mx-1 my-0 ">Quantité d'articles :</p>
                                              <p class="fs-5 mx-1 my-0">${
                                                ListePanier.length
                                              }</p>
                                          </div>
                                          <div class="flex-grow-1">

                                          </div>
                                          <div class="d-flex flex-wrap border m-3 p-2  bg-success bg-gradient shadow rounded-3">
                                          <p class="fs-4 mx-1 my-0 ">Prix total :</p>
                                          <p class="fs-4 mx-1 my-0 ">${(
                                            totalprix / 100
                                          )
                                            .toString()
                                            .replace(".", ",")} €</p>
                                         </div>
                                         <div class="flex-grow-1">

                                          </div>
                                       </div>`;
    }
  }
};
//Affiches les cards des articles du panier
const afficheCardsproduits = async () => {
  recupPanier();
  if (ListePanier.length > 0) {
    ListeProduitPanier.innerHTML = "";
    for (const element of ListePanier) {
      // let tempProduitApi = await getProductByIdApi(element._id);
      if (element != null) {
        ListeProduitPanier.innerHTML += cardProduit(element);
        totalprix += element.price;
      }
    }
    afficheTotalPorduit();
  } else {
    ListeProduitPanier.innerHTML =
      '<p class="text-muted"> Le panier est vide ... </p>';
    document.getElementById("conteneur-formulaire").style =
      "display: none !important;";
    document.getElementById("titre-fomulaire").style =
      "display: none !important;";
  }
};

//affiche un message ,typeMessClassNom represente une class pour la gestion de l'affichage
const affichageAlerteform = (message, typeMessClassNom, inputCible) => {
  let divAlerte = document.getElementById(`alert_${inputCible.id}`);
  //si l'alerte n'existe pas deja
  if (divAlerte == null) {
    const div = document.createElement("div");
    div.id = `alert_${inputCible.id}`;
    div.className = `alert alert-${typeMessClassNom} m-0 py-0 px-1`;
    div.appendChild(document.createTextNode(message));

    // ajoute le nouvelle element au parent
    inputCible.parentNode.appendChild(div);
    // suprime le neud (message) apres 3 secondes
    setTimeout(() => {
      div.remove();
    }, 3000);
  }
};
//validation du fomrulaire et affiche les erreurs ,revoi vrai si tout valide
const valideFormulaire = () => {
  let retValide = true;

  //test le nom
  if (
    testInput(/^[a-zA-ZàáâćèéêëėìíîïôùúûçÀÁÂ ,.'-]+$/, "Le nom", lastname) ==
    false
  )
    retValide = false;
  //test le prenom
  if (
    testInput(
      /^[a-zA-ZàáâćèéêëėìíîïôùúûçÀÁÂ ,.'-]+$/,
      "Le prénom",
      firstname
    ) == false
  )
    retValide = false;
  //test l'email
  if (
    testInput(
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      "L'e-mail",
      email
    ) == false
  )
    retValide = false;
  // test l'adresse
  if (
    testInput(
      /^[0-9a-zA-ZàáâćèéêëėìíîïôùúûçÀÁÂ ,.'-]+$/u,
      "L'adresse",
      address
    ) == false
  )
    retValide = false;
  // test ville
  if (
    testInput(/^[0-9a-zA-ZàáâćèéêëėìíîïôùúûçÀÁÂ ,.'-]+$/u, "La ville", city) ==
    false
  )
    retValide = false;
  return retValide;
};
//test validation standard d'un input
const testInput = (regexTest, nomChampCible, inputCible) => {
  if (inputCible.value.trim() == "") {
    affichageAlerteform(nomChampCible + " est vide", "danger", inputCible);
    return false;
  } else {
    if (!regexTest.test(inputCible.value)) {
      affichageAlerteform(
        nomChampCible + " n'est pas valide",
        "danger",
        inputCible
      );
      return false;
    }
  }
  return true;
};

window.addEventListener("DOMContentLoaded", () => {
  // Une fois que la page est chargé, on recupère la liste des produits sur le serveur
  afficheCardsproduits();
//va chercher et met les valeurs contact dans le localstorage
  let tempContact = JSON.parse(localStorage.getItem("contact"));  
  if (tempContact != null) {
    console.log(tempContact);
    firstname.value = tempContact.firstName;
    lastname.value = tempContact.lastName;
    address.value = tempContact.address;
    city.value = tempContact.city;
    email.value = tempContact.email;
  }
});
window.addEventListener("click", (event) => {
  if (event.target.dataset.id_produit != null) {
    supprProduitPanier(event.target.dataset.id_produit);
  }
});
btn_valide_commande.addEventListener("click", () => {
  if (valideFormulaire()) {
    //si les info sont ok alors on enregistre dans le localstorage
    let contact = {
      firstName: firstname.value,
      lastName: lastname.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    localStorage.setItem("contact", JSON.stringify(contact));
    //lance la page commande
    document.location.href = "../pages/commande.html";
  }
});
