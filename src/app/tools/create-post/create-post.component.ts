import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  selectedImagesFile: File | null = null;
  
  constructor() { }

  ngOnInit(): void {
  }


  onPhotoSelected(photoSelector: HTMLInputElement){
    if (!photoSelector.files || photoSelector.files.length === 0) {
      return;
    }

    this.selectedImagesFile = photoSelector.files[0];
    if(!this.selectedImagesFile) return;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.selectedImagesFile);
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
