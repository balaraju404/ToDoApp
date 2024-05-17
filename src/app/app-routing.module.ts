import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AuthComponent } from "./auth/auth.component";
import { ProfileComponent } from "./profile/profile.component";
import { RecycleBinComponent } from "./recycle-bin/recycle-bin.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'bin', component: RecycleBinComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'profile', component: ProfileComponent }
    // { path: '**', component: PageNotFoundComponent }
]
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}