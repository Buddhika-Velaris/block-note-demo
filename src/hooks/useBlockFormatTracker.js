import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track formatting styles on a per-block basis
 * 
 * @param {Object} editor - The BlockNote editor instance
 * @returns {Object} An object containing formatting state and utility functions
 */
export const useBlockFormatTracker = (editor) => {
  // State to track formatting styles per block
  const [blockStyles, setBlockStyles] = useState({});
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
  
  // Use a ref to track if a style was just applied
  const styleJustApplied = useRef(false);
  // Track if typing started after style applied
  const typingStarted = useRef(false);

  // Update styles when editor selection or content changes
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
        
        // Reset active styles when changing blocks AND a style wasn't just applied
        if (!styleJustApplied.current) {
          setActiveStyles({
            bold: false,
            italic: false,
            underline: false,
            strike: false,
            code: false,
            link: false,
            textColor: null,
            backgroundColor: null,
          });
        }
        
        // Reset the flag
        styleJustApplied.current = false;
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
      
      // Store styles for this block
      setBlockStyles(prev => ({
        ...prev,
        [currentBlockId]: updatedActiveStyles
      }));
      
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
    
    // Subscribe to editor selection changes specifically to track block changes
    const unsubscribeFromSelection = editor.onSelectionChange(() => {
      handleEditorChange();
    });
    
    // Subscribe to general editor changes for content updates
    const unsubscribeFromChanges = editor.onChange(() => {
      // Check if this is a typing event (content change)
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
    
    // Set flag to indicate we're actively applying a style
    styleJustApplied.current = true;
    
    // For boolean toggle styles like bold, italic, etc.
    if (typeof value === 'boolean' && 
        (style === 'bold' || style === 'italic' || 
         style === 'underline' || style === 'strike' || 
         style === 'code')) {
      
      // Get current actual style state
      const currentState = activeStyles[style];
      
      // Toggle the temporary button state for immediate feedback
      // If current state is true, toggling will turn it off (false)
      // If current state is false, toggling will turn it on (true)
      setTemporaryButtonState(prev => ({
        ...prev,
        [style]: !currentState // Base toggle on actual style, not previous temporary state
      }));
      
      // Now apply the style to editor
      editor.toggleStyles({ [style]: value });
    } 
    // For value styles like colors
    else {
      // Update UI state BEFORE applying to editor for immediate feedback
      setActiveStyles(prev => ({
        ...prev,
        [style]: value
      }));
      
      // Update block styles tracking
      setBlockStyles(prev => ({
        ...prev,
        [activeBlockId]: {
          ...prev[activeBlockId] || {},
          [style]: value
        }
      }));
      
      // Now apply the style to editor
      editor.toggleStyles({ [style]: value });
    }
    
    // Set timeout to ensure state is accurate after editor processes the change
    setTimeout(() => {
      const updatedStyles = editor.getActiveStyles();
      const updatedValue = style in updatedStyles ? updatedStyles[style] : false;
      
      setActiveStyles(prev => ({
        ...prev,
        [style]: updatedValue
      }));
      
      setBlockStyles(prev => ({
        ...prev,
        [activeBlockId]: {
          ...prev[activeBlockId] || {},
          [style]: updatedValue
        }
      }));
      
      styleJustApplied.current = false;
    }, 50);
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

  /**
   * Get formatting status for a specific block
   * @param {string} blockId - The ID of the block to check
   * @param {string} style - The style to check ('bold', 'italic', etc.)
   * @returns {boolean|string|null} The style value
   */
  const getBlockStyle = (blockId, style) => {
    if (!blockId || !blockStyles[blockId]) return null;
    return blockStyles[blockId][style];
  };

  /**
   * Check if a style is active in the current selection
   * @param {string} style - The style to check
   * @returns {boolean|string|null} The style value
   */
  const isStyleActive = (style) => {
    return activeStyles[style];
  };

  /**
   * Insert text with the currently active formatting at cursor position
   * @param {string} text - The text to insert
   */
  const insertFormattedText = (text) => {
    if (!editor || !activeBlockId || !text) return;
    
    // Get current formatting from active block
    const currentFormatting = blockStyles[activeBlockId] || {};
    
    // Create a text node with the current formatting
    const textNode = {
      type: "text",
      text: text,
      styles: {}
    };
    
    // Apply all active styles to the node
    Object.entries(currentFormatting).forEach(([style, value]) => {
      if (value) {
        textNode.styles[style] = value;
      }
    });
    
    // Insert the formatted text at cursor position
    editor.insertNodes([textNode]);
  };

  return {
    activeStyles,
    blockStyles,
    activeBlockId,
    applyStyle,
    getBlockStyle,
    isStyleActive,
    isButtonActive,
    insertFormattedText
  };
};