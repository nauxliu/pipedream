import googleDrive from "../../google_drive.app.mjs";
import { Readable } from "stream";

export default {
  key: "google_drive-create-file-from-text",
  name: "Create New File From Text",
  description: "Create a new file from plain text. [See the docs](https://developers.google.com/drive/api/v3/reference/files/create) for more information",
  version: "0.0.2",
  type: "action",
  props: {
    googleDrive,
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      optional: true,
    },
    parentId: {
      propDefinition: [
        googleDrive,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description:
        "The folder you want to add the file to. If not specified, the file will be placed directly in the user's My Drive folder.",
      optional: true,
    },
    name: {
      propDefinition: [
        googleDrive,
        "fileName",
      ],
      description:
        "The name of the file you want to create (e.g., `myFile.txt`)",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Enter text to create the file with.",
      optional: true,
      default: "",
    },
  },
  async run({ $ }) {
    const {
      parentId,
      name,
      content,
    } = this;
    const file = Readable.from([
      content,
    ]);
    const resp = await this.googleDrive.createFileFromOpts({
      mimeType: "text/plain",
      file,
      name,
      parentId,
    });
    $.export("$summary", `Successfully created a new file, "${resp.name}"`);
    return resp;
  },
};
