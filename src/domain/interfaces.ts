/* eslint-disable @typescript-eslint/no-explicit-any */

import m, { Attributes } from 'mithril';
import { Move } from 'chess.js';
import { ICheckboxAttrs } from '@app/atoms';


// export interface IAttrs {
//   // [k: string]: string | number;
//   [k: string, v: string | number];
// }

export type TVoid = () => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IObj extends Record<string, any> {}
export interface IMsg extends IObj {}
// export interface IAttrs extends Record<string, string | number> {}

export type TPageOptions = {
  title: string;
  description: string;
};

export interface IDefaultAttrs {
  route: string;
  params: m.Params;
  options: TPageOptions
}
export interface IDefaultCellAttrs {
  className: string;
  style: string;
}

export interface IPageAttrs extends IDefaultAttrs {
  className: string;
  style: string;
  module?: string;  // SystemPage
  url: string;                 // HelpPage
}

interface ILayoutAttrs  extends IDefaultAttrs {
  // page: IPage<IPageAttrs>;
  center: m.Component;
}


interface IFormAttrs  {
  onsubmit: (v: IFormValues) => void;
  onchange?: (v: IFormValues) => void;
  fields: IFormField[];
  values: IFormValues;
  className?: string;
  style?: string;
}

export interface IFormField {
  name: string;
  type: 'submit' | 'button' | 'textfield' | 'select' | 'checkbox' | 'radio' | 'file' | 'note' | 'header';
  label: string;
  value?: string | number | boolean;
  help?: string;
  className?: string;
  style?: string;
};

export interface IFormGroup {
  type: 'group';
  childs: IFormField[];
};

export interface IFormValues {
  [name: string]: string | number | boolean;
};

export interface IPageData {
  [name: string]: string | number | boolean | any;
};

export interface IFakePage {
  (): {
    data: IPageData;
    onmatch?: (route: string, params: IParams, data: IPageData) => Promise<boolean>
  };
}

export interface IParams extends m.Params {};

export interface IComponent<A={}, S={}> extends m.Component<A,S> {};
export interface IDefComponent extends m.Component<IDefaultAttrs> {};
export interface IDefCellComponent extends m.Component<IDefaultCellAttrs> {};
export interface ILayoutComponent extends m.Component<ILayoutAttrs> {};
export interface IFormCellComponent extends m.Component<IFormAttrs> {};


export interface IPageTemplate<A={}> extends IComponent<A> {
  // onregister?: (dispatcher: IDispatcher) => void;
  onmessage?: (source: string, msg: IMsg) => void;
  onmatch?: (route: string, params: IParams, data: IPageData) => Promise<boolean>;
};

// type FactoryComponent<A = {}> = (vnode: Vnode<A>) => Component<A>;

export interface IPageNode<A=IDefaultAttrs> extends IComponent<A>, IPageTemplate<A> {
  name: string;
  data: IPageData,
  preventUpdates: boolean;
};

// export interface IPage<A=IDefaultAttrs> extends m.FactoryComponent<A>, IPageTemplate<A> {
// https://melvingeorge.me/blog/add-properties-to-functions-typescript
export interface IPage<A=IPageAttrs> extends m.FactoryComponent<A> {
  // name: string;
  // preventUpdates: boolean;
};

export type TRouteConfig = [ILayoutComponent, IPage<IPageAttrs>, IComponent<any>, TPageOptions];
export interface IRoutesConfigs {
  [route: string]: TRouteConfig;
}

export interface IDispatcher {
  send: (msg: IMsg) => void;
}

export interface IRouteOptions {
  redraw?: boolean;
  replace?: boolean;
  back?: boolean;
  fore?: boolean;
  noanimation?: boolean;
}

export interface IEvent extends Event {
  redraw?: boolean;
  code?:   string;
}

export type TMove = Move & {
  from: string;
  to: string;
  fen: string;
  turn: number;
  move: string;
  san: string;
}

export type TPgnHeader = {
  White:       string;
  Black:       string;
  Event:       string;
  Site:        string;
  Round:       string;
  Date:        string;
  EventDate?:        string;
  UTCDate?:        string;
  Result:      string;
  Termination: string;
  TimeControl: string;
}

export type TGame = {
  uuid:         string;     // string, 6 or 8 alphanums
  date:         string;     // string, ISO date
  timestamp?:   number;     // number, unix timestamp
  over:         boolean;
  rivals:       string;
  turn:         number;
  moves:        TMove[];
  plycount:     number;
  score:       {
      maxcp:    number;
      maxmate:  number;
  },
  header:      TPgnHeader
  pgn:         string;             // game moves in pgn notation
  searchtext:  string;             // search text
}

export type TOpponent = 'h' | 's' | 'l';
export type IOpponents = {
  [k in TOpponent]: string;
};
export type TDifficulty = '0' | '3' | '5' | '10' | '20' | '30';
export type IDifficulties = {
  [k in TDifficulty]: string;
};




export type ICollection = {
  uuid: string;
  caption: string;
  icon: string;
  source: string;
  provider: string;
  subline: string;
  infolink?: string;
}

export interface ICollectionProvider extends ICollection {
  games: TGame[];
  error: string;
  progress: number;
  header: () => string;
  fetch: () => Promise<void>;
}
