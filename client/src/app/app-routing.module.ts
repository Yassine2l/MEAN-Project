import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { PanierComponent } from './panier/panier.component';
import { ProduitsComponent } from './produits/produits.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path : 'produits',
    component:ProduitsComponent
  },
  {
    path : 'produits/:categorie',
    component:ProduitsComponent
  },
  {
    path : 'categories',
    component:CategoriesComponent
  },
 
  {
    path: 'cart/add/:nom/:marque',
    component: PanierComponent
  },
  {
    path:'membres/connexion',
    component: ConnexionComponent
  }  
  ,
  {
    path:'register',
    component: RegisterComponent
  } ,
  {
    path:'cart',
    component: PanierComponent
  },
  {
    path : 'cart/clean',
    component: PanierComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
