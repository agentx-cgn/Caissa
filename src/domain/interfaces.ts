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
  squareFrom?: string;
  squareTo?: string;
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


export interface IMove { //extends Move {
  from: string;
  to:   string;
  fen:  string;
  ply:  number;
  move: string;
  san:  string;
}

export interface IPgnMove {
  drawOffer: boolean;
  moveNumber: number;
  notation: {
    col: string;
    row: string;
    promotion: string | null;
    notation: string;
    fig?: string | null;
    strike?: 'x' | null;
      check?: string;
      disc?: string;
      drop?: boolean;
  };
  variations: IPgnMove[][];
  nag: string[];
  commentDiag: GameComment;
  commentMove?: string;
  commentAfter?: string;

  turn: 'w' | 'b';
  color: 'w' | 'b';
  fen?: string;
  from?: string;
  to: string;
};

export interface IPgnHeader {
  White:        string;
  Black:        string;
  Event:        string;
  Site:         string;
  Round:        string;
  Date:         string;
  Result:       string;
  EventDate?:   string;
  UTCDate?:     string;
  Termination?: string;
  TimeControl?: string;
}

export interface IGameHeader {
  white:        string;
  black:        string;
  event:        string;
  site:         string;
  round:        string;
  date:         string;
  result:       string;
  termination?: string;
  timecontrol?: string;
}

export interface IGameTree {
  header:     IGameHeader
  uuid:       string;
  pgn:        string;
  searchtext: string;
  plycount:   number;
  moves:      IPgnMove[];
  score: {
    maxcp:    number;
    maxmate:  number;
  },

}

export interface IPlayMove extends IPgnMove {
  variations: any[][];
  from: string;
  to:   string;
  fen:  string;
  ply:  number;
  move: string;
  san:  string;
  color: 'w' | 'b';
}


export interface ITimeControl {
  budget: number;
  increment: number;
}
export type TRival = 'h' | 'm' | 's' | 'l' | '*';
export interface IPlayTree extends IGameTree {
  rivals: {
    'w': TRival;
    'b': TRival;
  };
  moves: IPlayMove[]
  ply: number;
  over: boolean;
  timecontrol: ITimeControl;
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
  collection: IPlayTree[];
  error: string;
  progress: number;
  header: () => string;
  fetch: () => Promise<void>;
}


export type TOpponent = 'h' | 's' | 'l';
export type IOpponents = {
  [k in TOpponent]: string;
};
export type TDifficulty = '0' | '3' | '5' | '10' | '20' | '30';
export type IDifficulties = {
  [k in TDifficulty]: string;
};
