import { FileData } from "@samuelncui/chonky";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { ServiceClient, File, SourceFile, Tape, Position } from "./entity";

import moment from "moment";

export const MODE_DIR = 2147483648n; // d: is a directory
export const JOB_STATUS_VISIBLE = 128;

const apiBase: string = (() => {
  const base = (window as any).apiBase as string;
  if (!base || base === "%%API_BASE%%") {
    return "http://localhost:5173/services";
  }
  return base;
})();

export const fileBase: string = (() => {
  return apiBase.replace("/services", "/files");
})();

export const Root: FileData = {
  id: "0",
  name: "Root",
  isDir: true,
  openable: true,
  selectable: true,
  draggable: true,
  droppable: true,
};

const transport = new GrpcWebFetchTransport({
  baseUrl: apiBase,
  format: "binary",
});

export const cli = new ServiceClient(transport);
(window as any).cli = cli;

export function convertFiles(files: Array<File>): FileData[] {
  return files.map((file) => {
    const isDir = (file.mode & MODE_DIR) > 0;

    return {
      id: getID(file),
      name: file.name,
      ext: extname(file.name),
      isDir,
      isHidden: file.name.startsWith("."),
      openable: true,
      selectable: true,
      draggable: true,
      droppable: isDir,
      size: Number(file.size),
      modDate: moment.unix(Number(file.modTime)).toDate(),
    };
  });
}

export function convertSourceFiles(files: Array<SourceFile>): FileData[] {
  return files.map((file) => {
    const isDir = (file.mode & MODE_DIR) > 0;

    return {
      id: getID(file),
      name: file.name,
      ext: extname(file.name),
      isDir,
      isHidden: file.name.startsWith("."),
      openable: isDir,
      selectable: true,
      draggable: true,
      droppable: false,
      size: Number(file.size),
      modDate: moment.unix(Number(file.modTime)).toDate(),
    };
  });
}

export function convertTapes(tapes: Array<Tape>): FileData[] {
  return tapes.map((tape) => {
    // const isDir = (file.mode & ModeDir) > 0;

    return {
      id: `${tape.id}`,
      name: tape.barcode,
      ext: "",
      isDir: true,
      isHidden: false,
      openable: true,
      selectable: true,
      draggable: false,
      droppable: false,
      size: Number(tape.writenBytes),
      modDate: moment.unix(Number(tape.createTime)).toDate(),
      isTape: true,
    };
  });
}

export function convertPositions(positions: Array<Position>): FileData[] {
  return positions.map((posi) => {
    const isDir = (posi.mode & MODE_DIR) > 0;
    const name = isDir ? splitPath(posi.path.slice(0, -1)) : splitPath(posi.path);

    return {
      id: `${posi.tapeId}:${posi.path}`,
      name: name,
      ext: extname(name),
      isDir: isDir,
      isHidden: false,
      openable: isDir,
      selectable: false,
      draggable: false,
      droppable: false,
      size: Number(posi.size),
      modDate: moment.unix(Number(posi.writeTime)).toDate(),
    };
  });
}

function splitPath(filename: string): string {
  const idx = filename.lastIndexOf("/");
  if (idx < 0) {
    return filename;
  }
  return filename.slice(idx + 1);
}

function extname(filename: string): string {
  const idx = filename.lastIndexOf(".");
  if (idx < 0) {
    return "";
  }
  return filename.slice(idx);
}

function getID(file: File | SourceFile): string {
  if ("id" in file) {
    return `${file.id}`;
  }
  return file.path;
}

// export interface GetFileResponse {
//   file: File;
//   positions: Position[];
//   children: FileArray<File>;
// }
// export const getFile = async (id: string) => {
//   const result = await fetch(`${Domain}/api/v1/file/${id}`);
//   const body: GetFileResponse = await result.json();
//   return body;
// };

// export interface ListFileParentsResponse {
//   parents: FileArray<File>;
// }
// export const listFileParents = async (id: string) => {
//   const result = await fetch(`${Domain}/api/v1/file/${id}/_parent`);
//   const body: ListFileParentsResponse = await result.json();
//   return [Root, ...body.parents];
// };

// export interface SetFileResponse {
//   file?: File;
//   result?: string;
// }
// export const editFile = async (id: string, payload: Partial<File>) => {
//   const result = await fetch(`${Domain}/api/v1/file/${id}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });
//   const body: SetFileResponse = await result.json();
//   return body;
// };

// export const createFolder = async (
//   parentID: string,
//   payload: Partial<File>
// ) => {
//   const result = await fetch(`${Domain}/api/v1/file/${parentID}/`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });
//   const body: SetFileResponse = await result.json();
//   return body.file;
// };

// export const deleteFolder = async (ids: string[]) => {
//   const result = await fetch(`${Domain}/api/v1/file/`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ fileids: ids }),
//   });
//   const body: SetFileResponse = await result.json();
//   return body;
// };

// interface GetTapeResponse {
//   tape: Tape;
// }
// export const getTape = async (id: number) => {
//   const result = await fetch(`${Domain}/api/v1/tape/${id}`);
//   const body: GetTapeResponse = await result.json();
//   return body;
// };

// interface GetSourceResponse {
//   file: File;
//   chain: File[];
//   children: FileArray<File>;
// }
// export const getSource = async (path: string) => {
//   const result = await fetch(`${Domain}/api/v1/source/${path}`);
//   const body: GetSourceResponse = await result.json();
//   return body;
// };
