import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  comments: Comment[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) private postId: string) { }

  ngOnInit(): void {
    this.getComments();
  }

  isCommentCreator(comment: Comment){
    try{
      const userDoc = AppComponent.getUserDocument();
      return userDoc ? comment.creatorId == userDoc.userId : false;
    }catch(err){
      return false;
    }
  }

  getComments(){
    this.firestore.listenToCollection(
      {
        name : "Post comments",
        path: ["Posts", this.postId, "PostComments"],
        where: [new OrderBy("timestamp","asc")],
        onUpdate: (result) => {
          result.docChanges().forEach(
            postCommentDoc => {
              if(postCommentDoc.type === "added"){
                this.comments.push(<Comment>postCommentDoc.doc.data());
              }
            }
          );
        }
      }
    );
  }

  onSendClick(commentInput: HTMLInputElement) {
    console.log("onSendClick called");
    console.log("Comment value:", commentInput.value);
    console.log("Post ID:", this.postId);
    
    if(!(commentInput.value.length > 0)) return;
    
    const userDoc = AppComponent.getUserDocument();
    console.log("User document:", userDoc);
    
    if (!userDoc) {
      console.error("User document not found!");
      return;
    }

    const commentData = {
      comment: commentInput.value,
      creatorId: userDoc.userId,
      creatorName: userDoc.publicName,
      timestamp: FirebaseTSApp.getFirestoreTimestamp()
    };
    
    console.log("Creating comment with data:", commentData);
    console.log("Path:", ["Posts", this.postId, "PostComments"]);

    this.firestore.create(
      {
        path: ["Posts", this.postId, "PostComments"],
        data: commentData,
        onComplete: (docId: string) => {
          console.log("Comment created successfully with ID:", docId);
          commentInput.value = "";
        },
        onFail: (err: any) => {
          console.error("Error creating comment:", err);
        }
      }
    );
  }
}

export interface Comment {
  creatorId: string;
  creatorName: string;
  comment: string;
  timestamp: any;
}