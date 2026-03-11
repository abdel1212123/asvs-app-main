import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsvsCategory, AsvsItem } from '../models/asvs.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private categoriesSubject = new BehaviorSubject<AsvsCategory[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private scoreSubject = new BehaviorSubject<{ implemented: number, total: number, percentage: number }>({ implemented: 0, total: 0, percentage: 0 });
  public score$ = this.scoreSubject.asObservable();

  constructor() {
    this.loadData();
  }

  private async loadData() {
    try {
      const response = await fetch('assets/asvs.json');
      const data: AsvsCategory[] = await response.json();

      // Initialize selected state to false
      const initializedData = data.map(category => ({
        ...category,
        items: category.items.map(item => ({ ...item, selected: false }))
      }));

      this.categoriesSubject.next(initializedData);
      this.calculateScore(initializedData);
    } catch (error) {
      console.error('Failed to load ASVS data', error);
    }
  }

  public toggleItem(categoryId: string, itemId: string, level: number = 1) {
    const currentCategories = this.categoriesSubject.value;

    // Create new array to trigger change detection
    const updatedCategories = currentCategories.map(cat => {
      if (cat.name === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => {
            if (item.id === itemId) {
              return { ...item, selected: !item.selected };
            }
            return item;
          })
        };
      }
      return cat;
    });

    this.categoriesSubject.next(updatedCategories);
    this.calculateScore(updatedCategories, level);
  }

  private calculateScore(categories: AsvsCategory[], currentLevel: number = 1) {
    let total = 0;
    let implemented = 0;

    categories.forEach(cat => {
      cat.items.forEach(item => {
        // Only count items applicable to the current level or lower
        const isApplicable = (currentLevel === 1 && item.l1) ||
          (currentLevel === 2 && (item.l1 || item.l2)) ||
          (currentLevel === 3 && (item.l1 || item.l2 || item.l3));

        if (isApplicable) {
          total++;
          if (item.selected) {
            implemented++;
          }
        }
      });
    });

    const percentage = total === 0 ? 0 : Math.round((implemented / total) * 100);
    this.scoreSubject.next({ implemented, total, percentage });
  }

  public getMissingMeasures(currentLevel: number = 1): AsvsItem[] {
    const missing: AsvsItem[] = [];
    const categories = this.categoriesSubject.value;

    categories.forEach(cat => {
      cat.items.forEach(item => {
        const isApplicable = (currentLevel === 1 && item.l1) ||
          (currentLevel === 2 && (item.l1 || item.l2)) ||
          (currentLevel === 3 && (item.l1 || item.l2 || item.l3));

        if (isApplicable && !item.selected) {
          missing.push(item);
        }
      });
    });

    return missing;
  }
}
