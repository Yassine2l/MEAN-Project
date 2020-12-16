const express = require('express');
const app     = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(function (req, res, next) {
    res.setHeader('Content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

const MongoClient = require('mongodb').MongoClient;
const ObjectID    = require('mongodb').ObjectId;
const url         = "mongodb://localhost:27017";

MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
    let db = client.db("SUPERVENTES");
    
    /* Liste des produits */ 
    //web Service
    app.get("/produits", (req,res) => {
        try {
            db.collection("produits").find().toArray((err, documents) => {
                res.end(JSON.stringify(documents));
            });
        } catch(e) {
            res.end(JSON.stringify([]));
        }
    });

    /* Liste des produits suivant une catégorie */
    app.get("/produits/:categorie", (req,res) => {
	let categorie = req.params.categorie;
        console.log("/produits/"+categorie);
        try {
            db.collection("produits").find({type:categorie}).toArray((err, documents) => {
                res.end(JSON.stringify(documents));
            });
        } catch(e) {
            console.log("Erreur sur /produits/"+categorie+" : "+ e);
            res.end(JSON.stringify([]));
        }
    });

    
    /* Liste des catégories de produits */
    app.get("/categories", (req,res) => {
        console.log("/categories");
      categories = [];
      categoriesData=[];
        try {
            db.collection("produits").find().toArray((err, documents) => {
		    for (let doc of documents) {
         
                if (!categories.includes(doc.type)){
                  categories.push(doc.type);
                  categoriesData.push(doc)
                } 
        }
        
            res.end(JSON.stringify(categoriesData));
            });
        } catch(e) {
            console.log("Erreur sur /categories : " + e);
            res.end(JSON.stringify([]));
        }
    });
    app.get("/cart/:email",(req,res) => {
        let id = req.params.email; //email
        let cart =[];
        try{
            db.collection("panier").find().toArray((err, documents) => {
                for (let i =0;i<documents.length;i++) {
                  if(documents[i].cartId == id){
                    for(p of documents[i].products){
                        cart.push(p)
                    }
                       
                  }
                 
                }
                console.log("send" + " => "+ JSON.stringify(cart))
                res.end(JSON.stringify(cart));
                });
        }catch(e){
            res.end({"error":e});
        }
    })
    /* Connexion */
    app.post("/membre/connexion", (req,res) => {
        try {
            db.collection("membres")
            .find(req.body)
            .toArray((err, documents) => {
                if (documents != undefined && documents.length == 1)
                    res.end(JSON.stringify({"resultat": 1, "message": "Authentification réussie"}));
                else res.end(JSON.stringify({"resultat": 0, "message": "Email et/ou mot de passe incorrect"}));
            });
        } catch (e) {
            res.end(JSON.stringify({"resultat": 0, "message": e}));
        }
    });

    /* deconnexion */
    app.post("/disconnect", (req,res) => {
      try {
          db.collection("panier")
          .deleteOne({cartId: req.body.email},(err,r)=>{
            console.log("Diconnect")
          })
         
      } catch (e) {
          res.end(JSON.stringify({"resultat": 0, "message": e}));
      }
  });
    /** creation produit */
    app.post("/produits/ajout", (req,res) => {
        try {
            db.collection("produits").insertOne(req.body)
            res.end(JSON.stringify({"resultat": 1, "message": "On a réussi a insérer un produit !"}));
        } catch (e) {
            res.end(JSON.stringify({"resultat": 0, "message": e}));
        }
    });
 

    app.post("/register",(req,res)=>{
        
        let mail = req.body.email
        
       
        db.collection("membres").find({"email":mail}).toArray((err,r) => {
            console.log(r)
            if(r.length>0)
             res.end(JSON.stringify({"resultat": 0, "message": "Ce mail exist déja !"}));
           else  {
               try{
                db.collection("membres").insertOne(req.body)
                res.end(JSON.stringify({"resultat": 1, "message": "Vous etes bien enregiter !"}));
               }
         
        catch (e) {
            res.end(JSON.stringify({"resultat": 0, "message": e}));
        }
           } 
        })
       
        
   
    })
     
    app.post("/cart/add",(req,res)=>{
      
        let id = req.body.id;
        let type = req.body.type;
        let nom = req.body.nom;
        let prix = req.body.prix;
        let marque = req.body.marque;
        let img = req.body.img;
        let qt = 1;
        let Product = []
        try {
            db.collection("panier").find({
              cartId: id
            }).toArray((err, documents) => {
              
               Product = documents[0].products;
               let index =Product.findIndex(prod => prod.nom ===nom && prod.type ===type && prod.prix ===prix && prod.marque ===marque);
              if(index == -1){
              Product.push({
                nom: nom,
                type: type,
                prix: prix,
                marque: marque,
                img:img,
                qty:qt
              });
            }else{
              let qt = parseInt(documents[0].products[index].qty)
              documents[0].products[index].qty=""+(++qt)
              Product=documents[0].products
            }
             db.collection("panier").update({
              cartId: id
            }, {
              cartId: id,
              products: Product
            },{ "upsert": false });
             
            });
            
        }
    catch (e) {
        
        res.end(JSON.stringify({"resultat": 0, "message": e}));
    }
    })
      
    app.post("/cart/inc",(req,res)=>{
      
      let id = req.body.user
      let product = req.body.product
      let Prd = []
      try {
          db.collection("panier").find({
            cartId: id
          }).toArray((err, documents) => {
            
            Prd = documents[0].products;
            let index =Prd.findIndex(prod => prod.nom ===product.nom && prod.type ===product.type && prod.prix ===product.prix && prod.marque ===product.marque);
            let qt = parseInt(documents[0].products[index].qty)
            documents[0].products[index].qty=""+(++qt)
            Prd= documents[0].products
           db.collection("panier").update({
            cartId: id
          }, {
            cartId: id,
            products: Prd
  
          },{ "upsert": false });
          res.end(JSON.stringify(Prd))
          });
          
      }
  catch (e) {
      
      res.end(JSON.stringify({"resultat": 0, "message": e}));
  }
  })

  app.post("/cart/dec",(req,res)=>{
      
    let id = req.body.user
    let product = req.body.product
    let Prd = []
    try {
        db.collection("panier").find({
          cartId: id
        }).toArray((err, documents) => {
          
          Prd = documents[0].products;
          let index =Prd.findIndex(prod => prod.nom ===product.nom && prod.type ===product.type && prod.prix ===product.prix && prod.marque ===product.marque);
          let qt = parseInt(documents[0].products[index].qty)
          documents[0].products[index].qty=""+(--qt)
          Prd= documents[0].products
         db.collection("panier").update({
          cartId: id
        }, {
          cartId: id,
          products: Prd

        },{ "upsert": false });
        res.end(JSON.stringify(Prd))
        });
        
    }
catch (e) {
    
    res.end(JSON.stringify({"resultat": 0, "message": e}));
}
})
    app.get("/cart/create/:id",(req,res)=>{
        let id = req.params.id; //email
        let userProducts = [];
        try {
            db.collection("panier").find({
              cartId: id
            }).toArray((err, data) => {
              
              if (data.length==0) {
                db.collection("panier").insertOne({ //création du panier
                  cartId: id,
                  products: []
                });
              
              } else {
                userProducts = data[0].products;
              }
              res.end(JSON.stringify(userProducts));
      
            });
          } catch (e) {
            res.end(JSON.stringify({
              "error": e
            }));
        }
    
    
});


app.get("/cart/clean/:id",(req,res)=>{
    let id = req.params.id; //email
 
    try {
        db.collection("panier").update({"cartId":id},{"cartId":id,"products":[]},{ "upsert": false })
        res.end(JSON.stringify({
            "message": "Votre panier est vide !"
        }))
      } catch (e) {
        res.end(JSON.stringify({
          "error": e
        }));
    }


});

app.get("/countCommand/:id",(req,res)=>{
  let id = req.params.id; //email

  try {
      db.collection("panier").find({"cartId":id}).toArray((err,data)=>{
        let products = data[0].products
        if(products != "") res.end(JSON.stringify({"value":1}))
        res.end(JSON.stringify({"value":0}))
      })
    } catch (e) {
      res.end(JSON.stringify({
        "error": e
      }));
  }


});

app.post("/cart/delete/",(req,res)=>{
 
 let id = req.body.user
 let product = req.body.product
 let products = []
 try {
  db.collection("panier").find({
    cartId: id
  }).toArray((err, documents) => {
    
    products = documents[0].products;
    let index =products.findIndex(prod => prod.nom ===product.nom && prod.type ===product.type && prod.prix ===product.prix && prod.marque ===product.marque);
    if (index > -1) {
      products.splice(index, 1); //remove le produit avec l'index et faire update
    }
   db.collection("panier").update({
    cartId: id
  }, {
    cartId: id,
    products: products
  },{ "upsert": false });
  res.end(JSON.stringify(products))
  });
  
}
catch (e) {

res.end(JSON.stringify({"resultat": 0, "message": e}));
}

})



});

app.listen(8888);
