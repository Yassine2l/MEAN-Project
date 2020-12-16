import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    "Access-Control-Allow-Methods": "GET,POST",	  
    "Access-Control-Allow-Headers": "Content-type",  
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private user:BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  private baseURL: string = "http://localhost:8888/";
 
  constructor(private http: HttpClient) { }

  getUser() {
      return this.user;
  }
  
  connect(data: string) {
      this.user.next(data);      
  }
     disconnect() {
      this.user.next(null);   
  }
  removeCart() {
    return this.http.post(this.baseURL+'disconnect', JSON.stringify({email :this.user.getValue()}), httpOptions);
 }

  verificationConnexion(identifiants): Observable<any> {
      return this.http.post(this.baseURL+'membre/connexion', JSON.stringify(identifiants), httpOptions);
  }

  register(identifiants): Observable<any> {
    return this.http.post(this.baseURL+'register', JSON.stringify(identifiants), httpOptions);
  }
  getCart(user): Observable<any>{
    return this.http.get<any[]>(this.baseURL+"cart/"+user);
  }
  createCart(identifiant): Observable<any>{
    return this.http.get<any[]>(this.baseURL+"cart/create/"+identifiant);
  }
  addToCart(identifiants): Observable<any>{
    return this.http.post<any []>(this.baseURL+"cart/add", JSON.stringify(identifiants), httpOptions);
  }
  viderCart(identifiant): Observable<any>{
    return this.http.get<any[]>(this.baseURL+"cart/clean/"+identifiant);
  }
  deleteFromCart(identifiants): Observable<any>{
    return this.http.post<any []>(this.baseURL+"cart/delete/",JSON.stringify(identifiants),httpOptions);

  }
  inc(identifiants): Observable<any>{
    return this.http.post<any []>(this.baseURL+"cart/inc/",JSON.stringify(identifiants),httpOptions);

  }
  dec(identifiants): Observable<any>{
    return this.http.post<any []>(this.baseURL+"cart/dec/",JSON.stringify(identifiants),httpOptions);

  }
  nbCommand(){
    return this.http.get< any []>(this.baseURL+"countCommand/"+this.user.getValue())
  }
}
