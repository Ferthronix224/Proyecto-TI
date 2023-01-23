import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarpetasComponent } from './carpetas/carpetas.component';
import { IntroComponent } from './intro/intro.component';
import { PostCreateComponent } from './publicaciones/post-create/post-create.component';
import { PostListComponent } from './publicaciones/post-list/post-list.component';

const routes: Routes = [
  {path: '', component: IntroComponent},
  {path: 'list', component: PostListComponent},
  {path: 'generation', component: CarpetasComponent},
  {path: 'create', component: PostCreateComponent},
  {path: 'edit/:postId', component: PostCreateComponent},
  {path: '2017', component: PostListComponent},
  {path: '2018', component: PostListComponent},
  {path: '2019', component: PostListComponent},
  {path: '2020', component: PostListComponent},
  {path: '2021', component: PostListComponent},
  {path: '2022', component: PostListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
