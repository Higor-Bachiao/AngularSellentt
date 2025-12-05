import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import{ Router } from '@angular/router';
import {FirebaseTSFirestore} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CodeibleSocialMediaProject';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = false;
  private static userDocument: UserDocument | null = null;


  constructor(private loginSheet: MatBottomSheet, private router: Router){
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState(
          {
            whenSignedIn: user =>{            
              
            },
            whenSignedOut: user =>{
              AppComponent.userDocument = null;
            },
            whenSignedInAndEmailNotVerified: user =>{
              this.router.navigate(["email-verification"]);
            },
            whenSignedInAndEmailVerified: user =>{
              this.getUserProfile();
            },
            whenChanged: user =>{

            }
          }
        );
      }
    );
  }

  public static getUserDocument() {
    return AppComponent.userDocument;
  }

  getUsername(){
    try{
      return AppComponent.userDocument?.publicName;

    } catch(err){
      return '';
    }
  }

  getUserProfile() {
    const currentUser = this.auth.getAuth().currentUser;
    if (!currentUser) {
      console.error("User not logged in!");
      return;
    }

    console.log("Getting user profile for:", currentUser.uid);

    this.firestore.listenToDocument(
      {
        name: "Getting Document",
        path:["Users", currentUser.uid],
        onUpdate: (result) => {
          console.log("Profile exists:", result.exists);
          console.log("Profile data:", result.data());
          
          this.userHasProfile = result.exists;
          if(result.exists) {
            AppComponent.userDocument = <UserDocument> result.data();
            AppComponent.userDocument.userId = this.auth.getAuth().currentUser!.uid;
            this.router.navigate(["postFeed"]);
          } else {
            console.log("Profile does not exist, showing profile creation");
          }
        }
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

export interface UserDocument {
  publicName: string;
  description: string;
  userId: string;
}