import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  STORAGE_KEY,
  getAllNotes,
  saveAllNotes,
  formatNotesForClipboard,
  getNoteForStory,
  saveNoteForStory,
  deleteNoteForStory,
  clearAllNotes,
  getNotesCount,
  type NotesMap,
} from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getAllNotes', () => {
    it('returns empty object when localStorage is empty', () => {
      expect(getAllNotes()).toEqual({});
    });

    it('returns parsed notes from localStorage', () => {
      const notes: NotesMap = {
        'button--primary': {
          note: 'Looks good',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

      expect(getAllNotes()).toEqual(notes);
    });

    it('returns empty object on invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      expect(getAllNotes()).toEqual({});
    });
  });

  describe('saveAllNotes', () => {
    it('saves notes to localStorage', () => {
      const notes: NotesMap = {
        'card--default': {
          note: 'Add shadow variant',
          updatedAt: '2024-01-01T00:00:00.000Z',
          storyTitle: 'Card/Default',
        },
      };

      saveAllNotes(notes);

      expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(notes));
    });

    it('overwrites existing notes', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ old: { note: 'old' } }));

      const newNotes: NotesMap = { new: { note: 'new', updatedAt: '2024-01-01' } };
      saveAllNotes(newNotes);

      expect(getAllNotes()).toEqual(newNotes);
    });
  });

  describe('formatNotesForClipboard', () => {
    it('returns message when no notes', () => {
      expect(formatNotesForClipboard({})).toBe('No notes to copy.');
    });

    it('formats single note as markdown', () => {
      const notes: NotesMap = {
        'button--primary': {
          note: 'Looks good',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      };

      const result = formatNotesForClipboard(notes);

      expect(result).toContain('## Storybook Feedback');
      expect(result).toContain('### button--primary');
      expect(result).toContain('Looks good');
    });

    it('formats multiple notes as markdown', () => {
      const notes: NotesMap = {
        'button--primary': {
          note: 'Button feedback',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        'card--default': {
          note: 'Card feedback',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      };

      const result = formatNotesForClipboard(notes);

      expect(result).toContain('## Storybook Feedback');
      expect(result).toContain('### button--primary');
      expect(result).toContain('Button feedback');
      expect(result).toContain('### card--default');
      expect(result).toContain('Card feedback');
    });

    it('preserves multiline notes', () => {
      const notes: NotesMap = {
        'story-id': {
          note: 'Line 1\nLine 2\nLine 3',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      };

      const result = formatNotesForClipboard(notes);

      expect(result).toContain('Line 1\nLine 2\nLine 3');
    });
  });

  describe('getNoteForStory', () => {
    it('returns undefined when no note exists', () => {
      expect(getNoteForStory('nonexistent')).toBeUndefined();
    });

    it('returns note data for existing story', () => {
      const noteData = {
        note: 'Test note',
        updatedAt: '2024-01-01T00:00:00.000Z',
        storyTitle: 'Test Story',
      };
      saveAllNotes({ 'story-id': noteData });

      expect(getNoteForStory('story-id')).toEqual(noteData);
    });
  });

  describe('saveNoteForStory', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('saves new note for story', () => {
      saveNoteForStory('story-id', 'My note', 'Story Title');

      const saved = getNoteForStory('story-id');
      expect(saved?.note).toBe('My note');
      expect(saved?.storyTitle).toBe('Story Title');
      expect(saved?.updatedAt).toBe('2024-06-15T12:00:00.000Z');
    });

    it('trims whitespace from note', () => {
      saveNoteForStory('story-id', '  Padded note  ');

      expect(getNoteForStory('story-id')?.note).toBe('Padded note');
    });

    it('deletes note when empty string provided', () => {
      saveNoteForStory('story-id', 'Initial note');
      expect(getNoteForStory('story-id')).toBeDefined();

      saveNoteForStory('story-id', '');
      expect(getNoteForStory('story-id')).toBeUndefined();
    });

    it('deletes note when whitespace-only string provided', () => {
      saveNoteForStory('story-id', 'Initial note');

      saveNoteForStory('story-id', '   ');
      expect(getNoteForStory('story-id')).toBeUndefined();
    });

    it('updates existing note', () => {
      saveNoteForStory('story-id', 'First note');
      saveNoteForStory('story-id', 'Updated note');

      expect(getNoteForStory('story-id')?.note).toBe('Updated note');
    });
  });

  describe('deleteNoteForStory', () => {
    it('removes note for specified story', () => {
      saveAllNotes({
        'story-1': { note: 'Note 1', updatedAt: '2024-01-01' },
        'story-2': { note: 'Note 2', updatedAt: '2024-01-01' },
      });

      deleteNoteForStory('story-1');

      expect(getNoteForStory('story-1')).toBeUndefined();
      expect(getNoteForStory('story-2')).toBeDefined();
    });

    it('does nothing if story does not exist', () => {
      saveAllNotes({ 'story-1': { note: 'Note 1', updatedAt: '2024-01-01' } });

      deleteNoteForStory('nonexistent');

      expect(getNotesCount()).toBe(1);
    });
  });

  describe('clearAllNotes', () => {
    it('removes all notes', () => {
      saveAllNotes({
        'story-1': { note: 'Note 1', updatedAt: '2024-01-01' },
        'story-2': { note: 'Note 2', updatedAt: '2024-01-01' },
        'story-3': { note: 'Note 3', updatedAt: '2024-01-01' },
      });

      clearAllNotes();

      expect(getAllNotes()).toEqual({});
      expect(getNotesCount()).toBe(0);
    });
  });

  describe('getNotesCount', () => {
    it('returns 0 when no notes', () => {
      expect(getNotesCount()).toBe(0);
    });

    it('returns correct count', () => {
      saveAllNotes({
        'story-1': { note: 'Note 1', updatedAt: '2024-01-01' },
        'story-2': { note: 'Note 2', updatedAt: '2024-01-01' },
      });

      expect(getNotesCount()).toBe(2);
    });
  });
});
