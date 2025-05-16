import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { codeBlock } from "@blocknote/code-block";
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
  DragHandleMenu,
  RemoveBlockItem,
  SideMenuController,
  SideMenu,
} from "@blocknote/react";
import { RiAlertFill, RiChat3Fill } from "react-icons/ri";
import { Alert } from "./components/Alert.jsx";
import { DialogBlock } from "./components/DialogBlock.jsx";
import { H4Block } from "./components/H4Block.jsx";
import { ConfluenceToolbar } from "./components/ConfluenceToolbar.jsx";
import { ColorButton } from "./components/ColorSwitch.jsx";
import  {Mention} from "./components/Mention.jsx";


async function uploadFile(file) {
  const blob = new Blob([file], { type: file.type });
  
  const blobUrl = URL.createObjectURL(blob);

  return blobUrl;
}

// contain the configs and implementations for
// blocks that we want our editor to use.
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: Alert,
    dialog: DialogBlock,
    h4: H4Block,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: Mention,
  },
});


const CustomDragHandleMenu = (props) => (
  <DragHandleMenu {...props}>
    <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
  </DragHandleMenu>
);

// Function which gets all users for the mentions menu.
const getMentionMenuItems = (
  editor
) => {
  const users = ["Steve", "Bob", "Joe", "Mike"];
 
  return users.map((user) => ({
    title: user,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: "mention",
          props: {
            user,
          },
        },
        " ",
      ]);
    },
  }));
};
// Slash menu item to insert an Alert block
const insertAlert = (editor) => ({
  title: "Yasige Alert 🐒",
  subtext: "Copilot thama hondatama kare",
  onItemClick: () =>
    // If the block containing the text caret is empty, `insertOrUpdateBlock`
    // changes its type to the provided block. Otherwise, it inserts the new
    // block below and moves the text caret to it.
    insertOrUpdateBlock(editor, {
      type: "alert",
    }),
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

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    schema,
     codeBlock,
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
    editor.focus();
  };

  return (
    <div className="editor-container">
      <div className="editor-with-toolbar">
        <ConfluenceToolbar editor={editor} />

        <div className="editor-content">
          <BlockNoteView 
            editor={editor} 
            formattingToolbar={false} 
            slashMenu={false} 
            comments={true}
            data-color-scheme="bw"
            onSelectionChange={handleSelectionChange}
          >
            {/* Replaces the default Formatting Toolbar */}
            <FormattingToolbarController
              formattingToolbar={() => (
                <FormattingToolbar>
                  <BlockTypeSelect key={"blockTypeSelect"} />
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
                const defaultItems = getDefaultReactSlashMenuItems(editor);
                const lastBasicBlockIndex = defaultItems.findLastIndex(
                  (item) => item.group === "Basic blocks"
                );
                const lastHeadingBlockIndex = defaultItems.findLastIndex(
                  (item) => item.group === "Headings"
                );
 
                defaultItems.splice(lastHeadingBlockIndex + 1, 1, insertH4(editor));
                defaultItems.splice(lastBasicBlockIndex + 1, 0, insertAlert(editor));
                defaultItems.splice(lastBasicBlockIndex + 0, 0, insertDialog(editor));

                return filterSuggestionItems(defaultItems, query);
              }}
            />
             <SuggestionMenuController
        triggerCharacter={"@"}
        getItems={async (query) =>
          // Gets the mentions menu items
          filterSuggestionItems(getMentionMenuItems(editor), query)
        }
      />

       <SideMenuController
        sideMenu={(props) => (
          <SideMenu {...props} dragHandleMenu={CustomDragHandleMenu} />
        )}
      />
          </BlockNoteView>
        </div>
      </div>
    </div>
  );
}