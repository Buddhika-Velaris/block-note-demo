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
  FormattingToolbarController,
  SuggestionMenuController,
  blockTypeSelectItems,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
  FormattingToolbar,
} from "@blocknote/react";
import { Button, Dialog, TextInput, Group } from "@mantine/core";
import { useState } from "react";
import { RiAlertFill, RiChat3Fill } from "react-icons/ri";
import { Alert } from "./Alert.jsx";
import { DialogBlock } from "./components/DialogBlock.jsx";
 

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
 
export default function App() {
  // State for the top dialog box
  const [dialogOpened, setDialogOpened] = useState(false);
  const [inputText, setInputText] = useState("");

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
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
      },
    ],
    uploadFile,
  });
  
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
      {/* Top dialog button */}
      {/* <div className="top-dialog-container">
        <Button 
          onClick={() => setDialogOpened(true)}
          variant="filled" 
          color="blue"
          fullWidth
        >
          Open Dialog to Add Text
        </Button>
      </div> */}

      {/* Top dialog */}
      <Dialog
        opened={dialogOpened}
        withCloseButton
        onClose={() => setDialogOpened(false)}
        position={{ top: 20, left: 20 }}
        size="xl"
      >
        <h3 style={{ marginTop: 0 }}>Enter Text</h3>
        <TextInput
          placeholder="Type your text here"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          mb={15}
          autoFocus
        />
        <Group position="right">
          <Button onClick={() => setDialogOpened(false)} variant="outline">Cancel</Button>
          <Button onClick={insertTextFromDialog}>Insert Text</Button>
        </Group>
      </Dialog>

      <BlockNoteView editor={editor} formattingToolbar={false} slashMenu={false} data-color-scheme="bw">
        {/* Replaces the default Formatting Toolbar */}
        <FormattingToolbarController
          formattingToolbar={() => (
            // Uses the default Formatting Toolbar.
            <FormattingToolbar
              // Sets the items in the Block Type Select.
              blockTypeSelectItems={[
                // Gets the default Block Type Select items.
                ...blockTypeSelectItems(editor.dictionary),
                // Adds an item for the Alert block.
                {
                  name: "Alert",
                  type: "alert",
                  icon: RiAlertFill,
                  isSelected: (block) => block.type === "alert",
                },
                // Adds an item for the Dialog block
                {
                  name: "Dialog",
                  type: "dialog",
                  icon: RiChat3Fill,
                  isSelected: (block) => block.type === "dialog",
                }
              ]}
            />
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
            // Inserts the Alert and Dialog items as the last items in the "Basic blocks" group.
            defaultItems.splice(lastBasicBlockIndex + 1, 0, insertAlert(editor));
            defaultItems.splice(lastBasicBlockIndex + 2, 0, insertDialog(editor));
   
            // Returns filtered items based on the query.
            return filterSuggestionItems(defaultItems, query);
          }}
        />
      </BlockNoteView>
    </div>
  );
}