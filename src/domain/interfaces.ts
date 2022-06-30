/* eslint-disable @typescript-eslint/no-explicit-any */

import m  from 'mithril';
import { Move } from 'chess.js';
import { GameComment } from '@mliebelt/pgn-parser';

export type TVoid = () => void;

export interface IObj extends Record<string, any> {}
export interface IMsg extends IObj {}
export interface IParams extends m.Params {};


//  ##############   P A G E S,  C E L L S,  A T O M S   ##############

export interface IPageData {
  [name: string]: string | number | boolean | any;
};
export type TPageOptions = {
  title: string;
  description: string;
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

export interface ICellContentAttrs extends IAppAttrs { };
export interface ICellContentComponent<A=ICellContentAttrs> extends m.Component<A> {};

export interface IAppAttrs {
  route: string;
  params: m.Params;
  options: TPageOptions
}
export interface IAppComponent extends m.Component<IAppAttrs> {};

interface ILayoutAttrs extends IAppAttrs {
  center: ICellContentComponent;
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
  onmatch?: (route: string, params: IParams, data: IPageData) => Promise<unknown>;
}

export interface IPageAttrs extends ICellAttrs, IAppAttrs {}
export interface IPageTemplateAttrs extends IPageAttrs {}
export interface IPageTemplate extends m.Component<IPageTemplateAttrs, IPage>, ITemplate {};
export interface IPageNode extends m.Component<IPageTemplateAttrs, IPage>, ITemplate, IPage {};
export type IPageComponent<A=IPageAttrs, S=IPage> = (vnode: m.Vnode<A,S>) => IPageNode;
export type IAppPageComponent = () => IPageNode;



//  ##############   R O U T E S  ##############

export type TRouteConfig = [ILayoutComponent, IPageComponent<IPageAttrs>, ICellContentComponent, TPageOptions];
export interface IRoutesConfigs {
  [route: string]: TRouteConfig;
}

export interface IRouteOptions {
  redraw?: boolean;
  replace?: boolean;
  back?: boolean;
  fore?: boolean;
  noanimation?: boolean;
}


//  ##############   E V E N T S   ##############

export interface IEvent extends Event {
  redraw?: boolean;
  code?:   string;
  value?: string | number | boolean;
}


//  ##############   C H E S S    ##############

export interface IBoard {
  uuid:        string,
  fen:         string,
  moveStart:   string,
  bestmove:    {
    move: {
      from: string,
      to: string
    },
    ponder: {
      from: string,
      to: string
    }
  },
  captured:    {
    white: string[],
    black: string[]
  },
  orientation: 'w' | 'b',  //COLOR.white
  buttons:   {
      rotate:   boolean | null, // tristate buttons
      backward: boolean | null,
      forward:  boolean | null,
      left:     boolean | null,
      right:    boolean | null,
      play:     boolean | null,
      pause:    boolean | null,
      evaluate: boolean | null,
      spinner:  boolean | null,
  }
};

export interface IPgnMove {
  drawOffer: boolean;
  moveNumber: number;
  notation: {
      fig?: string | null;
      strike?: 'x' | null;
      col: string;
      row: string;
      check?: string;
      promotion: string | null;
      notation: string;
      disc?: string;
      drop?: boolean;
  };
  variations: IPgnMove[][];
  nag: string[];
  commentDiag: GameComment;
  commentMove?: string;
  commentAfter?: string;
  turn: 'w' | 'b';
};

export interface IGameTree {
  header: {
    white: string;
    black: string;
    date: string;
    result: string;
    event: string;
    site: string;
    round: string;
  }
  uuid: string;
  pgn: string;
  searchtext: string;
  over: boolean;
  plycount: number;
  moves: IPgnMove[];
  score: {
    maxcp: number;
  },

}

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
  collection: IGameTree[];
  error: string;
  progress: number;
  header: () => string;
  fetch: () => Promise<void>;
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
