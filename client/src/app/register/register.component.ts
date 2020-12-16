import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public user = {"nom":"","prénom":"","email":"", "password":""};
  public emailMessage : string = "Email is required ! ";
  public formatMessage : string = "Email format should be like name@domaine.com !";
  public nomMessage : string = "Last Name is required ! ";
  public passMessage : string = "Password is required !  ";
  public prenomMessage : string = "Name is required ! ";
  public valider = false ;
  public ValideEmail=false;
  constructor(private authService: AuthentificationService,
    private router: Router) { }

    onSubmit() {
      this.valider = true;
      if(this.user.nom == "" || this.user.prénom == "" || (this.user.email == "" || !this.ValideEmail || this.user.password == "")) return;
      this.authService.register(this.user).subscribe(data =>{
     if(!data['resultat']){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data['message']
        })
     }
    else{
      Swal.fire({
        icon: 'success',
        text: data['message']
        })
      setTimeout(() => {
        this.router.navigate(['/membres/connexion']);
    }, 3000);
    }
      
    });
   
    }

    ValidEmail()
    {
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+.[a-z]*$/;
    if(this.user.email.match(mailformat))
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
