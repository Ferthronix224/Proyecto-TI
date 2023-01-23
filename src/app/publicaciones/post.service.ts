import { Post } from "./post.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators'
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostService{
  private posts: Post[] = [];// primera matriz
  private postsUpdate = new Subject<Post[]>();

  constructor (private http: HttpClient, private router: Router){}

  getPosts(){
    //return [...this.posts]// segunda matriz (copia)
    this.http.get<{message:string, posts: any}>('http://localhost:3000/api.posts')
    .pipe(map((postData => {
      return postData.posts.map(post =>{
        return{
        id: post._id,
        name: post.name,
        lastName: post.lastName,
        dateBirth: post.dateBirth,
        address: post.address,
        number: post.number,
        generation: post.generation,
        average: post.average,
        disability: post.disability,
        reports: post.reports,
        imagePath: post.imagePath
      }
      })
    })))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts
      this.postsUpdate.next([...this.posts])
    })
  }

  getPostsUpdateListener(){
    return this.postsUpdate.asObservable()
  }

  getPost(id: string){
    //return {...this.posts.find( p => p.id === id)}
    return this.http.get<{_id: string, name: string, lastName: string, dateBirth:string, address:string, number: string, generation: string, average: string, disability: string, reports: string, imagePath: string}>
    ('http://localhost:3000/api.posts/' + id)
  }

  addPost(name: string, lastName: string, dateBirth:string, address:string, number: string, generation: string, average: string, disability: string, reports: string, image: File){
    const postData = new FormData()
    postData.append('name', name)
    postData.append('lastName', lastName)
    postData.append('dateBirth', dateBirth)
    postData.append('address', address)
    postData.append('number', number)
    postData.append('generation', generation)
    postData.append('average', average)
    postData.append('disability', disability)
    postData.append('reports', reports)
    postData.append('image', image, name)
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api.posts', postData)
    .subscribe((responseData) => {
      const post: Post={
        id: responseData.post.id,
        name: name,
        lastName: lastName,
        dateBirth: dateBirth,
        address: address,
        number: number,
        generation: generation,
        average: average,
        disability: disability,
        reports: reports,
        imagePath: responseData.post.imagePath}
      this.posts.push(post)
      this.postsUpdate.next([...this.posts])
      this.router.navigate(['/list'])
    })
    }

  updatePost(id: string, name: string, lastName: string, dateBirth:string, address:string, number: string, generation: string, average: string, disability: string, reports: string, image: File | string){
    let postData: Post | FormData
    if(typeof image === "object"){
      postData = new FormData()
      postData.append("id", id)
      postData.append('name', name)
      postData.append('lastName', lastName)
      postData.append('dateBirth', dateBirth)
      postData.append('address', address)
      postData.append('number', number)
      postData.append('generation', generation)
      postData.append('average', average)
      postData.append('disability', disability)
      postData.append('reports', reports)
      postData.append("image", image, name)
     }
    this.http.put("http://localhost:3000/api.posts/" + id, postData)
    .subscribe(response => {
      const updatePost = [...this.posts]
      const oldPostIndex = updatePost.findIndex(p => p.id === id)
      const post: Post = {
        id: id,
        name: name,
        lastName: lastName,
        dateBirth: dateBirth,
        address: address,
        number: number,
        generation: generation,
        average: average,
        disability: disability,
        reports: reports,
        imagePath: ""
      }
      updatePost[oldPostIndex] = post
      this.posts = updatePost
      this.postsUpdate.next([...this.posts])
      this.router.navigate(['/list'])
    })
  }

  deletePost(id: string){
    this.http.delete<{message: string}>('http://localhost:3000/api.posts/' + id)
    .subscribe(() => {
      const updatePosts = this.posts.filter(post => post.id != id)
      this.posts = updatePosts
      this.postsUpdate.next([...this.posts])
    })
  }
}
