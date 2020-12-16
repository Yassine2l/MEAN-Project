import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ProduitsService {


    constructor(private http: HttpClient) { }

    getProduits(): Observable<any> {
     
	console.log("Dans le service ProduitsService avec http://localhost:8888/produits");
        return this.http.get("http://localhost:8888/produits");
    }
   
    getCategories(): Observable<any> {
     
        console.log("Dans le service ProduitsService avec http://localhost:8888/categories");
            return this.http.get("http://localhost:8888/categories");
        }

        getProduitsParCategorie(categorie): Observable<any> {
            return this.http.get("http://localhost:8888/produits/"+categorie);
        }
}
