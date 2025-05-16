import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Button, Modal, Input, Select } from "antd";
import { useState } from "react";
import { MessageOutlined } from "@ant-design/icons";

import "../App.css";

const DialogComponent = ({ block, editor, contentRef }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  
  const handleOpenDialog = () => {
    setInputText(block.props.dialogText || "");
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  const handleSaveDialog = () => {
    editor.updateBlock(block, {
      type: "dialog",
      props: {
        ...block.props,
        dialogText: inputText,
      },
    });
    
    setIsDialogOpen(false);
  };

  return (
    <div className="dialog-block">
      <div className="dialog-button-wrapper" contentEditable={false}>
        <Button 
          icon={<MessageOutlined />}
          onClick={handleOpenDialog}
          type="default"
        >
          {block.props.title || "Enter Information"}
        </Button>
      </div>

      <div className="dialog-content">
        {block.props.dialogText ? (
          <div className="dialog-text">{block.props.dialogText}</div>
        ) : (
          <div className="dialog-placeholder">No text entered yet. Click the button to add text.</div>
        )}
      </div>
      <Modal
        open={isDialogOpen}
        onCancel={handleCloseDialog}
        title={block.props.title || "Enter Information"}
        centered
        footer={[
          <Button key="cancel" onClick={handleCloseDialog}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveDialog}>
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
      </Modal>


      <div className="hidden-content" ref={contentRef} />
    </div>
  );
};


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
      return <DialogComponent {...props} />;
    },
  }
);
