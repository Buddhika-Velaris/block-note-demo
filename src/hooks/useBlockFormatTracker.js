import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track formatting styles on a per-block basis
 * 
 * @param {Object} editor - The BlockNote editor instance
 * @returns {Object} An object containing formatting state and utility functions
 */
export const useBlockFormatTracker = (editor) => {
  // State to track formatting styles per block

  // Track currently active block
  const [activeBlockId, setActiveBlockId] = useState(null);
  // Track active styles for the current selection
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    code: false,
    link: false,
    textColor: null,
    backgroundColor: null,
  });
  
  // Separate state for temporary button UI state
  const [temporaryButtonState, setTemporaryButtonState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    code: false,
  });
  
  // Track if typing started after style applied
  const typingStarted = useRef(false);


  useEffect(() => {
    if (!editor) return;

    const handleEditorChange = () => {
      // Get current block and position
      const cursorPosition = editor.getTextCursorPosition();
      if (!cursorPosition || !cursorPosition.block) return;
      
      const currentBlockId = cursorPosition.block.id;
      
      // If the block changed, update active block ID and reset temporary button state
      if (currentBlockId !== activeBlockId) {
        setActiveBlockId(currentBlockId);
        
        // Reset temporary button state whenever block changes
        setTemporaryButtonState({
          bold: false,
          italic: false,
          underline: false,
          strike: false,
          code: false,
        });
      }
      
      // Get active styles from editor
      const styles = editor.getActiveStyles();
      
      // Update active styles for current selection
      const updatedActiveStyles = {
        bold: !!styles.bold,
        italic: !!styles.italic,
        underline: !!styles.underline,
        strike: !!styles.strike,
        code: !!styles.code,
        link: !!styles.link,
        textColor: styles.textColor || null,
        backgroundColor: styles.backgroundColor || null,
      };
      
      setActiveStyles(updatedActiveStyles);

      
      // If typing has started, clear temporary button state
      if (typingStarted.current) {
        setTemporaryButtonState({
          bold: false,
          italic: false,
          underline: false,
          strike: false,
          code: false,
        });
        typingStarted.current = false;
      }
    };
    
    // Subscribe to editor selection and content changes
    const unsubscribeFromSelection = editor.onSelectionChange(handleEditorChange);
    const unsubscribeFromChanges = editor.onChange(() => {
      if (editor.selection) {
        typingStarted.current = true;
      }
      handleEditorChange();
    });
    
    // Initial call to set styles
    handleEditorChange();
    
    return () => {
      unsubscribeFromSelection();
      unsubscribeFromChanges();
    };
  }, [editor, activeBlockId]);

  /**
   * Apply a style to the current selection and update the tracked styles
   * @param {string} style - The style to toggle ('bold', 'italic', etc.)
   * @param {any} value - The value for the style (true for toggles, color value for colors)
   */
  const applyStyle = (style, value = true) => {
    if (!editor || !activeBlockId) return;
    
    // For boolean toggle styles like bold, italic, etc.
    if (typeof value === 'boolean' && 
        (style === 'bold' || style === 'italic' || 
         style === 'underline' || style === 'strike' || 
         style === 'code')) {
      
      // Get current actual style state
      const currentState = activeStyles[style];
      
      // Toggle the temporary button state for immediate feedback
      setTemporaryButtonState(prev => ({
        ...prev,
        [style]: !currentState // Base toggle on actual style, not previous temporary state
      }));
    }
    
    // Apply the style to editor - will trigger onChange events
    editor.toggleStyles({ [style]: value });
  };

  /**
   * Check if a style button should appear active in the UI
   * @param {string} style - The style to check
   * @returns {boolean} Whether the button should appear active
   */
  const isButtonActive = (style) => {
    // For styles that have temporary button state, use that first
    if (style in temporaryButtonState && temporaryButtonState[style]) {
      return true;
    }
    
    // Otherwise fall back to actual active styles
    return activeStyles[style];
  };


  return {
    activeStyles,
    applyStyle,
    isButtonActive,

  };
};