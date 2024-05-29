import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NewTodoComponent } from './home/new-todo/new-todo.component';
import { TodoComponent } from './home/todo/todo.component';
import { TodoService } from './home/todo/todo.service';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinComponent } from './loading-spin/loading-spin.component';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { ProfileComponent } from './profile/profile.component';
import { RecycleBinComponent } from './recycle-bin/recycle-bin.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { UpdateTodoComponent } from './update-todo/update-todo.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewTodoComponent,
    TodoComponent,
    AuthComponent,
    HomeComponent,
    LoadingSpinComponent,
    ErrorPopupComponent,
    ProfileComponent,
    RecycleBinComponent,
    PopUpComponent,
    UpdateTodoComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
