import { Component, Input, OnInit } from '@angular/core';
import axios from 'axios';
import { APIKey, token } from '../constants';
import { CommonModule } from '@angular/common';
import { TrelloService } from '../services/trello.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  @Input() list: any;
  isLoading: boolean = false;
  cards: any = [];
  constructor(private trelloService: TrelloService) {}

  ngOnInit() {
    if (this.list && this.list.id) {
      this.fetchCards();
    }
  }

  async fetchCards() {
    try {
      this.isLoading = true;
      this.cards = await this.getCards(this.list.id);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      this.isLoading = false;
    }
  }

  handleCardModal(card: any) {
    this.trelloService.handleCardModal(card);
  }

  async handleCreateCard(event: Event) {
    event.preventDefault();

    try {
      this.isLoading = true;
      const form = event.target as HTMLFormElement;
      const cardNameInput = form.elements.namedItem(
        'cardName'
      ) as HTMLInputElement;

      let listId = this.list.id;

      const cardName = cardNameInput.value;

      if (cardName.trim().length == 0) return;

      const currentCard = await this.createCard(cardName.trim(), listId);
      this.cards = [...this.cards, currentCard];
      form.reset();
    } catch (error) {
    } finally {
      this.isLoading = false;
    }
  }

  async handleDeleteCard(event: Event, card: any) {
    event.stopPropagation();

    let temp = [...this.cards];
    try {
      this.isLoading = true;
      this.cards = [...this.cards].filter((item) => {
        if (item.id != card.id) return item;
      });
      await this.archiveCard(card.id);
    } catch (error) {
      this.cards = temp;
    } finally {
      this.isLoading = false;
    }
  }

  async getCards(listId: string) {
    const response = await axios.get(
      `https://api.trello.com/1/lists/${listId}/cards?key=${APIKey}&token=${token}`
    );

    return response.data;
  }

  async createCard(cardName: string, listId: string) {
    const response = await axios.post(
      `https://api.trello.com/1/cards?idList=${listId}&name=${cardName}&key=${APIKey}&token=${token}`
    );

    return response.data;
  }

  async archiveCard(id: string) {
    const response = await axios.delete(
      `https://api.trello.com/1/cards/${id}?key=${APIKey}&token=${token}`
    );

    return response.data;
  }
}
