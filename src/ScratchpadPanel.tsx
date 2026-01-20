import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStorybookState } from 'storybook/internal/manager-api';
import { styled } from 'storybook/internal/theming';
import {
  getAllNotes,
  saveAllNotes,
  formatNotesForClipboard,
  getNotesCount,
} from './storage';

const Container = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.color.defaultText};
`;

const StoryId = styled.code`
  font-size: 10px;
  color: ${props => props.theme.color.mediumdark};
  background: ${props => props.theme.background.hoverable};
  padding: 2px 6px;
  border-radius: 3px;
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 120px;
  padding: 12px;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
  border: 1px solid ${props => props.theme.appBorderColor};
  border-radius: 4px;
  background: ${props => props.theme.input.background};
  color: ${props => props.theme.input.color};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.color.secondary};
  }

  &::placeholder {
    color: ${props => props.theme.color.mediumdark};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;

  ${props =>
    props.variant === 'primary'
      ? `
    background: ${props.theme.color.secondary};
    color: white;
    border: none;
    &:hover {
      background: ${props.theme.color.positive};
    }
  `
      : props.variant === 'danger'
        ? `
    background: transparent;
    color: ${props.theme.color.negative};
    border: 1px solid ${props.theme.color.negative};
    &:hover {
      background: ${props.theme.color.negative};
      color: white;
    }
  `
        : `
    background: transparent;
    color: ${props.theme.color.defaultText};
    border: 1px solid ${props.theme.appBorderColor};
    &:hover {
      background: ${props.theme.background.hoverable};
    }
  `}
`;

const StatusText = styled.span<{ type?: 'success' | 'info' }>`
  font-size: 11px;
  color: ${props =>
    props.type === 'success' ? props.theme.color.positive : props.theme.color.mediumdark};
`;

const InfoText = styled.p`
  font-size: 11px;
  color: ${props => props.theme.color.mediumdark};
  margin: 0;
`;

const NotesCount = styled.span`
  font-size: 11px;
  color: ${props => props.theme.color.mediumdark};
  background: ${props => props.theme.background.hoverable};
  padding: 2px 8px;
  border-radius: 10px;
`;

export const ScratchpadPanel: React.FC = () => {
  const state = useStorybookState();
  const storyId = state?.storyId || '';
  const storyTitle = state?.path || storyId;

  const [note, setNote] = useState('');
  const [status, setStatus] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const [notesCount, setNotesCount] = useState(0);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update notes count
  const updateNotesCount = useCallback(() => {
    setNotesCount(getNotesCount());
  }, []);

  // Load note for current story
  useEffect(() => {
    if (storyId) {
      const allNotes = getAllNotes();
      const storedNote = allNotes[storyId]?.note || '';
      setNote(storedNote);
      updateNotesCount();
    }
  }, [storyId, updateNotesCount]);

  // Show status temporarily
  const showStatus = useCallback((text: string, type: 'success' | 'info' = 'success') => {
    setStatus({ text, type });
    setTimeout(() => setStatus(null), 2000);
  }, []);

  // Save note (can be called with custom note value for debounced saves)
  const saveNote = useCallback(
    (noteValue: string, silent = false) => {
      if (!storyId) return;

      const allNotes = getAllNotes();

      if (noteValue.trim()) {
        allNotes[storyId] = {
          note: noteValue.trim(),
          updatedAt: new Date().toISOString(),
          storyTitle,
        };
      } else {
        delete allNotes[storyId];
      }

      saveAllNotes(allNotes);
      updateNotesCount();
      if (!silent) {
        showStatus('Saved');
      }
    },
    [storyId, storyTitle, updateNotesCount, showStatus]
  );

  // Handle text change with debounced auto-save
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setNote(newValue);

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounced save after 500ms of no typing
      saveTimeoutRef.current = setTimeout(() => {
        saveNote(newValue, true); // Silent save (no status message during typing)
      }, 500);
    },
    [saveNote]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Save immediately on blur (cancels debounce)
  const handleBlur = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveNote(note);
  }, [saveNote, note]);

  // Clear current story's note
  const handleClear = useCallback(() => {
    if (!storyId) return;
    setNote('');
    const allNotes = getAllNotes();
    delete allNotes[storyId];
    saveAllNotes(allNotes);
    updateNotesCount();
    showStatus('Cleared');
  }, [storyId, updateNotesCount, showStatus]);

  // Clear all notes
  const handleClearAll = useCallback(() => {
    if (confirm('Clear ALL notes from all stories?')) {
      saveAllNotes({});
      setNote('');
      updateNotesCount();
      showStatus('All notes cleared');
    }
  }, [updateNotesCount, showStatus]);

  // Copy all notes to clipboard
  const handleCopyAll = useCallback(async () => {
    // Save current note first
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveNote(note, true);

    const allNotes = getAllNotes();
    const text = formatNotesForClipboard(allNotes);

    try {
      await navigator.clipboard.writeText(text);
      showStatus('Copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showStatus('Copied to clipboard!');
    }
  }, [saveNote, note, showStatus]);

  if (!storyId) {
    return (
      <Container>
        <InfoText>Select a story to add notes.</InfoText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Scratchpad</Title>
        <StoryId>{storyId}</StoryId>
      </Header>

      <TextArea
        value={note}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Add feedback or notes for this story...&#10;&#10;Notes auto-save as you type. Use Copy All to paste into chat."
      />

      <ButtonRow>
        {status && <StatusText type={status.type}>{status.text}</StatusText>}
        <Spacer />
        {notesCount > 0 && (
          <NotesCount>
            {notesCount} note{notesCount !== 1 ? 's' : ''}
          </NotesCount>
        )}
        <Button onClick={handleClear}>Clear</Button>
        <Button variant="danger" onClick={handleClearAll}>
          Clear All
        </Button>
        <Button variant="primary" onClick={handleCopyAll}>
          Copy All
        </Button>
      </ButtonRow>

      <InfoText>
        Notes auto-save as you type. Click &quot;Copy All&quot; to copy all notes to clipboard.
      </InfoText>
    </Container>
  );
};

export default ScratchpadPanel;
