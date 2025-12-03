import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CodeibleSocialMediaProject';
  auth = new FirebaseTSAuth();
  
  constructor(private loginSheet: MatBottomSheet){
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user =>{
              alert("Logged in");
              
            },
            whenSignedOut: user =>{
              alert("Logged out");
              
            },
            whenSignedInAndEmailNotVerified: user =>{
              
            },
            whenSignedInAndEmailVerified: user =>{

            },
            whenChanged: user =>{

            }
          }
        );
      }
    );
  }

  onLogoutClick(){
    this.auth.signOut();
  }



  loggedIn(){
    return this.auth.isSignedIn();
  }
  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
}
