import { Button, Dropdown, Tooltip, Menu, Divider, Upload, Popover } from "antd";
import { useState, useRef } from "react";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  LinkOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  CodeOutlined,
  PictureOutlined,
  TableOutlined,
  SmileOutlined,
  MoreOutlined,
  CheckOutlined,
  DownOutlined,
  PlusSquareOutlined,
  ColumnWidthOutlined,
  BgColorsOutlined,
  FontColorsOutlined,
} from "@ant-design/icons";

export const ConfluenceToolbar = ({ editor }) => {
  const [blockType, setBlockType] = useState("paragraph");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  
  // Color options for text and background
  const colorOptions = [
    { color: "default", label: "Default" },
    { color: "black", label: "Black" },
    { color: "gray", label: "Gray" },
    { color: "brown", label: "Brown" },
    { color: "orange", label: "Orange" },
    { color: "yellow", label: "Yellow" },
    { color: "green", label: "Green" },
    { color: "blue", label: "Blue" },
    { color: "purple", label: "Purple" },
    { color: "pink", label: "Pink" },
    { color: "red", label: "Red" },
  ];
  
  // Format options for block types
  const formatOptions = [
    { value: "paragraph", label: "Normal text" },
    { value: "heading", label: "Heading 1" },
    { value: "h2", label: "Heading 2" },
    { value: "h3", label: "Heading 3" },
    { value: "h4", label: "Heading 4" },
    { value: "codeBlock", label: "Code block" },
    { value: "bulletListItem", label: "Bullet list" },
    { value: "numberedListItem", label: "Numbered list" },
    { value: "alert", label: "Alert" },
    { value: "dialog", label: "Dialog" },
  ];

  // Handle block type change
  const handleBlockTypeChange = (value) => {
    setBlockType(value);
    if (editor) {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        type: value,
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file || !editor) return false;
    
    try {
      setIsImageUploading(true);
      // Upload using the editor's upload function
      const url = await editor.uploadFile(file);
      
      // Insert the image at the current cursor position
      if (url) {
        editor.insertBlocks(
          [
            {
              type: "image",
              props: {
                url,
                caption: file.name,
                width: "100%",
              },
            },
          ],
          editor.getTextCursorPosition().block,
          "after"
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // You could show an error notification here
    } finally {
      setIsImageUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  // Apply text formatting
  const applyFormat = (format) => {
    if (!editor) return;
    
    switch (format) {
      case "bold":
        editor.toggleStyles({ bold: true });
        break;
      case "italic":
        editor.toggleStyles({ italic: true });
        break;
      case "underline":
        editor.toggleStyles({ underline: true });
        break;
      case "strike":
        editor.toggleStyles({ strike: true });
        break;
      case "code":
        editor.toggleStyles({ code: true });
        break;
      case "link":
        // Get selected text
        const selection = editor.getSelectedText();
        // Show link dialog in production app
        const url = prompt("Enter URL:", "https://");
        if (url) {
          editor.toggleStyles({ link: url });
        }
        break;
      case "bulletList":
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: "bulletListItem",
        });
        break;
      case "numberedList":
        editor.updateBlock(editor.getTextCursorPosition().block, {
          type: "numberedListItem",
        });
        break;
      case "table":
        // Insert a simple 2x2 table
        editor.insertBlocks(
          [
            {
              type: "table",
              content: [
                {
                  type: "tableRow",
                  content: [
                    { type: "tableCell", content: [{ type: "paragraph", content: "Header 1" }] },
                    { type: "tableCell", content: [{ type: "paragraph", content: "Header 2" }] },
                  ],
                },
                {
                  type: "tableRow",
                  content: [
                    { type: "tableCell", content: [{ type: "paragraph", content: "Cell 1" }] },
                    { type: "tableCell", content: [{ type: "paragraph", content: "Cell 2" }] },
                  ],
                },
              ],
            },
          ],
          editor.getTextCursorPosition().block,
          "after"
        );
        break;
      default:
        break;
    }
  };
  
  // Apply text color
  const applyTextColor = (color) => {
    if (!editor) return;
    
    if (color === "default") {
      // Remove text color
      editor.removeStyles(["textColor"]);
    } else {
      editor.toggleStyles({ textColor: color });
    }
    
    setColorPickerVisible(false);
  };
  
  // Apply background color
  const applyBackgroundColor = (color) => {
    if (!editor) return;
    
    if (color === "default") {
      // Remove background color
      editor.removeStyles(["backgroundColor"]);
    } else {
      editor.toggleStyles({ backgroundColor: color });
    }
    
    setColorPickerVisible(false);
  };

  // Get current block type for select
  const getCurrentBlockType = () => {
    if (!editor) return "paragraph";
    
    const currentBlock = editor.getTextCursorPosition().block;
    return currentBlock?.type || "paragraph";
  };

  // Helper to determine if the current selection has a specific style
  const isStyleActive = (style) => {
    if (!editor) return false;
    const styles = editor.getActiveStyles();
    return !!styles[style];
  };
  
  // Helper to get active text color
  const getActiveTextColor = () => {
    if (!editor) return null;
    const styles = editor.getActiveStyles();
    return styles.textColor || null;
  };
  
  // Helper to get active background color
  const getActiveBackgroundColor = () => {
    if (!editor) return null;
    const styles = editor.getActiveStyles();
    return styles.backgroundColor || null;
  };

  // Create dropdown menu for block types
  const blockTypeMenu = (
    <Menu
      onClick={({ key }) => handleBlockTypeChange(key)}
      items={formatOptions.map(option => ({
        key: option.value,
        label: option.label,
        icon: option.value === getCurrentBlockType() ? <CheckOutlined /> : null,
      }))}
    />
  );

  // More options menu
  const moreMenu = (
    <Menu
      items={[
        {
          key: 'formatting',
          type: 'group',
          label: 'Additional Formatting',
          children: [
            {
              key: 'align-left',
              icon: <AlignLeftOutlined />,
              label: 'Align Left',
            },
            {
              key: 'align-center',
              icon: <AlignCenterOutlined />,
              label: 'Align Center',
            },
            {
              key: 'align-right',
              icon: <AlignRightOutlined />,
              label: 'Align Right',
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          key: 'advanced',
          type: 'group',
          label: 'Advanced',
          children: [
            {
              key: 'insert-column',
              icon: <ColumnWidthOutlined />,
              label: 'Insert Column',
            },
          ],
        },
      ]}
    />
  );
  
  // Color picker content
  const colorPickerContent = (
    <div style={{ width: 220 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 500, marginBottom: 5 }}>Text Color</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {colorOptions.map((option) => (
            <Tooltip key={`text-${option.color}`} title={option.label}>
              <div 
                onClick={() => applyTextColor(option.color)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  cursor: 'pointer',
                  backgroundColor: option.color === 'default' ? '#ffffff' : option.color,
                  border: '1px solid #d9d9d9',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: getActiveTextColor() === option.color ? '0 0 0 2px #1890ff' : 'none'
                }}
              >
                {option.color === 'default' && <span style={{ fontSize: 16 }}>T</span>}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
      
      <div>
        <div style={{ fontWeight: 500, marginBottom: 5 }}>Background Color</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {colorOptions.map((option) => (
            <Tooltip key={`bg-${option.color}`} title={option.label}>
              <div 
                onClick={() => applyBackgroundColor(option.color)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  cursor: 'pointer',
                  backgroundColor: option.color === 'default' ? '#ffffff' : option.color,
                  border: '1px solid #d9d9d9',
                  boxShadow: getActiveBackgroundColor() === option.color ? '0 0 0 2px #1890ff' : 'none'
                }}
              />
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="confluence-toolbar">
      <div className="toolbar-group">
        <Dropdown overlay={blockTypeMenu} trigger={['click']} placement="bottomLeft">
          <Button
            className="block-type-button"
            size="middle"
            style={{ minWidth: 140 }}
          >
            {formatOptions.find(opt => opt.value === getCurrentBlockType())?.label || "Normal text"}
            <DownOutlined />
          </Button>
        </Dropdown>
        
        <Divider type="vertical" className="toolbar-divider" />
        
        <Tooltip title="Bold (Ctrl+B)" placement="bottom">
          <Button
            type={isStyleActive("bold") ? "primary" : "text"}
            icon={<BoldOutlined />}
            onClick={() => applyFormat("bold")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Tooltip title="Italic (Ctrl+I)" placement="bottom">
          <Button
            type={isStyleActive("italic") ? "primary" : "text"}
            icon={<ItalicOutlined />}
            onClick={() => applyFormat("italic")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Tooltip title="Underline (Ctrl+U)" placement="bottom">
          <Button
            type={isStyleActive("underline") ? "primary" : "text"}
            icon={<UnderlineOutlined />}
            onClick={() => applyFormat("underline")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Tooltip title="Strikethrough" placement="bottom">
          <Button
            type={isStyleActive("strike") ? "primary" : "text"}
            icon={<StrikethroughOutlined />}
            onClick={() => applyFormat("strike")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Tooltip title="Link (Ctrl+K)" placement="bottom">
          <Button
            type={isStyleActive("link") ? "primary" : "text"}
            icon={<LinkOutlined />}
            onClick={() => applyFormat("link")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        {/* Add Color Picker Button */}
        <Popover
          content={colorPickerContent}
          trigger="click"
          visible={colorPickerVisible}
          onVisibleChange={setColorPickerVisible}
          placement="bottom"
          overlayClassName="color-picker-popover"
        >
          <Tooltip title="Text and Background Color" placement="bottom">
            <Button
              type={(getActiveTextColor() || getActiveBackgroundColor()) ? "primary" : "text"}
              icon={<FontColorsOutlined />}
              className="modern-action-icon"
            />
          </Tooltip>
        </Popover>
        
        <Divider type="vertical" className="toolbar-divider" />
        
        <Tooltip title="Bullet list" placement="bottom">
          <Button
            type="text"
            icon={<UnorderedListOutlined />}
            onClick={() => applyFormat("bulletList")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Tooltip title="Numbered list" placement="bottom">
          <Button
            type="text"
            icon={<OrderedListOutlined />}
            onClick={() => applyFormat("numberedList")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Divider type="vertical" className="toolbar-divider" />
        
        <Tooltip title="Code" placement="bottom">
          <Button
            type={isStyleActive("code") ? "primary" : "text"}
            icon={<CodeOutlined />}
            onClick={() => applyFormat("code")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Upload
          accept="image/png,image/jpeg,image/gif,image/webp"
          showUploadList={false}
          customRequest={({ file }) => handleImageUpload(file)}
          disabled={isImageUploading}
        >
          <Tooltip title="Insert image" placement="bottom">
            <Button
              type="text"
              icon={<PictureOutlined />}
              loading={isImageUploading}
              className="modern-action-icon"
            />
          </Tooltip>
        </Upload>
        
        <Tooltip title="Insert table" placement="bottom">
          <Button
            type="text"
            icon={<TableOutlined />}
            onClick={() => applyFormat("table")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Tooltip title="Insert emoji" placement="bottom">
          <Button
            type="text"
            icon={<SmileOutlined />}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Dropdown overlay={moreMenu} trigger={['click']} placement="bottomRight">
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="modern-action-icon"
          />
        </Dropdown>
      </div>
    </div>
  );
};