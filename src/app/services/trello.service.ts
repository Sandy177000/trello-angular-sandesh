import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { APIKey, token } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class TrelloService {
  currentCard: any = {};
  cardModal: boolean = false;
  checklists: any = [];

  constructor() {}

  async getAllBoards(): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await axios.get(
        `https://api.trello.com/1/members/me/boards?key=${APIKey}&token=${token}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  }

  async getCheckLists(){
    let cardId = this.currentCard.id;
    const response = await axios.get(
      `https://api.trello.com/1/cards/${cardId}/checklists?key=${APIKey}&token=${token}`
    );
    this.checklists = response.data;
  }

  handleCardModal(card: any) {
    this.cardModal = true;
    this.currentCard = card;
  }

  closeCardModal() {
    this.cardModal = false;
    this.currentCard = {};
  }
}
