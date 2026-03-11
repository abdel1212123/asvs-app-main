import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistService } from '../../services/checklist.service';
import { AsvsCategory, AsvsItem } from '../../models/asvs.model';

@Component({
  selector: 'app-checklist-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-view.component.html',
  styleUrls: ['./checklist-view.component.css']
})
export class ChecklistViewComponent implements OnChanges {
  @Input() categoryName: string = '';
  @Input() currentLevel: number = 1;
  @Output() selectionChanged = new EventEmitter<void>();

  category: AsvsCategory | undefined;
  itemsToDisplay: AsvsItem[] = [];

  constructor(private checklistService: ChecklistService) {
    this.checklistService.categories$.subscribe(categories => {
      this.updateDisplay(categories);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryName'] || changes['currentLevel']) {
      this.checklistService.categories$.subscribe(categories => {
        this.updateDisplay(categories);
      }).unsubscribe(); // Force single update or rely on subscription
    }
  }

  private updateDisplay(categories: AsvsCategory[]) {
    if (this.categoryName) {
      this.category = categories.find(c => c.name === this.categoryName);
      if (this.category) {
        this.itemsToDisplay = this.category.items.filter(item => {
          return (this.currentLevel === 1 && item.l1) ||
            (this.currentLevel === 2 && (item.l1 || item.l2)) ||
            (this.currentLevel === 3 && (item.l1 || item.l2 || item.l3));
        });
      }
    }
  }

  toggleItem(item: AsvsItem) {
    if (this.category) {
      this.checklistService.toggleItem(this.category.name, item.id, this.currentLevel);
      this.selectionChanged.emit();
    }
  }
}
