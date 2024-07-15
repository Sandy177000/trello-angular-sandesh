import { APIKey, token } from '../constants.js';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { Location } from '@angular/common';
import { CardsComponent } from '../cards/cards.component.js';
import { TrelloService } from '../services/trello.service.js';
import { CardComponent } from '../card/card.component.js';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    CardsComponent,
    CardComponent,
    LoaderComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit {
  boardId: any = '';
  board: any = {};
  lists: any = [];
  modal: boolean = false;
  isLoading: boolean = false;

  constructor(
    public trelloservice: TrelloService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.boardId = params.get('id');
      this.board = await this.getBoard(this.boardId);
      this.lists = await this.getLists(this.boardId);
    });
  }

  async handleDeleteList(list: any) {
    let temp = [...this.lists];
    this.isLoading = true;
    try {
      this.lists = [...this.lists].filter((item) => {
        if (item.id != list.id) return item;
      });

      await this.archiveList(list.id);
    } catch (error) {
      this.lists = temp;
    } finally {
      this.isLoading = false;
    }
  }

  handleModal() {
    this.modal = !this.modal;
  }
  async handleCreateList(event: Event) {
    event.preventDefault();

    try {
      this.isLoading = true;
      const form = event.target as HTMLFormElement;
      const listNameInput = form.elements.namedItem(
        'listName'
      ) as HTMLInputElement;
      const listName = listNameInput.value;

      if (listName.trim().length == 0) return;

      const currentList = await this.createList(listName.trim(), this.board.id);
      this.lists = [...this.lists, currentList];
      form.reset();
      this.modal = false;
    } catch (error) {
    } finally {
      this.isLoading = false;
    }
  }

  handleGoBack() {
    this.location.back();
  }

  async archiveList(listId: string) {
    const response = await axios.put(
      `https://api.trello.com/1/lists/${listId}/closed?value=true&key=${APIKey}&token=${token}`
    );

    return response.data;
  }

  async getBoard(boardId: any) {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}?key=${APIKey}&token=${token}`
    );
    return response.data;
  }

  async getLists(boardId: string) {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${boardId}/lists?key=${APIKey}&token=${token}`
    );
    return response.data;
  }

  async createList(listName: string, boardId: string) {
    const response = await axios.post(
      `https://api.trello.com/1/lists?name=${listName}&idBoard=${boardId}&key=${APIKey}&token=${token}`
    );

    return response.data;
  }
}
