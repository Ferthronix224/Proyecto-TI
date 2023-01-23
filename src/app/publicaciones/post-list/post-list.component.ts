import { Component, OnInit, OnDestroy } from "@angular/core"
import { Subscription } from "rxjs"
import {FormsModule} from '@angular/forms';
import { Post } from "../post.model"
import { PostService } from "../post.service"

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[] = []
  isLoading = false
  link = window.location.pathname
  search = ''

  private postsSub: Subscription

  constructor (public postsService: PostService){}

  ngOnInit() {
    this.isLoading = true
    this.postsService.getPosts()
    this.postsSub = this.postsService.getPostsUpdateListener()
    .subscribe((posts: Post[]) => {
      this.isLoading = false
      this.posts = posts;
    });
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe()
  }

  deleteDocument(id: string){
    this.postsService.deletePost(id);
  }
}
