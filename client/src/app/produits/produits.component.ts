import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProduitsService } from '../produits.service';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {

    private user: BehaviorSubject<string>;
    public produits: any[] = []
    public filterPrix =0; 
    public filterNom =0;  
    public filterMarque =0;  
    public page = 1;
    public recherche:string;
    constructor(private route: ActivatedRoute,
                private authService: AuthentificationService,
                private produitsService: ProduitsService) {
      this.user = this.authService.getUser();
    }
    
    ngOnInit() {
      this.route.params.subscribe((params :Params) => {
          if (params["categorie"] !== undefined) {
              this.produitsService.getProduitsParCategorie(params["categorie"]).subscribe(produits => {
                  this.produits = produits;
	      });                     
          }
          else {
             this.produitsService.getProduits().subscribe(produits => {
                  this.produits = produits;

	     });
	  }
      });
    }
    showDescription(produit){
      
      let Description:string=produit.description;

      Swal.fire({
        title: produit.nom,
        text:Description,
        
      })

    }
    showDetails(produit){
      let html:string="";
      if(produit.type=="Pc"){
        html="<div class='container'><p>Processeur :"+produit.fiche.Processeur+"</p> <p>Ram :"+produit.fiche.RAM+"</p> <p>Disque :"+produit.fiche.disque+"</p> <p>Ecan :"+produit.fiche.Ecran+"</p> <p>Carte graphique :"+produit.fiche.cg+"</p> <p>Lecteur :"+produit.fiche.lecteur+"</p> <p> Systeme d'exploitation"+produit.fiche.se+"</p> <p> Batterie :"+produit.fiche.Batterie+"</p> <p>Ports :"+produit.fiche.Ports+"</p> <p>Couleur :"+produit.fiche.Couleur+"</p> <p>Poids :"+produit.fiche.Poids+"</p> <p>Etat :"+produit.fiche.Etat+"</p></div>"
        Swal.fire({
          imageUrl: produit.img2,
          imageWidth: 400,
          imageHeight: 200,
          title: produit.nom,
          html:html
        })
      }else if(produit.type=="Telephone"){
        html="<div class='container'><p>Ecan :"+produit.fiche.Ecran+"</p> <p>Type :"+produit.fiche.Type+"</p> <p>Camera :"+produit.fiche.Selfie+"</p> <p>Os :"+produit.fiche.OS+"</p> <p>Ram :"+produit.fiche.RAM+"</p> <p>Rom :"+produit.fiche.ROM+"</p></div>"
        Swal.fire({
          imageUrl: produit.img2,
          title: produit.nom,
          html:html
        })
      }else if(produit.type=="Tablet"){
        html="<div class='container'><p>Ecan :"+produit.fiche.Ecran+"</p> <p>Type :"+produit.fiche.Type+"</p> <p>Camera :"+produit.fiche.Selfie+"</p> <p>Os :"+produit.fiche.OS+"</p> <p>Ram :"+produit.fiche.RAM+"</p> <p>Rom :"+produit.fiche.ROM+"</p> <p>Sim :"+produit.fiche.Sim+"</p></div>"
        Swal.fire({
          imageUrl: produit.img2,
          imageWidth: 400,
          imageHeight: 200,
          title: produit.nom,
          html:html
        })
      }
      
      

    }
    add(nom, type,prix,marque,img){
      this.authService.addToCart({
            "id": this.user.getValue(),
            "nom": nom,
            "type": type,
            "prix": prix,
            "marque": marque,
            "img": img
 
      }).subscribe(data =>{
        console.log("DATA : " + JSON.stringify(data));
        console.log(data);

        });
    }
    search(){
     if(this.recherche != "" && this.filterPrix==1){
      this.produits= this.produits.filter(res => {
        return (res.prix+"").match(this.recherche.toLowerCase())
      })
     }else if(this.recherche != "" && this.filterNom==1){
      this.produits= this.produits.filter(res => {
        return (res.nom+"").toLocaleLowerCase().match(this.recherche.toLowerCase())
      })
     }else if(this.recherche != "" && this.filterMarque==1){
      this.produits= this.produits.filter(res => {
        return (res.marque+"").toLocaleLowerCase().match(this.recherche.toLowerCase())
      })
     }else{
       this.ngOnInit()
     }
    
    }
    filterbyPrix(){
      this.filterMarque=0;
      this.filterNom=0;
      this.filterPrix=1;
    }
    filterbyNom(){
      this.filterMarque=0;
      this.filterPrix=0;
      this.filterNom=1;
    }
    filterbyMarque(){
      this.filterMarque=1;
      this.filterNom=0;
      this.filterPrix=0;
    }
    filterbyAll(){
      this.filterMarque=0;
      this.filterNom=0;
      this.filterPrix=0;
    }
  
}
