import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';


export const routes: Routes = [
    {path:"",component:AuthLayoutComponent, canActivate:[loginGuard] ,children:[
        {path:"",redirectTo:"login",pathMatch:"full"},
        {path:"login", component:LoginComponent, title:"Login"},
        {path:"register", component:RegisterComponent, title:"Register"},
        {path:"forgot-password",component:ForgotPasswordComponent,title:"Forgot Password"}
    ]},
    {path:"",component:BlankLayoutComponent,canActivate:[authGuard],children:[
        {path:"",redirectTo:"home",pathMatch:"full"},
        {path:"home",component:HomeComponent, title:"Home"},
        {path:"cart",loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent), title:"Cart"},
        {path:"products",component:ProductsComponent, title:"Products"},
        {path:"categories",loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent), title:"Categories"},
        {path:"brands",loadComponent: () => import('./components/brands/brands.component').then(m => m.BrandsComponent), title:"Brands"},
        {path:"wishlist",loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent),title:"My Wishlist"},
        {path:"details/:id",component:ProductDetailsComponent, title:"Product Details"},
        {path:"allorders",loadComponent: () => import('./components/all-orders/all-orders.component').then(m => m.AllOrdersComponent), title:"Orders History"},
        {path:"order/:id",loadComponent: () => import('./components/order/order.component').then(m => m.OrderComponent),title:"Order"},
    ]},





    {path:"**",loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent), title:"Error-404"}
];
