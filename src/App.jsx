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
        "id": "f8737cb4-9455-47dc-9e31-6332f7752a88",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "🚀 Developer Onboarding Guide",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "1dd64c06-f73e-4668-8fea-c0a5ae965062",
        "type": "quote",
        "props": {
            "textColor": "default",
            "backgroundColor": "default"
        },
        "content": [
            {
                "type": "text",
                "text": "Welcome aboard! This document will walk you through setting up the project, understanding the architecture, and aligning with our development workflow.",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "1c658ffe-3376-4b1f-ba26-6d72d8dab3ac",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "🧭 Quick Start",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "0d4e4efa-3349-4fdb-9230-b3393b0c2e01",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 3
        },
        "content": [
            {
                "type": "text",
                "text": "1️⃣ Clone the Repository",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "7f1a40c7-b9eb-407e-b4a3-186e3c82230f",
        "type": "codeBlock",
        "props": {
            "language": "javascript"
        },
        "content": [
            {
                "type": "text",
                "text": "git clone https://github.com/your-org/your-repo.git\ncd your-repo\n",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "76eeb1f4-085e-4403-b7ef-b0e6f367d412",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 3
        },
        "content": [
            {
                "type": "text",
                "text": "2️⃣ Install Dependencies",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "e4ba4523-dda5-4fc6-8672-fca1f934f5c5",
        "type": "paragraph",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "We use ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "pnpm",
                "styles": {
                    "bold": true
                }
            },
            {
                "type": "text",
                "text": " for workspace-aware package management.",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "803c7ca3-c1cc-421d-82e5-09ae7320d278",
        "type": "codeBlock",
        "props": {
            "language": "javascript"
        },
        "content": [
            {
                "type": "text",
                "text": "pnpm install\n",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "10c87a41-a83f-429f-9d56-53737c622a65",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 3
        },
        "content": [
            {
                "type": "text",
                "text": "3️⃣ Setup Environment Variables",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "2f201c82-2195-496c-9013-c5a8322b5244",
        "type": "paragraph",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "Create ",
                "styles": {}
            },
            {
                "type": "text",
                "text": ".env",
                "styles": {
                    "code": true
                }
            },
            {
                "type": "text",
                "text": " files in ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "apps/web",
                "styles": {
                    "code": true
                }
            },
            {
                "type": "text",
                "text": " and ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "apps/api",
                "styles": {
                    "code": true
                }
            },
            {
                "type": "text",
                "text": ":",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "dc07ba94-2850-477d-b8eb-29cc8cbb023b",
        "type": "codeBlock",
        "props": {
            "language": "javascript"
        },
        "content": [
            {
                "type": "text",
                "text": "# apps/api/.env\nDATABASE_URL=postgresql://localhost:5432/dev\nJWT_SECRET=your_jwt_secret\n\n# apps/web/.env\nVITE_API_URL=http://localhost:3000\n",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "b91a51ed-3152-4894-9b29-bcd2af20a8ba",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "🏗 Project Structure",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "740faa53-2123-4aa6-bb8d-5b22a8e2f5de",
        "type": "codeBlock",
        "props": {
            "language": "javascript"
        },
        "content": [
            {
                "type": "text",
                "text": ".\n├── apps/\n│   ├── web/          # Frontend (React + Vite)\n│   └── api/          # Backend (Node.js + Express)\n├── packages/\n│   ├── ui/           # Shared UI components\n│   ├── db/           # Prisma schema + DB client\n│   └── config/       # Shared TypeScript types & constants\n├── .github/          # CI workflows\n└── docker/           # Dev & production containers\n",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "f9bab6e6-2593-4c82-9d05-ae46e5855068",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "🧱 Tech Stack",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "8fae6fca-567a-4fa1-8905-5b5e95294d12",
        "type": "table",
        "props": {
            "textColor": "default"
        },
        "content": {
            "type": "tableContent",
            "columnWidths": [
                null,
                null,
                229
            ],
            "headerRows": 1,
            "rows": [
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Layer",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Tech Used",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Notes",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Frontend",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "React, Vite, Tailwind",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "SPA with atomic design structure",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Backend",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Node.js, Express, Prisma",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "RESTful API with JWT auth",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Database",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "PostgreSQL",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Using Prisma for schema and migration",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "DevOps",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Docker, GitHub Actions",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "CI/CD for staging and production",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                }
            ]
        },
        "children": []
    },
    {
        "id": "4e507f0e-5100-4a30-a846-320dd048c4d9",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "⚙️ Development Workflow",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "cb6ac590-2142-4e06-b4cc-df640980bbdd",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 3
        },
        "content": [
            {
                "type": "text",
                "text": "🔁 Git Flow",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "e13d1efb-6c3d-490e-94cc-691b4212c16a",
        "type": "numberedListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "start": 1895
        },
        "content": [
            {
                "type": "text",
                "text": "Always create a branch from ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "develop",
                "styles": {
                    "code": true
                }
            }
        ],
        "children": []
    },
    {
        "id": "5612a730-0cf4-4fc7-a897-faa2d5f113bf",
        "type": "numberedListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "Use conventional commits (e.g. ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "feat:",
                "styles": {
                    "code": true
                }
            },
            {
                "type": "text",
                "text": ", ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "fix:",
                "styles": {
                    "code": true
                }
            },
            {
                "type": "text",
                "text": ")",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "49a26023-c8dd-4b82-befa-f60c45c00051",
        "type": "numberedListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "Open a PR to ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "develop",
                "styles": {
                    "code": true
                }
            }
        ],
        "children": []
    },
    {
        "id": "69aaec8b-f73b-4354-b6e1-df9422db470f",
        "type": "numberedListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "Request at least ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "1 reviewer",
                "styles": {
                    "bold": true
                }
            }
        ],
        "children": []
    },
    {
        "id": "3f4435c9-48fa-4f9c-915e-ffb0540d35fe",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 3
        },
        "content": [
            {
                "type": "text",
                "text": "⛏ Branch Naming",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "a7395870-92e1-44cd-bc74-cf8a2807c27a",
        "type": "codeBlock",
        "props": {
            "language": "javascript"
        },
        "content": [
            {
                "type": "text",
                "text": "feature/signup-form  \nbugfix/auth-token-refresh  \nchore/update-eslint-config  \n",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "0a240472-47a9-4567-9e55-14b94893ad52",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "🧪 Running the App",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "f57ab3d4-bf17-4bc2-b4df-fbd9a8d7732c",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 3
        },
        "content": [
            {
                "type": "text",
                "text": "Frontend (Vite)",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "6e1436c7-7304-4072-865f-ad50ebdc2324",
        "type": "codeBlock",
        "props": {
            "language": "shellscript"
        },
        "content": [
            {
                "type": "text",
                "text": "cd apps/web\npnpm dev\n",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "e4184d01-873d-4d1d-b5bd-29043dcd4db8",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 3
        },
        "content": [
            {
                "type": "text",
                "text": "Backend (Express)",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "9f6caff4-55b7-47ca-aa05-1c2f6a070e98",
        "type": "codeBlock",
        "props": {
            "language": "javascript"
        },
        "content": [
            {
                "type": "text",
                "text": "cd apps/api\npnpm dev\n",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "22e21959-0b84-4d09-b741-60cb7c0b269b",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "🧪 Testing",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "51261c98-13e3-45f2-8249-dae43007b669",
        "type": "paragraph",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "Run unit tests with:",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "30a9d678-03c4-48cd-9f8c-f75a873b91d8",
        "type": "codeBlock",
        "props": {
            "language": "javascript"
        },
        "content": [
            {
                "type": "text",
                "text": "pnpm test\n",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "ee8c4512-1e24-4c1f-a026-bcd9fbfe70dc",
        "type": "paragraph",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "Example test in ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "apps/api/__tests__/auth.test.ts",
                "styles": {
                    "code": true
                }
            },
            {
                "type": "text",
                "text": ":",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "e43b306e-03d7-4097-9096-b6d542dd609d",
        "type": "codeBlock",
        "props": {
            "language": "javascript"
        },
        "content": [
            {
                "type": "text",
                "text": "describe(\"POST /login\", () => {\n  it(\"should return a JWT on valid credentials\", async () => {\n    const res = await request(app)\n      .post(\"/login\")\n      .send({ email: \"test@example.com\", password: \"123456\" });\n\n    expect(res.statusCode).toBe(200);\n    expect(res.body.token).toBeDefined();\n  });\n});\n",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "30272b2a-c488-4a8e-a8ac-0df05909c496",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "📬 Slack Channels",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "7d1fc4a2-f991-45df-b091-07d2844245be",
        "type": "table",
        "props": {
            "textColor": "default"
        },
        "content": {
            "type": "tableContent",
            "columnWidths": [
                null,
                null
            ],
            "headerRows": 1,
            "rows": [
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Channel",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Purpose",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "#dev-general",
                                    "styles": {
                                        "code": true
                                    }
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Engineering discussion",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "#frontend",
                                    "styles": {
                                        "code": true
                                    }
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "UI/UX, component library, issues",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "#backend",
                                    "styles": {
                                        "code": true
                                    }
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "API, DB, and infrastructure",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "#releases",
                                    "styles": {
                                        "code": true
                                    }
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Deployment updates",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                }
            ]
        },
        "children": []
    },
    {
        "id": "b058077b-4e64-4ee5-bbef-5556e82fb5a6",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "🖼 Preview Screenshot",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "ed9d6c28-fad0-49ec-89b7-0cb572c5549c",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "🧠 Common Commands",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "5be69951-11f7-47df-aa7e-8c42c2718870",
        "type": "table",
        "props": {
            "textColor": "default"
        },
        "content": {
            "type": "tableContent",
            "columnWidths": [
                null,
                null
            ],
            "headerRows": 1,
            "rows": [
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Command",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Description",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "pnpm lint",
                                    "styles": {
                                        "code": true
                                    }
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Run ESLint",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "pnpm format",
                                    "styles": {
                                        "code": true
                                    }
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Format with Prettier",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "pnpm db:migrate",
                                    "styles": {
                                        "code": true
                                    }
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Run DB migrations",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                },
                {
                    "cells": [
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "pnpm dev",
                                    "styles": {
                                        "code": true
                                    }
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        },
                        {
                            "type": "tableCell",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Start both frontend & backend",
                                    "styles": {}
                                }
                            ],
                            "props": {
                                "colspan": 1,
                                "rowspan": 1,
                                "backgroundColor": "default",
                                "textColor": "default",
                                "textAlignment": "left"
                            }
                        }
                    ]
                }
            ]
        },
        "children": []
    },
    {
        "id": "f3c7e152-f121-46cd-9b41-28f1279da52b",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "🧭 Next Steps",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "a0ae55d6-225c-49d6-a15a-5506c7a8f173",
        "type": "checkListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "checked": false
        },
        "content": [
            {
                "type": "text",
                "text": "Get access to staging server",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "cf6abbc5-9375-439a-9dd7-f2f871f0b010",
        "type": "checkListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "checked": false
        },
        "content": [
            {
                "type": "text",
                "text": "Connect to production database (read-only)",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "6197c317-6bb3-4e49-bd55-397c4acbf7eb",
        "type": "checkListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "checked": false
        },
        "content": [
            {
                "type": "text",
                "text": "Review code style guide",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "079ea7c3-c48f-4520-865a-f420b5ea6ece",
        "type": "checkListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "checked": false
        },
        "content": [
            {
                "type": "text",
                "text": "Schedule onboarding call",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "39bb2dde-f030-4ac9-90ee-0538acab8dd5",
        "type": "heading",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
        },
        "content": [
            {
                "type": "text",
                "text": "📚 Helpful Links",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "9f9733dd-3047-4822-90f8-577420120761",
        "type": "bulletListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "link",
                "href": "https://reactjs.org",
                "content": [
                    {
                        "type": "text",
                        "text": "React Docs",
                        "styles": {}
                    }
                ]
            }
        ],
        "children": []
    },
    {
        "id": "6d7348be-7ca4-4858-9fd8-b395474a6d4a",
        "type": "bulletListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "Prisma Docs",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "3c2c6bed-591d-47d1-8af6-a6ca382addb8",
        "type": "bulletListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "link",
                "href": "https://expressjs.com",
                "content": [
                    {
                        "type": "text",
                        "text": "Express Docs",
                        "styles": {}
                    }
                ]
            }
        ],
        "children": []
    },
    {
        "id": "0ea2a084-4d36-49cc-b408-d53a00a3dc00",
        "type": "bulletListItem",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "link",
                "href": "https://blocknotejs.org",
                "content": [
                    {
                        "type": "text",
                        "text": "BlockNote Editor",
                        "styles": {}
                    }
                ]
            }
        ],
        "children": []
    },
    {
        "id": "887fb9e0-a2ce-4013-aea7-a263579498e5",
        "type": "paragraph",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "Let me know if you want a ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "localized version",
                "styles": {
                    "bold": true
                }
            },
            {
                "type": "text",
                "text": ", an ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "interactive checklist",
                "styles": {
                    "bold": true
                }
            },
            {
                "type": "text",
                "text": ", or something ",
                "styles": {}
            },
            {
                "type": "text",
                "text": "team-branded",
                "styles": {
                    "bold": true
                }
            },
            {
                "type": "text",
                "text": "!",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "f21cb5dd-1e7b-4f35-a94b-8d1dc245ac15",
        "type": "alert",
        "props": {
            "textColor": "default",
            "textAlignment": "right",
            "type": "success"
        },
        "content": [
            {
                "type": "text",
                "text": "Verified",
                "styles": {}
            }
        ],
        "children": []
    },
    {
        "id": "c3f8f019-58a8-4bea-a229-feaa655e6a04",
        "type": "paragraph",
        "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
        },
        "content": [],
        "children": []
    }
],
    uploadFile,
  });

  // Handle selection changes to ensure proper focus
  const handleSelectionChange = () => {
    console.log(editor.document)
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