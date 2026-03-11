import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ChecklistViewComponent } from './components/checklist-view/checklist-view.component';
import { ScoreDashboardComponent } from './components/score-dashboard/score-dashboard.component';
import { AiRecommendationsComponent } from './components/ai-recommendations/ai-recommendations.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CategoryListComponent,
    ChecklistViewComponent,
    ScoreDashboardComponent,
    AiRecommendationsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OWASP ASVS Tracker';
  selectedCategoryName: string = '';
  currentLevel: number = 1;

  onCategorySelected(categoryName: string) {
    this.selectedCategoryName = categoryName;
  }
}
