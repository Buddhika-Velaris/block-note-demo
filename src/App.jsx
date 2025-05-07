import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BasicTextStyleButton,
  SuggestionMenuController,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { Button, Modal, Input, Space } from "antd";
import { useState, useEffect } from "react";
import { RiAlertFill, RiChat3Fill } from "react-icons/ri";
import { Alert } from "./Alert.jsx";
import { DialogBlock } from "./components/DialogBlock.jsx";
import { H4Block } from "./components/H4Block.jsx";
import { ConfluenceToolbar } from "./components/ConfluenceToolbar.jsx";
import { ColorButton } from "./components/BluteButton.jsx";


async function uploadFile(file) {
  const body = new FormData();
  body.append("file", file);

  const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
    method: "POST",
    body: body,
  });
  return (await ret.json()).data.url.replace(
    "tmpfiles.org/",
    "tmpfiles.org/dl/"
  );
}
// Our schema with block specs, which contain the configs and implementations for
// blocks that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    alert: Alert,
    // Adds the Dialog block
    dialog: DialogBlock,
    // Adds the H4 block
    h4: H4Block,
  },
});

// Slash menu item to insert an Alert block
const insertAlert = (editor) => ({
  title: "Yasige Alert 🐒",
  subtext: "Copilot thama hondatama kare",
  onItemClick: () =>
    // If the block containing the text caret is empty, `insertOrUpdateBlock`
    // changes its type to the provided block. Otherwise, it inserts the new
    // block below and moves the text caret to it. We use this function with an
    // Alert block.
    insertOrUpdateBlock(editor, {
      type: "alert",
    }),
  aliases: [
    "alert",
    "notification",
    "emphasize",
    "warning",
    "error",
    "info",
    "success",
  ],
  group: "Basic blocks",
  icon: <RiAlertFill />,
});

// Slash menu item to insert a Dialog block
const insertDialog = (editor) => ({
  title: "Dialog",
  subtext: "Interactive dialog for text input",
  onItemClick: () =>
    insertOrUpdateBlock(editor, {
      type: "dialog",
      props: {
        title: "Enter Information",
        dialogText: "",
      }
    }),
  aliases: [
    "dialog",
    "input",
    "form",
    "text input",
    "modal",
  ],
  group: "Basic blocks",
  icon: <RiChat3Fill />,
});

// Slash menu item to insert an H4 block
const insertH4 = (editor) => ({
  title: "Heading 4",
  subtext: "Insert a level 4 heading",
  onItemClick: () =>
    insertOrUpdateBlock(editor, {
      type: "h4",
    }),
  aliases: ["h4", "heading4", "heading", "title"],
  group: "Headings",
  icon: <span style={{ fontWeight: 700 }}>H4</span>,
});

export default function App() {
  // State for the top dialog box
  const [dialogOpened, setDialogOpened] = useState(false);
  const [inputText, setInputText] = useState("");

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
    // Initial content with a mix of formatted and unformatted text
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This text has ",
            styles: {}
          },
          {
            type: "text",
            text: "bold",
            styles: { bold: true }
          },
          {
            type: "text",
            text: " formatting. Try clicking after this text and typing to maintain the bold style.",
            styles: {}
          }
        ]
      },
      {
        type: "alert",
        content: "This is an example alert",
      },
      {
        type: "paragraph",
        content: "Press the '/' key to open the Slash Menu and add another block",
      },
      {
        type: "dialog",
        props: {
          title: "Click to Enter Text",
          dialogText: "This is a sample dialog block. Click the button to edit this text.",
        },
        content: [],
      },
      {
        type: "paragraph",
        content:
          "Or select some text to see the blocks in the Formatting Toolbar's Block Type Select",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Each block can have its own ",
            styles: {}
          },
          {
            type: "text",
            text: "formatting styles",
            styles: { italic: true, textColor: "blue" }
          },
          {
            type: "text",
            text: " that are tracked independently.",
            styles: {}
          }
        ]
      },
    ],
    uploadFile,
  });

  // Handle selection changes to ensure proper focus
  const handleSelectionChange = () => {
    // This helps ensure the toolbar reflects the correct formatting of the current block
    editor.focus();
  };

  // Function to insert text from the top dialog into the editor
  const insertTextFromDialog = () => {
    if (inputText.trim()) {
      editor.insertBlocks(
        [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: inputText,
                styles: {}
              }
            ]
          }
        ],
        editor.getTextCursorPosition().block,
        "before"
      );
      setInputText("");
      setDialogOpened(false);
    }
  };

  // Renders the editor instance.
  return (
    <div className="editor-container">
      <div className="editor-with-toolbar">
        {/* Confluence-style toolbar */}
        <ConfluenceToolbar editor={editor} />

        <BlockNoteView 
          editor={editor} 
          formattingToolbar={false} 
          slashMenu={false} 
          data-color-scheme="bw"
          onSelectionChange={handleSelectionChange} // Added the recommended onSelectionChange prop
        >
          {/* Replaces the default Formatting Toolbar */}
          <FormattingToolbarController
            formattingToolbar={() => (
              // Uses the default Formatting Toolbar.
              <FormattingToolbar>
                <BlockTypeSelect key={"blockTypeSelect"} />

                {/* Color button with multiple color options */}
                <ColorButton key={"customButton"} />

                <FileCaptionButton key={"fileCaptionButton"} />
                <FileReplaceButton key={"replaceFileButton"} />

                <BasicTextStyleButton
                  basicTextStyle={"bold"}
                  key={"boldStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"italic"}
                  key={"italicStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"underline"}
                  key={"underlineStyleButton"}
                />
                <BasicTextStyleButton
                  basicTextStyle={"strike"}
                  key={"strikeStyleButton"}
                />
                {/* Extra button to toggle code styles */}
                <BasicTextStyleButton
                  key={"codeStyleButton"}
                  basicTextStyle={"code"}
                />

                <TextAlignButton
                  textAlignment={"left"}
                  key={"textAlignLeftButton"}
                />
                <TextAlignButton
                  textAlignment={"center"}
                  key={"textAlignCenterButton"}
                />
                <TextAlignButton
                  textAlignment={"right"}
                  key={"textAlignRightButton"}
                />

                <ColorStyleButton key={"colorStyleButton"} />

                <NestBlockButton key={"nestBlockButton"} />
                <UnnestBlockButton key={"unnestBlockButton"} />

                <CreateLinkButton key={"createLinkButton"} />
              </FormattingToolbar>
            )}
          />
          {/* Replaces the default Slash Menu. */}
          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) => {
              // Gets all default slash menu items.
              const defaultItems = getDefaultReactSlashMenuItems(editor);
              // Finds index of last item in "Basic blocks" group.
              const lastBasicBlockIndex = defaultItems.findLastIndex(
                (item) => item.group === "Basic blocks"
              );
              const lastHeadingBlockIndex = defaultItems.findLastIndex(
                (item) => item.group === "Headings"
              );
              // Inserts the Alert, Dialog, and H4 items
              defaultItems.splice(lastHeadingBlockIndex + 1, 1, insertH4(editor));
              defaultItems.splice(lastBasicBlockIndex + 1, 0, insertAlert(editor));
              defaultItems.splice(lastBasicBlockIndex + 0, 0, insertDialog(editor));

              // Returns filtered items based on the query.
              return filterSuggestionItems(defaultItems, query);
            }}
          />
        </BlockNoteView>
      </div>
    </div>
  );
}