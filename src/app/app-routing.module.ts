import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {
    path : '' ,
    redirectTo: '/register',
    pathMatch: "full"
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },  
  {
    path : 'home',
    canActivate : [AuthGuard],
    component : HomeComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
