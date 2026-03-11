import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChecklistService } from '../../services/checklist.service';
import { AiService } from '../../services/ai.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-ai-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-recommendations.component.html',
  styleUrls: ['./ai-recommendations.component.css']
})
export class AiRecommendationsComponent {
  @Input() currentLevel: number = 1;

  apiKey: string = '';
  isGenerating: boolean = false;
  recommendationsHtml: SafeHtml | null = null;
  error: string | null = null;

  constructor(
    private checklistService: ChecklistService,
    private aiService: AiService,
    private sanitizer: DomSanitizer
  ) { }

  async generateRecommendations() {
    this.isGenerating = true;
    this.error = null;
    this.recommendationsHtml = null;

    if (this.apiKey) {
      this.aiService.setApiKey(this.apiKey);
    }

    const missingMeasures = this.checklistService.getMissingMeasures(this.currentLevel);

    if (missingMeasures.length === 0) {
      this.error = "Great job! You have fully implemented the selected level of OWASP ASVS.";
      this.isGenerating = false;
      return;
    }

    try {
      const markdown = await this.aiService.getRecommendations(missingMeasures);
      const parsedHtml = await marked.parse(markdown);
      this.recommendationsHtml = this.sanitizer.bypassSecurityTrustHtml(parsedHtml);
    } catch (err) {
      this.error = "Failed to fetch recommendations. Please check your API key or network connection.";
    } finally {
      this.isGenerating = false;
    }
  }
}
