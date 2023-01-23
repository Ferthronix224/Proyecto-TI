import { Component, OnInit } from "@angular/core"
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms"
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{

  form: FormGroup
  imagePreview: string
  private mode = 'create'
  private postId: string
  post: Post
  isLoading = false
  disability = 'No'
  reports = 'No'

  constructor(public postsService: PostService, public route: ActivatedRoute){ }

  ngOnInit(){

    this.form = new FormGroup({
      "name": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "lastName": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "dateBirth": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "address": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]}),
      "number": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "generation": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]}),
      "average": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(1)]}),
      "disability": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]}),
      "reports": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]}),
      "image": new FormControl(null, {
        validators: [Validators.required], asyncValidators: [mimeType]})
    })

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true
        //this.post = this.postsService.getPost(this.postId)
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false
          this.post = {
            id: postData._id,
            name: postData.name,
            lastName: postData.lastName,
            dateBirth: postData.dateBirth,
            address: postData.address,
            number: postData.number,
            generation: postData.generation,
            average: postData.average,
            disability: postData.disability,
            reports: postData.reports,
            imagePath: postData.imagePath
          }
          this.form.setValue({
            name: this.post.name,
            lastName: this.post.lastName,
            dateBirth: this.post.dateBirth,
            address: this.post.address,
            number: this.post.number,
            generation: this.post.generation,
            average: this.post.average,
            disability: this.post.disability,
            reports: this.post.reports,
            image: this.post.imagePath
          })
        })
      }else{
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({image: file})
    this.form.get('image').updateValueAndValidity()
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
    console.log(file)
    console.log(this.form)
  }

  onSavePost(){
    if(this.form.invalid){
      return
    }
    this.isLoading = true
    if(this.mode == 'create'){
      this.postsService.addPost(
        this.form.value.name,
        this.form.value.lastName,
        this.form.value.dateBirth,
        this.form.value.address,
        this.form.value.number,
        this.form.value.generation,
        this.form.value.average,
        this.form.value.disability,
        this.form.value.reports,
        this.form.value.image
        )

    }else{
      this.postsService.updatePost(
        this.postId,
        this.form.value.name,
        this.form.value.lastName,
        this.form.value.dateBirth,
        this.form.value.address,
        this.form.value.number,
        this.form.value.generation,
        this.form.value.average,
        this.form.value.disability,
        this.form.value.reports,
        this.form.value.image
      )
    }

    this.form.reset()
  }
}
