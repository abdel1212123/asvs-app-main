import { TestBed } from '@angular/core/testing';
import { AiService } from './ai.service';
import { AsvsItem } from '../models/asvs.model';

describe('AiService - REAL GEMINI API TEST', () => {
  let service: AiService;

  const realItems: AsvsItem[] = [
    {
      id: '1.1.2',
      description: 'Verify the use of threat modeling for every design change or sprint planning.',
      l1: false,
      l2: true,
      l3: true,
      cwe: '1053'
    },
    {
      id: '1.1.3',
      description: 'Verify that user stories contain functional security constraints.',
      l1: false,
      l2: true,
      l3: true,
      cwe: '1110'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiService);

    // ⚠️ Prefer environment variable instead of hardcoding
    service.setApiKey('Test');
  });

  it('should call Gemini API and return real recommendations', async () => {

    console.log('----- Starting Gemini API Test -----');

    const response = await service.getRecommendations(realItems);

    console.log('Gemini Response:', response);

    // Basic validations
    expect(response).toBeTruthy();
    expect(typeof response).toBe('string');

    // Ensure we are NOT using the mock implementation
    expect(response).not.toContain('Mocked AI Response');

    // Ensure the response contains meaningful text
    expect(response.trim().length).toBeGreaterThan(20);

    // Security-related keywords likely present in real AI output
    const lower = response.toLowerCase();
    expect(
      lower.includes('security') ||
      lower.includes('implement') ||
      lower.includes('best practice') ||
      lower.includes('threat')
    ).toBeTrue();
  });
});