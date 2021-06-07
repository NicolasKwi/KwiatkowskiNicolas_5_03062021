fetch('http://localhost:3000/api/cameras')
.then(function(res) {  
  if (res.ok) {   
    return res.json();
  }
})
.then(function(value) {
  console.log(value);
})
.catch(function(err) {
  // Une erreur est survenue
});