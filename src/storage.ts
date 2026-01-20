/**
 * Storage utilities for managing scratchpad notes.
 * Pure functions that handle localStorage persistence and formatting.
 */

export const STORAGE_KEY = 'storybook-scratchpad-notes';

export interface NoteData {
  note: string;
  updatedAt: string;
  storyTitle?: string;
}

export interface NotesMap {
  [storyId: string]: NoteData;
}

/**
 * Retrieve all notes from localStorage.
 * Returns empty object if no notes exist or on parse error.
 */
export function getAllNotes(): NotesMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save all notes to localStorage.
 */
export function saveAllNotes(notes: NotesMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/**
 * Format notes as markdown for clipboard export.
 * Groups notes by story ID with headers.
 */
export function formatNotesForClipboard(notes: NotesMap): string {
  const entries = Object.entries(notes);
  if (entries.length === 0) {
    return 'No notes to copy.';
  }

  const lines = ['## Storybook Feedback', ''];
  for (const [storyId, data] of entries) {
    lines.push(`### ${storyId}`);
    lines.push(data.note);
    lines.push('');
  }
  return lines.join('\n');
}

/**
 * Get note for a specific story.
 * Returns undefined if no note exists.
 */
export function getNoteForStory(storyId: string): NoteData | undefined {
  const allNotes = getAllNotes();
  return allNotes[storyId];
}

/**
 * Save note for a specific story.
 * If note is empty/whitespace, removes the entry.
 */
export function saveNoteForStory(
  storyId: string,
  note: string,
  storyTitle?: string
): void {
  const allNotes = getAllNotes();

  if (note.trim()) {
    allNotes[storyId] = {
      note: note.trim(),
      updatedAt: new Date().toISOString(),
      storyTitle,
    };
  } else {
    delete allNotes[storyId];
  }

  saveAllNotes(allNotes);
}

/**
 * Delete note for a specific story.
 */
export function deleteNoteForStory(storyId: string): void {
  const allNotes = getAllNotes();
  delete allNotes[storyId];
  saveAllNotes(allNotes);
}

/**
 * Clear all notes.
 */
export function clearAllNotes(): void {
  saveAllNotes({});
}

/**
 * Get count of all notes.
 */
export function getNotesCount(): number {
  return Object.keys(getAllNotes()).length;
}
