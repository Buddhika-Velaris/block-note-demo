import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Button, Modal, Input, Select } from "antd";
import { useState, useEffect, useRef } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { createPortal } from "react-dom";

import "../App.css";

// Global state for managing the dialog
const dialogState = {
  listeners: [],
  isOpen: false,
  blockId: null,
  title: "",
  currentText: "",
  onSave: null,

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },

  openDialog(blockId, title, currentText, onSave) {
    this.isOpen = true;
    this.blockId = blockId;
    this.title = title;
    this.currentText = currentText;
    this.onSave = onSave;
    this.notifyListeners();
  },

  closeDialog() {
    this.isOpen = false;
    this.notifyListeners();
  },

  saveDialog(text) {
    if (this.onSave) {
      this.onSave(text);
    }
    this.closeDialog();
  },

  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
};

// Modal Dialog component that will be rendered at the root level
const CenterModal = () => {
  const [isOpen, setIsOpen] = useState(dialogState.isOpen);
  const [title, setTitle] = useState(dialogState.title);
  const [inputText, setInputText] = useState(dialogState.currentText);

  useEffect(() => {
    const unsubscribe = dialogState.subscribe(() => {
      setIsOpen(dialogState.isOpen);
      setTitle(dialogState.title);
      setInputText(dialogState.currentText);
    });
    return unsubscribe;
  }, []);

  // Find root element for portal
  const targetElement = document.body;

  if (!targetElement || !isOpen) return null;

  return createPortal(
    <Modal
      open={isOpen}
      onCancel={() => dialogState.closeDialog()}
      title={title || "Enter Information"}
      centered
      footer={[
        <Button key="cancel" onClick={() => dialogState.closeDialog()}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={() => dialogState.saveDialog(inputText)}>
          Save
        </Button>
      ]}
      className="center-modal-dialog"
    >
      <Input.TextArea
        placeholder="Type your text here"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        autoSize={{ minRows: 3, maxRows: 6 }}
        style={{ marginBottom: 16 }}
        autoFocus
      />
      <Select
        defaultValue="volvo"
        style={{ width: '100%' }}
        options={[
          { value: 'volvo', label: 'Volvo' },
          { value: 'saab', label: 'Saab' },
          { value: 'mercedes', label: 'Mercedes' },
          { value: 'audi', label: 'Audi' }
        ]}
      />
    </Modal>,
    targetElement
  );
};

// Initialize the modal
let modalInitialized = false;
const initializeModal = () => {
  if (modalInitialized) return;
  modalInitialized = true;
};

// The Dialog block for user input
export const DialogBlock = createReactBlockSpec(
  {
    type: "dialog",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      title: {
        default: "Enter Information",
      },
      dialogText: {
        default: "",
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const [, setForceUpdate] = useState({});
      const buttonRef = useRef(null);
      
      useEffect(() => {
        initializeModal();
        
        // Subscribe to dialog state changes
        const unsubscribe = dialogState.subscribe(() => {
          setForceUpdate({});
        });
        
        return unsubscribe;
      }, []);

      const handleOpenDialog = () => {
        dialogState.openDialog(
          props.block.id, 
          props.block.props.title || "Enter Information", 
          props.block.props.dialogText || "", 
          (newText) => {
            // Update the block with the new text
            props.editor.updateBlock(props.block, {
              type: "dialog",
              props: {
                ...props.block.props,
                dialogText: newText,
              },
            });
          }
        );
      };

      return (
        <div className="dialog-block">
          {/* Dialog button to open the input form */}
          <div className="dialog-button-wrapper" contentEditable={false}>
            <Button 
              ref={buttonRef}
              icon={<MessageOutlined />}
              onClick={handleOpenDialog}
              type="default"
            >
              {props.block.props.title || "Enter Information"}
            </Button>
          </div>

          {/* Current text display area */}
          <div className="dialog-content">
            {props.block.props.dialogText ? (
              <div className="dialog-text">{props.block.props.dialogText}</div>
            ) : (
              <div className="dialog-placeholder">No text entered yet. Click the button to add text.</div>
            )}
          </div>

          {/* Modal dialog component */}
          <CenterModal />

          {/* Hidden content ref for BlockNote */}
          <div className="hidden-content" ref={props.contentRef} />
        </div>
      );
    },
  }
);