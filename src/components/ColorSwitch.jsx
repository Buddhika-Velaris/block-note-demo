import {
    useBlockNoteEditor,
    useComponentsContext,
    useEditorContentOrSelectionChange,
  } from "@blocknote/react";
  import "@blocknote/mantine/style.css";
  import { useState } from "react";
  import { Popover, Tabs } from "antd";
  import { BgColorsOutlined, FontColorsOutlined } from "@ant-design/icons";


const colorOptions = [
  { color: "blue", label: "Blue" },
  { color: "red", label: "Red" },
  { color: "green", label: "Green" },
  { color: "yellow", label: "Yellow" },
  { color: "purple", label: "Purple" },
  { color: "orange", label: "Orange" },
  { color: "pink", label: "Pink" },
  { color: "black", label: "Black" },
  { color: "gray", label: "Gray" },
];

export function ColorButton() {
    const editor = useBlockNoteEditor();
    const Components = useComponentsContext();
    const [popoverVisible, setPopoverVisible] = useState(false);

    const [activeTextColor, setActiveTextColor] = useState(null);
    const [activeBackgroundColor, setActiveBackgroundColor] = useState(null);
   

    const selectedText = editor.getSelectedText();
    // Updates state on content or selection change
    useEditorContentOrSelectionChange(() => {
      const styles = editor.getActiveStyles();
      setActiveTextColor(styles.textColor || null);
      setActiveBackgroundColor(styles.backgroundColor || null);
    }, editor);
    
    // Apply text color and close menu
    const applyTextColor = (color) => {
      editor.toggleStyles({
        textColor: color,
      });
      setPopoverVisible(false);
    };
    
    // Apply background color and close menu
    const applyBackgroundColor = (color) => {
      editor.toggleStyles({
        backgroundColor: color,
      });
      setPopoverVisible(false);
    };


    // Color picker content
    const colorPickerContent = (
      <div style={{ width: 250 }}>
        <Tabs
          defaultActiveKey="text"
          items={[
            {
              key: 'text',
              label: (
                <span>
                  <FontColorsOutlined />
                  Text Color
                </span>
              ),
              children: (
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: "8px" }}>
                    {colorOptions.map((option) => (
                      <div
                        key={option.color}
                        onClick={() => applyTextColor(option.color)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 4,
                          cursor: 'pointer',
                          backgroundColor: option.color,
                          border: '1px solid #d9d9d9',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: activeTextColor === option.color ? '0 0 0 2px #1890ff' : 'none'
                        }}
                        title={option.label}
                      />
                    ))}
                  </div>
                  
                  
                </div>
              ),
            },
            {
              key: 'background',
              label: (
                <span>
                  <BgColorsOutlined />
                  Background Color
                </span>
              ),
              children: (
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: "8px" }}>
                    {colorOptions.map((option) => (
                      <div
                        key={option.color}
                        onClick={() => applyBackgroundColor(option.color)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 4,
                          cursor: 'pointer',
                          backgroundColor: option.color,
                          border: '1px solid #d9d9d9',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: activeBackgroundColor === option.color ? '0 0 0 2px #1890ff' : 'none'
                        }}
                        title={option.label}
                      />
                    ))}
                  </div>
                  
                 
                </div>
              ),
            },
          ]}
        />
      </div>
    );
   

    if(!selectedText) {
      return;
    }
    
    
    return (
      <Components.FormattingToolbar.Button
        mainTooltip={"Color Options"}
        isSelected={!!activeTextColor || !!activeBackgroundColor}
        onClick={() => setPopoverVisible(!popoverVisible)}>
        <Popover
          content={colorPickerContent}
          trigger="click"
          open={popoverVisible}
          onOpenChange={setPopoverVisible}
          placement="bottom"
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FontColorsOutlined style={{ marginRight: 4 }} />
            <BgColorsOutlined style={{ marginRight: 4 }} />
            <span>Colors</span>
          </div>
        </Popover>
      </Components.FormattingToolbar.Button>
    );
}