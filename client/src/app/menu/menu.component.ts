import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public user : BehaviorSubject<string>;
  public commands ;
  constructor(private authService : AuthentificationService
    , private router:Router) { 
      this.user=this.authService.getUser();
    }

  ngOnInit() {
    this.router.navigate(['/categories']);
  }
 
  deconnexion(){
    this.router.navigateByUrl("/cart")
    this.authService.nbCommand().subscribe((nbCommand)=>{
      if(nbCommand['value'] == 1){
        Swal.fire({
          text: "Do you want to save your cart ?",
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (!result.isConfirmed) {
            this.authService.removeCart().subscribe(res =>{
              console.log(res)
            })
            this.authService.disconnect()
            this.router.navigate(['/membres/connexion']);
          }else{
            this.authService.disconnect()
            this.router.navigate(['/membres/connexion']);
          }
        })
      }else{
        this.authService.disconnect()
            this.router.navigate(['/membres/connexion']);
      }
     
    })
   
  }

}
