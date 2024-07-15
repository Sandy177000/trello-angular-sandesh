import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import axios from 'axios';
import { APIKey, token } from '../constants';
import { TrelloService } from '../services/trello.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-checklistitems',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './checklistitems.component.html',
  styleUrls: ['./checklistitems.component.css'],
})
export class ChecklistitemsComponent implements OnInit {
  @Input() checklistId: any;
  checklistitems: any = [];
  percentCompletion: string = '0';
  isLoading: boolean = false;

  constructor(private trelloService: TrelloService) {}

  ngOnInit(): void {
    this.getCheckListItems(this.checklistId);
  }

  async handleCreateCheckListItem(event: Event) {
    event.preventDefault();
    try {
      this.isLoading = true;
      const form = event.target as HTMLFormElement;
      const checklistitemNameInput = form.elements.namedItem(
        'checklistitemName'
      ) as HTMLInputElement;

      const checklistitemName = checklistitemNameInput.value;

      if (checklistitemName.trim().length == 0) return;

      const currentCheckListItem = await this.createCheckListItem(
        checklistitemName.trim(),
        this.checklistId
      );
      this.updatePercentCompletion();
      this.checklistitems = [...this.checklistitems, currentCheckListItem];
      form.reset();
    } catch (error) {
    }
    finally{
      this.isLoading = false;
    }
  }

  async handleDeleteCheckListItem(checklistId: string, checklistItem: any) {
    let temp = [...this.checklistitems];
    try {
      this.isLoading = true;
      await this.deleteCheckListItem(checklistId, checklistItem.id);
      this.checklistitems = this.checklistitems.filter(
        (item: any) => item.id !== checklistItem.id
      );

      this.updatePercentCompletion();
    } catch (error) {
      this.checklistitems = temp;
    }
    finally{
      this.isLoading = false;
    }
  }

  async handleUpdateCheckListItemState(checklistItem: any, event: Event) {
   
    this.isLoading = true;
    const checkbox = event.target as HTMLInputElement;
    if (!checkbox) {
      console.error('Checkbox element not found');
      return;
    }

    const newState = checkbox.checked ? 'complete' : 'incomplete';
    const originalState = checklistItem.state;

    try {
      let cardId = this.trelloService.currentCard.id;
      await this.updateCheckItemState(cardId, checklistItem.id, newState);

      checklistItem.state = newState;

      this.checklistitems = [...this.checklistitems];
      this.updatePercentCompletion();

    } catch (error) {
      console.error('Error updating checklist item:', error);
      checklistItem.state = originalState;
      checkbox.checked = originalState === 'complete';
      this.checklistitems = [...this.checklistitems];
    }
    finally{
      this.isLoading = false;
    }
  }

  
  updatePercentCompletion() {
    let completedItems = this.checklistitems.filter((element: any) => {
      if (element.state == 'complete') return element;
    }).length;
    
    let count = completedItems ? completedItems : 0;
    let completion = (count / this.checklistitems.length) * 100;
    this.percentCompletion = completion ? completion.toFixed(0) : '0';
  }

  async getCheckListItems(id: string) {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/checklists/${id}/checkItems?key=${APIKey}&token=${token}`
      );
      this.checklistitems = response.data;
      this.updatePercentCompletion();
    } catch (error) {
    }
  }

  async createCheckListItem(checkListItemName: string, id: string) {
    try {
      const response = await axios.post(
        `https://api.trello.com/1/checklists/${id}/checkItems?name=${checkListItemName}&key=${APIKey}&token=${token}`
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCheckListItem(id: string, idCheckItem: string) {
    try {
      await axios.delete(
        `https://api.trello.com/1/checklists/${id}/checkItems/${idCheckItem}?key=${APIKey}&token=${token}`
      );
    } catch (error) {
      throw error;
    }
  }

  async updateCheckItemState(
    cardId: string,
    idCheckItem: string,
    state: string
  ) {
    const response = await axios.put(
      `https://api.trello.com/1/cards/${cardId}/checkItem/${idCheckItem}?state=${state}&key=${APIKey}&token=${token}`
    );

    return response.data;
  }
}
