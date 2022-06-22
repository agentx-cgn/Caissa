/* eslint-disable @typescript-eslint/no-explicit-any */

import m, { Attributes } from 'mithril';

// export interface IAttrs {
//   // [k: string]: string | number;
//   [k: string, v: string | number];
// }

export type TVoid = () => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IObj extends Record<string, any> {}
export interface IMsg extends IObj {}
// export interface IAttrs extends Record<string, string | number> {}

export interface IDefaultAttrs {
  route: string;
  params: m.Params;
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
  page: IPage<IPageAttrs>;
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


export interface IParams extends m.Params {};

export interface IComponent<A={}, S={}> extends m.Component<A,S> {};
export interface IDefComponent extends m.Component<IDefaultAttrs> {};
export interface IDefCellComponent extends m.Component<IDefaultCellAttrs> {};
export interface ILayoutComponent extends m.Component<ILayoutAttrs> {};
export interface IFormCellComponent extends m.Component<IFormAttrs> {};


export interface IPageTemplate<A={}> extends IComponent<A> {
  // onresize?: (width: number, height: number) => void;
  onregister?: (dispatcher: IDispatcher) => void;
  onmessage?: (source: string, msg: IMsg) => void;
};

// type FactoryComponent<A = {}> = (vnode: Vnode<A>) => Component<A>;

export interface IPageNode<A=IDefaultAttrs> extends IComponent<A>, IPageTemplate<A> {
  name: string;
  preventUpdates: boolean;
};

// export interface IPage<A=IDefaultAttrs> extends m.FactoryComponent<A>, IPageTemplate<A> {
// https://melvingeorge.me/blog/add-properties-to-functions-typescript
export interface IPage<A=IPageAttrs> extends m.FactoryComponent<A> {
  // name: string;
  // preventUpdates: boolean;
};

export type TRouteConfig = [ILayoutComponent, IPage<IPageAttrs>, IComponent<any>, { title: string }];
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
