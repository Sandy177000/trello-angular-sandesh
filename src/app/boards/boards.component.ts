import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrelloService } from '../services/trello.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { APIKey, token } from '../constants';
import axios from 'axios';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, LoaderComponent],
})
export class BoardsComponent implements OnInit {
  boards: any[] = [];
  modal: boolean = false;
  isLoading: boolean = false;

  constructor(private trelloService: TrelloService, private router: Router) {}

  ngOnInit() {
    this.fetchBoards();
  }

  async fetchBoards() {
    this.isLoading = true;
    try {
      this.boards = await this.trelloService.getAllBoards();
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      this.isLoading = false;
    }
  }

  handleSelectedBoard(board: any) {
    this.router.navigate(['/board', board.id]);
  }
  handleModal() {
    this.modal = !this.modal;
  }
  async handleCreateBoard(event: Event) {
    event.preventDefault();

    try {
      const form = event.target as HTMLFormElement;
      const boardNameInput = form.elements.namedItem(
        'boardName'
      ) as HTMLInputElement;
      const boardName = boardNameInput.value;

      if (boardName.trim().length == 0) return;

      const currentBoard = await this.createBoard(boardName.trim());
      this.boards = [...this.boards, currentBoard];
      form.reset();
      this.modal = false;
    } catch (error) {}
  }

  async createBoard(boardName: string) {
    const response = await axios.post(
      `https://api.trello.com/1/boards/?name=${boardName}&key=${APIKey}&token=${token}`
    );
    return response.data;
  }
}
