/* eslint-disable @typescript-eslint/no-explicit-any */

import m  from 'mithril';
import { Move } from 'chess.js';
// import { ICheckboxAttrs } from '@app/atoms';


// export interface IAttrs {
//   // [k: string]: string | number;
//   [k: string, v: string | number];
// }

export type TVoid = () => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IObj extends Record<string, any> {}
export interface IMsg extends IObj {}
// export interface IAttrs extends Record<string, string | number> {}


export interface IParams extends m.Params {};
export interface IPageData {
  [name: string]: string | number | boolean | any;
};

export interface IAtomAttrs {
  className?: string;
  style?: string;
  onclick?: (e:IEvent) => void;
}
export interface IAtomComponent<A=IAtomAttrs> extends m.Component<A> {};

export interface ICellAttrs {
  className: string;
  style: string;
  onclick?: (e:IEvent) => void;
}
export interface ICellComponent<A=ICellAttrs> extends m.Component<A> {};

export interface IAppAttrs {
  route: string;
  params: m.Params;
  options: TPageOptions
}
export interface IAppComponent extends m.Component<IAppAttrs> {};


interface ILayoutAttrs extends IAppAttrs {
  center: ICellComponent;
}
export interface ILayoutComponent extends m.Component<ILayoutAttrs> {};

interface IPage {
  name: string;
  data: IPageData;
  preventUpdates: boolean;
}

interface IDispatcher {
  send: (msg: IMsg) => void;
}
interface ITemplate {
  onregister?: (dispatcher: IDispatcher) => void;
  onmessage?: (source: string, msg: IMsg) => void;
  onmatch?: (route: string, params: IParams, data: IPageData) => Promise<boolean>;
}

export interface IPageAttrs extends ICellAttrs, IAppAttrs {}

export interface IPageTemplateAttrs extends IPageAttrs {}

export interface IPageTemplate extends m.Component<IPageTemplateAttrs, IPage>, ITemplate {};

export interface IPageNode extends m.Component<IPageTemplateAttrs, IPage>, ITemplate, IPage {};

export type IPageComponent<A=IPageAttrs, S=IPage> = (vnode: m.Vnode<A,S>) => IPageNode;
export type IAppPageComponent = () => IPageNode;

// export interface IPageComponent<A=IPageAttrs,S=IPageState> extends m.FactoryComponent<A,S> {
// export interface IPageComponent extends m.Component<IPageAttrs, IPageState> {};
// type FactoryComponent<A = {}> = (vnode: Vnode<A>) => Component<A>;









//   export interface IDefaultAttrs {
//   route: string;
//   params: m.Params;
//   options: TPageOptions
// }
// export interface IDefaultCellAttrs {
//   className: string;
//   style: string;
// }

// export interface IPageAttrs extends IDefaultAttrs {
//   className: string;
//   style: string;
//   module?: string;  // SystemPage
//   url: string;                 // HelpPage
// }

// interface ILayoutAttrs  extends IDefaultAttrs {
//   // page: IPage<IPageAttrs>;
//   center: m.Component;
// }




// export interface IFakePage {
//   (): {
//     data: IPageData;
//     onmatch?: (route: string, params: IParams, data: IPageData) => Promise<boolean>
//   };
// }

// export interface IParams extends m.Params {};

// export interface IComponent<A={}, S={}> extends m.Component<A,S> {};
// export interface IDefComponent extends m.Component<IDefaultAttrs> {};
// export interface IDefCellComponent extends m.Component<IDefaultCellAttrs> {};


// export interface ILayoutComponent extends m.Component<ILayoutAttrs> {};


// export interface IPageTemplate<A={}> extends IComponent<A> {
//   // onregister?: (dispatcher: IDispatcher) => void;
//   onmessage?: (source: string, msg: IMsg) => void;
//   onmatch?: (route: string, params: IParams, data: IPageData) => Promise<boolean>;
// };

// // type FactoryComponent<A = {}> = (vnode: Vnode<A>) => Component<A>;

// export interface IPageNode<A=IDefaultAttrs> extends IComponent<A>, IPageTemplate<A> {
//   name: string;
//   data: IPageData,
//   preventUpdates: boolean;
// };

// export interface IPage<A=IDefaultAttrs> extends m.FactoryComponent<A>, IPageTemplate<A> {
// https://melvingeorge.me/blog/add-properties-to-functions-typescript
// export interface IPage<A=IPageAttrs> extends m.FactoryComponent<A> {
//   // name: string;
//   // preventUpdates: boolean;
// };



export type TRouteConfig = [ILayoutComponent, IPageComponent<IPageAttrs>, ICellComponent, TPageOptions];
export interface IRoutesConfigs {
  [route: string]: TRouteConfig;
}

// export interface IDispatcher {
//   send: (msg: IMsg) => void;
// }
export interface IRouteOptions {
  redraw?: boolean;
  replace?: boolean;
  back?: boolean;
  fore?: boolean;
  noanimation?: boolean;
}

export type TPageOptions = {
  title: string;
  description: string;
};

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
