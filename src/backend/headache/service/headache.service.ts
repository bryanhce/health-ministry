import { IHeadacheRepository } from '@/backend/headache/repository/IHeadacheRepository';
import { TypeORMHeadacheRepository } from '@/backend/headache/repository/TypeORMHeadacheRepository';
import { CreateHeadacheDTO, UpdateHeadacheDTO } from '@/backend/headache/controller/headache.dto';
import { NotFoundError, ValidationError } from '@/backend/shared/errors/AppError';
import { HeadacheEntry } from '@/backend/headache/entity/HeadacheEntry';

export class HeadacheService {
  private repository: IHeadacheRepository;

  constructor(repository?: IHeadacheRepository) {
    this.repository = repository ?? new TypeORMHeadacheRepository();
  }

  async getAllEntries(): Promise<HeadacheEntry[]> {
    return this.repository.findAll();
  }

  async getEntryById(id: string): Promise<HeadacheEntry> {
    if (!id) {
      throw new ValidationError('Entry ID is required');
    }

    const entry = await this.repository.findById(id);
    if (!entry) {
      throw new NotFoundError('Headache entry', id);
    }

    return entry;
  }

  async createEntry(dto: CreateHeadacheDTO): Promise<HeadacheEntry> {
    if (!dto.date) {
      throw new ValidationError('Date is required');
    }

    return this.repository.create({
      date: dto.date,
      painSeverity: dto.painSeverity,
      durationMinutes: dto.durationMinutes,
      notes: dto.notes ? dto.notes.trim() : null,
    });
  }

  async updateEntry(id: string, dto: UpdateHeadacheDTO): Promise<HeadacheEntry> {
    if (!id) {
      throw new ValidationError('Entry ID is required');
    }

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Headache entry', id);
    }

    const updated = await this.repository.update(id, {
      ...(dto.date !== undefined ? { date: dto.date } : {}),
      ...(dto.painSeverity !== undefined ? { painSeverity: dto.painSeverity } : {}),
      ...(dto.durationMinutes !== undefined ? { durationMinutes: dto.durationMinutes } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes ? dto.notes.trim() : null } : {}),
    });

    if (!updated) {
      throw new NotFoundError('Headache entry', id);
    }

    return updated;
  }

  async deleteEntry(id: string): Promise<void> {
    if (!id) {
      throw new ValidationError('Entry ID is required');
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Headache entry', id);
    }
  }

  async seedEntries(): Promise<{ count: number; entries: HeadacheEntry[] }> {
    // Clear existing to avoid duplicate seeds
    await this.repository.clear();

    const now = new Date();
    const seedTemplates: Array<{ daysAgo: number; pain: number; duration: number; notes: string }> = [
      { daysAgo: 1, pain: 6, duration: 180, notes: 'Throbbing frontal headache, improved after dark room rest and cold compress.' },
      { daysAgo: 4, pain: 4, duration: 90, notes: 'Mild tension headache from prolonged desk posture and screen glare.' },
      { daysAgo: 8, pain: 8, duration: 300, notes: 'Severe migraine with visual aura and photophobia. Took prescribed sumatriptan.' },
      { daysAgo: 13, pain: 3, duration: 60, notes: 'Dehydration headache following morning run.' },
      { daysAgo: 17, pain: 7, duration: 240, notes: 'Throbbing right temple pain, triggered by sudden weather pressure drop.' },
      { daysAgo: 22, pain: 5, duration: 120, notes: 'Sinus pressure across forehead and cheekbones.' },
      { daysAgo: 27, pain: 9, duration: 420, notes: 'Severe debilitating migraine with nausea. Required bed rest all afternoon.' },
      { daysAgo: 33, pain: 4, duration: 90, notes: 'Afternoon tension headache following quarterly review meeting.' },
      { daysAgo: 38, pain: 6, duration: 150, notes: 'Dull ache radiating from cervical neck area to occipital region.' },
      { daysAgo: 44, pain: 8, duration: 360, notes: 'Intense migraine, sensitivity to loud sound and sunlight.' },
      { daysAgo: 49, pain: 3, duration: 45, notes: 'Caffeine withdrawal headache from skipping morning coffee.' },
      { daysAgo: 55, pain: 5, duration: 120, notes: 'Stress headache before client presentation.' },
      { daysAgo: 61, pain: 7, duration: 240, notes: 'Pulsating migraine after restless sleep.' },
      { daysAgo: 67, pain: 4, duration: 90, notes: 'Mid-afternoon eye strain headache.' },
      { daysAgo: 74, pain: 8, duration: 300, notes: 'Severe migraine episode, throbbing behind left eye socket.' },
      { daysAgo: 79, pain: 2, duration: 30, notes: 'Brief tension ache relieved by hydration and stretching.' },
      { daysAgo: 85, pain: 6, duration: 180, notes: 'Frontal headache after disrupted sleep and skipping lunch.' },
    ];

    const seedData = seedTemplates.map((template) => {
      const entryDate = new Date(now);
      entryDate.setDate(entryDate.getDate() - template.daysAgo);
      const dateString = entryDate.toISOString().split('T')[0];

      return {
        date: dateString,
        painSeverity: template.pain,
        durationMinutes: template.duration,
        notes: template.notes,
      };
    });

    const createdEntries = await this.repository.saveMany(seedData);
    return {
      count: createdEntries.length,
      entries: createdEntries,
    };
  }
}
