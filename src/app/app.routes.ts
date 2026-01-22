import { Routes } from '@angular/router';
import { loginGuard } from './guards/login-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: 'homepage',
        loadComponent: () => import('./pages/home-page/home-page').then(x => x.HomePage),
        canActivate: [authGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register').then(x => x.Register),
        canActivate: [loginGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(x => x.Login),
        canActivate: [loginGuard]
    },
    {
        path: 'forget',
        loadComponent: () => import('./components/forget-password/forget-password').then(x => x.ForgetPassword),
        canActivate: [loginGuard]
    },
    {
        path: 'createEditShop',
        loadComponent: () => import('./pages/create-edit-shop/create-edit-shop').then(x => x.CreateEditShop),
        canActivate: [authGuard]
    },
    {
        path: 'createupdateitem',
        loadComponent: () => import('./pages/create-update-item/create-update-item').then(x => x.CreateUpdateItem),
        canActivate: [authGuard]
    },
    {
        path: 'createupdateitem/:id',
        loadComponent: () => import('./pages/create-update-item/create-update-item').then(x => x.CreateUpdateItem),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo:'homepage',
        pathMatch:'full'
    },

];
