import { Button, Dropdown, Tooltip, Menu, Divider, Upload, Popover, Tabs } from "antd";
import { useState} from "react";
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
import { useBlockFormatTracker } from "../hooks/useBlockFormatTracker";

// Define available colors - matching BluteButton.jsx implementation
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

export const ConfluenceToolbar = ({ editor }) => {
  const [_, setBlockType] = useState("paragraph");
  // const [isImageUploading, setIsImageUploading] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  
  // Use our block format tracker hook
  const {
    activeStyles,
    applyStyle,
    isButtonActive,
  } = useBlockFormatTracker(editor);
  
  // Format options for block types
  const formatOptions = [
    { value: "paragraph", label: "Normal text" },

    { value: "codeBlock", label: "Code block" },
    { value: "bulletListItem", label: "Bullet list" },
    { value: "numberedListItem", label: "Numbered list" },
    { value: "alert", label: "Alert" },
    { value: "dialog", label: "Dialog" },
  ];

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Apply text color and close menu
  const applyTextColor = (color) => {
    if (!editor) return;
    applyStyle('textColor', color);
    setColorPickerVisible(false); // Close the menu after color selection
  };
  
  // Apply background color and close menu
  const applyBackgroundColor = (color) => {
    if (!editor) return;
    applyStyle('backgroundColor', color);
    setColorPickerVisible(false); // Close the menu after color selection
  };

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
  // const handleImageUpload = async (file) => {
  //   if (!file || !editor) return false;
    
  //   try {
  //     setIsImageUploading(true);
  //     // Upload using the editor's upload function
  //     const url = await editor.uploadFile(file);
      
  //     // Insert the image at the current cursor position
  //     if (url) {
  //       editor.insertBlocks(
  //         [
  //           {
  //             type: "image",
  //             props: {
  //               url,
  //               caption: file.name,
  //               width: "100%",
  //             },
  //           },
  //         ],
  //         editor.getTextCursorPosition().block,
  //         "after"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     // You could show an error notification here
  //   } finally {
  //     setIsImageUploading(false);
  //   }
  //   return false; // Prevent default upload behavior
  // };

  // Apply text formatting
  const applyFormat = (format) => {
    if (!editor) return;
    
    switch (format) {
      case "bold":
        applyStyle('bold');
        break;
      case "italic":
        applyStyle('italic');
        break;
      case "underline":
        applyStyle('underline');
        break;
      case "strike":
        applyStyle('strike');
        break;
      case "code":
        applyStyle('code');
        break;
      // case "link":
      //   // Get selected text
      //   const selection = editor.getSelectedText();
      //   // Show link dialog in production app
      //   const url = prompt("Enter URL:", "https://");
      //   if (url) {
      //     applyStyle('link', url);
      //   }
      //   break;
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
      // case "table":
        // Insert a simple 2x2 table
        // editor.insertBlocks(
        //   [
        //     {
        //       type: "table",
        //       content: [
        //         {
        //           type: "tableRow",
        //           content: [
        //             { type: "tableCell", content: [{ type: "paragraph", content: "Header 1" }] },
        //             { type: "tableCell", content: [{ type: "paragraph", content: "Header 2" }] },
        //           ],
        //         },
        //         {
        //           type: "tableRow",
        //           content: [
        //             { type: "tableCell", content: [{ type: "paragraph", content: "Cell 1" }] },
        //             { type: "tableCell", content: [{ type: "paragraph", content: "Cell 2" }] },
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        //   editor.getTextCursorPosition().block,
        //   "after"
        // );
        // break;
      default:
        break;
    }
  };
  
  // Get current block type for select
  const getCurrentBlockType = () => {
    if (!editor) return "paragraph";
    
    const currentBlock = editor.getTextCursorPosition().block;
    return currentBlock?.type || "paragraph";
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
  // const moreMenu = (
  //   <Menu
  //     items={[
  //       {
  //         key: 'formatting',
  //         type: 'group',
  //         label: 'Additional Formatting',
  //         children: [
  //           {
  //             key: 'align-left',
  //             icon: <AlignLeftOutlined />,
  //             label: 'Align Left',
  //           },
  //           {
  //             key: 'align-center',
  //             icon: <AlignCenterOutlined />,
  //             label: 'Align Center',
  //           },
  //           {
  //             key: 'align-right',
  //             icon: <AlignRightOutlined />,
  //             label: 'Align Right',
  //           },
  //         ],
  //       },
  //       {
  //         type: 'divider',
  //       },
  //       {
  //         key: 'advanced',
  //         type: 'group',
  //         label: 'Advanced',
  //         children: [
  //           {
  //             key: 'insert-column',
  //             icon: <ColumnWidthOutlined />,
  //             label: 'Insert Column',
  //           },
  //         ],
  //       },
  //     ]}
  //   />
  // );
  
  // Color picker content with tabs and color swatches
  const colorPickerContent = (
    <div style={{ width: 250 }}>
      <Tabs
        defaultActiveKey="text"
        activeKey={activeTab}
        onChange={handleTabChange}
        tabBarGutter={8}
        size="small"
        tabBarStyle={{ marginBottom: 8, minHeight: 32 }}
        items={[
          {
            key: 'text',
            label: (
              <span>
                <FontColorsOutlined 
                  style={{ color: activeStyles.textColor || undefined }}
                />
                <span style={{ marginLeft: 4 }}>Text</span>
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
                        boxShadow: activeStyles.textColor === option.color ? '0 0 0 2px #1890ff' : 'none'
                      }}
                      title={option.label}
                    />
                  ))}
                </div>
                
                {/* Clear button to reset text color */}
                <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end", paddingRight: 8 }}>
                  <Button 
                    size="small" 
                    onClick={() => {
                      editor.removeStyles(["textColor"]);
                      setColorPickerVisible(false); // Close the menu after clearing color
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            ),
          },
          {
            key: 'background',
            label: (
              <span>
                <BgColorsOutlined 
                  style={{ color: activeStyles.backgroundColor || undefined }}
                />
                <span style={{ marginLeft: 4 }}>Background</span>
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
                        boxShadow: activeStyles.backgroundColor === option.color ? '0 0 0 2px #1890ff' : 'none'
                      }}
                      title={option.label}
                    />
                  ))}
                </div>
                
                {/* Clear button to reset background color */}
                <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end", paddingRight: 8 }}>
                  <Button 
                    size="small" 
                    onClick={() => {
                      editor.removeStyles(["backgroundColor"]);
                      setColorPickerVisible(false); // Close the menu after clearing color
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
      />
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
            type={isButtonActive("bold") ? "primary" : "text"}
            icon={<BoldOutlined />}
            onClick={() => applyFormat("bold")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Tooltip title="Italic (Ctrl+I)" placement="bottom">
          <Button
            type={isButtonActive("italic") ? "primary" : "text"}
            icon={<ItalicOutlined />}
            onClick={() => applyFormat("italic")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Tooltip title="Underline (Ctrl+U)" placement="bottom">
          <Button
            type={isButtonActive("underline") ? "primary" : "text"}
            icon={<UnderlineOutlined />}
            onClick={() => applyFormat("underline")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        <Tooltip title="Strikethrough" placement="bottom">
          <Button
            type={isButtonActive("strike") ? "primary" : "text"}
            icon={<StrikethroughOutlined />}
            onClick={() => applyFormat("strike")}
            className="modern-action-icon"
          />
        </Tooltip>
        
        {/* <Tooltip title="Link (Ctrl+K)" placement="bottom">
          <Button
            type={isButtonActive("link") ? "primary" : "text"}
            icon={<LinkOutlined />}
            onClick={() => applyFormat("link")}
            className="modern-action-icon"
          />
        </Tooltip> */}
        
        {/* Color Picker with Tabs */}
        <Popover
          content={colorPickerContent}
          trigger="click"
          open={colorPickerVisible}
          onOpenChange={setColorPickerVisible}
          placement="bottom"
        >
          <Tooltip title="Text and Background Color" placement="bottom">
            <Button
              type="text"
              icon={
                <span style={{ display: "flex", alignItems: "center" }}>
                  {activeStyles.textColor && (
                    <FontColorsOutlined style={{ color: activeStyles.textColor }} />
                  )}
                  {!activeStyles.textColor && activeStyles.backgroundColor && (
                    <BgColorsOutlined style={{ color: activeStyles.backgroundColor }} />
                  )}
                  {!activeStyles.textColor && !activeStyles.backgroundColor && (
                    <FontColorsOutlined />
                  )}
                </span>
              }
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
        
        {/* <Tooltip title="Code" placement="bottom">
          <Button
            type={isButtonActive("code") ? "primary" : "text"}
            icon={<CodeOutlined />}
            onClick={() => applyFormat("code")}
            className="modern-action-icon"
          />
        </Tooltip>
         */}
        {/* <Upload
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
        </Upload> */}
        
        {/* <Tooltip title="Insert table" placement="bottom">
          <Button
            type="text"
            icon={<TableOutlined />}
            onClick={() => applyFormat("table")}
            className="modern-action-icon"
          />
        </Tooltip> */}
        
        {/* <Tooltip title="Insert emoji" placement="bottom">
          <Button
            type="text"
            icon={<SmileOutlined />}
            className="modern-action-icon"
          />
        </Tooltip> */}
        
        {/* <Dropdown overlay={moreMenu} trigger={['click']} placement="bottomRight">
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="modern-action-icon"
          />
        </Dropdown> */}
      </div>
    </div>
  );
};