import { Component,Input, OnInit } from '@angular/core';
import{FirebaseTSFirestore} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() show!: boolean;

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;

  constructor() { 
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
  }

  onContinueClick(nameInput: HTMLInputElement, descriptionInput: HTMLTextAreaElement){
    let name = nameInput.value.trim();
    let description = descriptionInput.value.trim();

    console.log("=== Creating profile ===");
    console.log("Name:", name);
    console.log("Description:", description);

    // Validar campos
    if (!name || !description) {
      alert("Please fill in both name and description!");
      return;
    }

    // Verificar se o usuário está logado
    const currentUser = this.auth.getAuth().currentUser;
    console.log("Current user:", currentUser);
    
    if (!currentUser) {
      alert("User not logged in!");
      return;
    }

    console.log("Creating profile for user:", currentUser.uid);

    this.firestore.create({
      path: ["Users", currentUser.uid],
      data: {
        publicName: name,
        description: description,
        createdAt: new Date().toISOString()
      },
      onComplete: (docId: any) => {
        console.log("✅ Profile created successfully! Doc ID:", docId);
        alert("Profile created successfully! Redirecting...");
        
        // Recarregar a página para atualizar o estado
        window.location.reload();
      },
      onFail: (err: any) => {
        console.error("❌ Failed to create profile:", err);
        alert("Failed to create profile: " + err);
      }      
    });
  }
}
