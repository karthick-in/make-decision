import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { NewquestionComponent } from './newquestion/newquestion.component';
import { QuestionviewComponent } from './questionview/questionview.component';


const routes: Routes = [
  {
    path : '' ,
    redirectTo: '/login',
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
    path : 'adminpanel',
    canActivate : [AuthGuard],
    component : AdminpanelComponent,
    /* children : [
      {
        path : 'newquestion',
        canActivate : [AuthGuard],
        component : NewquestionComponent

      }
    ] */
  },
  {
    path : 'adminpanel/newquestion',
    canActivate : [AuthGuard],
    component : NewquestionComponent
  },
  {
    path: 'questionview',
    component: QuestionviewComponent
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
