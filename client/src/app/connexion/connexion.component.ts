import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent  {
  public utilisateur = {"email":"", "password":""};
  public cart =[];
  public formatMessage : string = "Email format should be like name@domaine.com !";
  public passMessage : string = "Password is required !";
  public emailMessage : string = "Email is required !";
  public valider=false;
  public ValideEmail = false;
  constructor(private authService: AuthentificationService,
    private router: Router) { }

    onSubmit() {
      this.valider = true;
      console.log(this.ValidEmail())
      if((this.utilisateur.email== "" || this.utilisateur.password == "") || !this.ValidEmail() ) {
        return;
      }
        this.authService.verificationConnexion(this.utilisateur).subscribe(reponse => {
        console.log(reponse['resultat'])
        if (reponse['resultat']) {
          //Ajout du panier
          this.authService.createCart(this.utilisateur.email).subscribe(data =>{
            
            for (let i = 0; i < data.length; i++) {
              this.cart.push(data[i].products)
            }
            
        });
        console.log(this.cart)
        this.authService.connect(this.utilisateur.email);
           
           this.router.navigate(['/categories']);
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: reponse['message']
          })
        }
      });
   
    }
    ValidEmail()
    {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+.[a-z]*$/;
    if(this.utilisateur.email.match(mailformat))
    {
    this.ValideEmail=true;
    return true;
    }
    else
    {
    this.ValideEmail=false;
    return false;
    }
    }
}
