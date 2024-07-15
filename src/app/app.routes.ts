import { Routes } from '@angular/router';
import { BoardsComponent } from './boards/boards.component';
import { BoardComponent } from './board/board.component';

export const routes: Routes = [
  { path: 'boards', component: BoardsComponent },

  { path: 'board/:id', component: BoardComponent },
  { path: '', redirectTo: '/boards', pathMatch: 'full' },
];