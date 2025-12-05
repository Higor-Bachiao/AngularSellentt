import { Component, OnInit } from '@angular/core';
import {FirebaseTSAuth} from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {
  state = AuthenticatorCompState.LOGIN;
  firebasetsAuth: FirebaseTSAuth;

  constructor(
    private bottomSheetRef: MatBottomSheetRef,
    private router: Router
  ) {
    this.firebasetsAuth = new FirebaseTSAuth();
  }
  
  ngOnInit(): void {
  }

  onResetClick(resetEmail: HTMLInputElement){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)){
      this.firebasetsAuth.sendPasswordResetEmail(
        {
          email : email,
          onComplete: () =>{
            this.bottomSheetRef.dismiss();
          }
        }
      );
    }
  }

  onLogin(
    loginEmail : HTMLInputElement,
    loginPassword : HTMLInputElement
  ){
    let email = loginEmail.value;
    let password = loginPassword.value;

    if(this.isNotEmpty(email) && this.isNotEmpty(password)){
      this.firebasetsAuth.signInWith(
        {
          email : email,
          password : password,
          onComplete: (uc: any) =>{
            this.bottomSheetRef.dismiss();
            // O app.component vai detectar o login e redirecionar automaticamente
          },
          onFail: (err: any) =>{
            alert("Failed to login: " + err);
          }
        }
      );
    }
  }

  onRegisterClick(    
    registerEmail : HTMLInputElement,
    registerPassword : HTMLInputElement,
    registerConfirmPassword : HTMLInputElement
  ){
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if(this.isNotEmpty(email) && this.isNotEmpty(password) && this.isAMatch(password, confirmPassword)){
      this.firebasetsAuth.createAccountWith(
      {
        email : email,
        password : password,
        onComplete: (uc: any) =>{
          this.bottomSheetRef.dismiss();
          // O app.component vai detectar o registro e redirecionar automaticamente
        },
        onFail: (err: any) =>{
          alert("Failed to create account: " + err);
        }
      }
    );
    }

  }

  isNotEmpty(text : string){
    return text != null && text.length > 0;
  }

  isAMatch(text: string, compareWith: string){
    return text === compareWith;
  }

  onForgotPasswordClick(){
    this.state = AuthenticatorCompState.FORGOT_PASSWORD;
  }
  onCreateAccountClick(){
    this.state = AuthenticatorCompState.REGISTER; 
  }

  onLoginClick(){
    this.state = AuthenticatorCompState.LOGIN;
  }

  isLoginState(){
    return this.state == AuthenticatorCompState.LOGIN;
  }

  isRegisterState(){
    return this.state == AuthenticatorCompState.REGISTER;
  }

  isForgotPasswordState(){
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD;
  }

  getStateText(){
    switch(this.state){
      case AuthenticatorCompState.LOGIN:
        return "Login";
      case AuthenticatorCompState.REGISTER:
        return "Register";
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "Forgot Password";
      default:
        return "Login";
    }
  }
}

export enum AuthenticatorCompState{
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
