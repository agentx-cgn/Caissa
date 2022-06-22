export type TTableNames = 'Boards' | 'Games' | 'Options' | 'Usage';

export type TDump = { [key in TTableNames | 'Scheme']: object };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type  TRow = any;

export type TTableTemplates = {
  [key in TTableNames]: object
};

export interface ITable {
  dump: () => void;
  toggleUpdates: () => void;
  length: number;
  list: TRow[];
  first: TRow | undefined;
  exists: (uuid: string) => boolean;
  find: (uuid: string) => TRow | undefined;
  filter: (fn: (row: TRow) => boolean) => TRow[];
  clear: (force?: boolean) => void;
  create: (row: TRow, force?: boolean) => TRow;
  createget: (uuid: string, template?: object, force?: boolean) => TRow;
  delete: (what: string | ((row: TRow) => boolean), force?: boolean) => void;
  update: (uuid: string, diff: object, force?: boolean) => TRow;
  persist: (force?: boolean) => void;
}

export type IDatabase = {
  [key in TTableNames]: ITable;
} & {
  scheme: string;
  reset: () => void;
  init: () => void;
  all: () => TDump;
  dump: () => void;
  persist: () => void;
  size: () => number;
};;
