import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TrelloService } from '../services/trello.service';
import axios from 'axios';
import { APIKey, token } from '../constants';
import { ChecklistComponent } from '../checklist/checklist.component';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ChecklistComponent,LoaderComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  isLoading: boolean = false;

  constructor(public trelloservice: TrelloService) {}
  
  ngOnInit(): void {
    this.trelloservice.getCheckLists();
  }

 
  async handleCreateChecklist(event: Event) {
    event.preventDefault();

    this.isLoading = true;
    try {
      const form = event.target as HTMLFormElement;
      const checkListNameInput = form.elements.namedItem(
        'checklistName'
      ) as HTMLInputElement;
      const checklistName = checkListNameInput.value;

      if (checklistName.trim().length == 0) return;

      const currentChecklist = await this.createCheckList(
        checklistName.trim(),
        this.trelloservice.currentCard.id
      );
      this.trelloservice.checklists = [
        ...this.trelloservice.checklists,
        currentChecklist,
      ];
      form.reset();
    } catch (error) {
    }
    finally{

      this.isLoading = false;
    }
  }
  closeModal() {
    this.trelloservice.closeCardModal();
  }

  async createCheckList(checkListName: string, id: string) {
    const response = await axios.post(
      `https://api.trello.com/1/checklists?idCard=${id}&name=${checkListName}&key=${APIKey}&token=${token}`,
      {
        method: 'POST',
      }
    );

    return response.data;
  }

}
