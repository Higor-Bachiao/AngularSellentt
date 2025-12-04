import { Component, OnInit } from '@angular/core';
import{FirebaseTSAuth} from 'firebasets/firebasetsAuth/firebaseTSAuth';
import{FirebaseTSFirestore} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import{FirebaseTSStorage} from 'firebasets/firebasetsStorage/firebaseTSStorage';
import{FirebaseTSApp} from 'firebasets/firebasetsApp/firebaseTSApp';
import{MatDialogRef}from '@angular/material/dialog';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  selectedImageFile: File | null = null;
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore()
  storage = new FirebaseTSStorage();
  constructor(private dialog: MatDialogRef<CreatePostComponent>) { }

  ngOnInit(): void {
  }

  onPostClick(commentInput: HTMLTextAreaElement){
    let comment = commentInput.value;
    
    console.log("=== onPostClick called ===");
    console.log("Comment:", comment);
    console.log("Comment length:", comment.length);
    console.log("Has image:", !!this.selectedImageFile);
    
    const currentUser = this.auth.getAuth().currentUser;
    console.log("Current user:", currentUser);
    console.log("Is signed in:", this.auth.isSignedIn());
    
    // Verificar se o usuário está logado
    if (!currentUser) {
      console.error("❌ User not logged in!");
      alert("You must be logged in to create a post! Please login first.");
      this.dialog.close();
      return;
    }
    
    console.log("✅ User is logged in:", currentUser.email);
    
    // Verificar se há conteúdo
    if(comment.trim().length <= 0 && !this.selectedImageFile) {
      alert("Please add some text or an image!");
      return;
    }
    
    if(this.selectedImageFile){
      console.log("📸 Creating post with image...");
      this.uploadImagePost(comment);
    } else{
      console.log("📝 Creating text-only post...");
      this.uploadPost(comment);
    }
  }

  
  uploadImagePost(comment: string){
    let postId = this.firestore.genDocId();
    this.storage.upload(
      {
      uploadName: "upload Image Post",
      path: ["Posts", postId, "image"],
      data: {
        data: this.selectedImageFile
      },
      onComplete: (downloadUrl) => {
        console.log("Image uploaded! URL:", downloadUrl);
        // Após upload da imagem, salvar o post no Firestore
        this.firestore.create({
          path: ["Posts", postId],
          data: {
            comment: comment,
            creatorId: this.auth.getAuth().currentUser?.uid,
            imageUrl: downloadUrl,
            timestamp: FirebaseTSApp.getFirestoreTimestamp(),
            likes: 0
          },
          onComplete: (docId) => {
            console.log("Post created successfully!");
            this.dialog.close();
          },
          onFail: (error: any) => {
            console.error("Failed to create post:", error);
            alert("Failed to create post: " + error);
          }
        });
      },
      onFail: (error: any) => {
        console.error("Failed to upload image:", error);
        alert("Failed to upload image: " + error);
      }
    });
  }

  uploadPost(comment: string){
    console.log("=== Uploading text-only post ===");
    let postId = this.firestore.genDocId();
    console.log("Generated Post ID:", postId);
    
    this.firestore.create({
      path: ["Posts", postId],
      data: {
        comment: comment,
        creatorId: this.auth.getAuth().currentUser?.uid,
        imageUrl: null,
        timestamp: FirebaseTSApp.getFirestoreTimestamp(),
        likes: 0
      },
      onComplete: (docId) => {
        console.log("✅ Text post created successfully! Doc ID:", docId);
        alert("Post created successfully!");
        this.dialog.close();
      },
      onFail: (error: any) => {
        console.error("❌ Failed to create text post:", error);
        alert("Failed to create post: " + error);
      }
    });
  }


  onPhotoSelected(photoSelector: HTMLInputElement){
    if (!photoSelector.files || photoSelector.files.length === 0) {
      return;
    }
    
    this.selectedImageFile = photoSelector.files[0];
    if(!this.selectedImageFile) return;
    
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.selectedImageFile);
    fileReader.addEventListener(
      "loadend",
      (ev: ProgressEvent<FileReader>) => {
        let readableString = fileReader.result?.toString();
        if (!readableString) return;
        
        let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image");
        if (postPreviewImage) {
          postPreviewImage.src = readableString;
        }
      }
    );
  }
}

