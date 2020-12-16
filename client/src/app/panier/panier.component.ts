import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
 public cart= [];
 public user: BehaviorSubject<string>;
 private message : string;
 public total;
  constructor(private http:HttpClient,private auth: AuthentificationService , private route : ActivatedRoute) { 
   this.user=auth.getUser();
   }

  ngOnInit(): void {
   
    this.route.params.subscribe( (params:Params) =>{
      console.log(this.auth.getUser().getValue());
      this.auth.getCart(this.user.getValue()).subscribe(Ocart => { 
        this.cart = Ocart;
        this.getTotal()
    });
    

  }
    )  }
    cleanCart(){
      this.auth.viderCart(this.user.getValue()).subscribe(reponse =>{
        this.message = reponse['message'];
        this.cart = []
        this.total=0
            
    });
    }

    deleteProduct(product){
      let user = this.auth.getUser().getValue();
    this.auth.deleteFromCart({ user,product}).subscribe(newCart =>{
      
      this.cart=newCart;
      this.getTotal()
    })
    }
    inc(product){
      let user = this.auth.getUser().getValue();
      this.auth.inc({ user,product}).subscribe(newCart =>{
      
        this.cart=newCart;
        this.getTotal()
      })
    }
    dec(product){
      let user = this.auth.getUser().getValue();
      this.auth.dec({ user,product}).subscribe(newCart =>{
      
        this.cart=newCart;
        this.getTotal()
      })
    }
    getTotal(){
      let total =0;
      for(let c of this.cart){
        total += c.prix * c.qty
      }
      this.total=total
    }
}
