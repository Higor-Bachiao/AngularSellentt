import { Component, OnInit } from '@angular/core';
import {FirebaseTSAuth} from 'firebasets/firebasetsAuth/firebaseTSAuth';  
import {Router} from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  suth = new FirebaseTSAuth();
  constructor() { }

  ngOnInit(): void {
  }


  onResendClick(){
    this.suth.sendVerificationEmail();
  }


}
