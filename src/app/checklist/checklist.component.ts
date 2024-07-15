import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChecklistitemsComponent } from '../checklistitems/checklistitems.component';
import axios from 'axios';
import { APIKey, token } from '../constants';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, ChecklistitemsComponent,LoaderComponent],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.css',
})
export class ChecklistComponent {
  
  @Input() checklists: any[] = [];
  checklistItems: any[] = [];
  isLoading: boolean = false;

  async handleDeleteCheckList(checklist: any) {
    let temp = [this.checklists];
    try {
      this.isLoading = true;
      this.checklists = [...this.checklists].filter((item) => {
        if (item.id != checklist.id) return item;
      });
      await this.deleteCheckList(checklist.id);
      
    } catch (error) {
      this.checklists = temp;
    }
    finally{
      this.isLoading = false;
    }
  }

  async createCheckListItem(checkListItemName: string, id: string) {
    const response = await axios.post(
      `https://api.trello.com/1/checklists/${id}/checkItems?name=${checkListItemName}&key=${APIKey}&token=${token}`
    );

    return response.data;
  }

  async deleteCheckList(id: string) {
    const response = await axios.delete(
      `https://api.trello.com/1/checklists/${id}?key=${APIKey}&token=${token}`
    );

    return response.data;
  }

}
