import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistService } from '../../services/checklist.service';
import { AsvsCategory } from '../../models/asvs.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: AsvsCategory[] = [];
  selectedCategoryName: string = '';
  @Output() categorySelected = new EventEmitter<string>();

  constructor(private checklistService: ChecklistService) { }

  ngOnInit(): void {
    this.checklistService.categories$.subscribe(data => {
      this.categories = data;
      if (this.categories.length > 0 && !this.selectedCategoryName) {
        this.selectCategory(this.categories[0].name);
      }
    });
  }

  selectCategory(name: string) {
    this.selectedCategoryName = name;
    this.categorySelected.emit(name);
  }

  getCompletedCount(category: AsvsCategory): number {
    return category.items.filter(i => i.selected).length;
  }
}
