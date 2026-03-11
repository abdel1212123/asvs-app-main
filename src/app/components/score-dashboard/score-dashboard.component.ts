import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecklistService } from '../../services/checklist.service';

@Component({
  selector: 'app-score-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-dashboard.component.html',
  styleUrls: ['./score-dashboard.component.css']
})
export class ScoreDashboardComponent implements OnInit {
  score = { implemented: 0, total: 0, percentage: 0 };

  constructor(private checklistService: ChecklistService) { }

  ngOnInit(): void {
    this.checklistService.score$.subscribe(s => this.score = s);
  }
}
