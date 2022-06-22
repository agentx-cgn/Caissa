import m from 'mithril';

import { IComponent, IDefCellComponent, IDefComponent, IEvent, IPage} from '@app/domain';
import { FactoryService as Factory } from "@app/services";

export const NothingAtom: IComponent = {
  view ( ) {
    return m('div.nothing.dn');
  },
};
interface ITitleAttrs {
  className: string;
  style: string;
  onclick: (e: IEvent) => void;
}
export const SectionTitleAtom: IComponent<ITitleAttrs> = {
  view ( { attrs, children } ) {
    const { className, style, onclick } = attrs;;
    return m('atom-section-title', { className, onclick },
      m('span', { style }, children),
    );
  }
};


export const  YScrollAtom: IComponent = {
  view ( vnode ) {
    return m('atom-scroll-y', vnode.children);
  },
};

export const SpacerAtom: IComponent = {
  view ( { attrs } ) {
    return m('atom-spacer', attrs, m.trust('&nbsp;'));
  },
};

export const GrowSpacerAtom: IComponent = {
  view ( { attrs } ) {
    return m('atom-spacer.flex-grow', attrs, m.trust('&nbsp;'));
  },
};

export const FlexListAtom: IDefCellComponent = {
  view ( vnode ) {
    return m('atom-flexlist', vnode.attrs, vnode.children);
  },
};

export const TextLeftAtom: IComponent = {
  view ( vnode ) {
    return m('atom-text-left.db.tl.fiom.f4.white',
      m('span', vnode.attrs, vnode.children)
    );
  },
};

export const FlexListTextCenterAtom: IComponent = {
  view ( vnode ) {
    return m('atom-text-center.db.tc.fiom.f4.white',
      m('span', vnode.attrs, vnode.children)
    );
  },
};

export const FlexListTextAtom: IComponent<{style?: string}> = {
  view ( vnode ) {
    return m('atom-flexlist-text',
      m('.fiom', vnode.attrs, vnode.children)
    );
  },
};

export const FlexListEntryAtom: IComponent<{style?: string}> = {
  view ( vnode ) {
    return m('atom-flexlist-entry', vnode.attrs,
      m('div', vnode.children)
    );
  },
};

export const FlexListHeaderAtom: IComponent = {
  view ( vnode ) {
    return m('atom-flexlist-header',
      m('h3.cfff.sair', vnode.children)
    );
  },
};

export const FlexListMenuEntryAtom: IComponent<{onclick: (e:IEvent)=>void}>= {
  view ( vnode ) {
    return m('atom-flexlist-menu-entry.db', vnode.attrs, vnode.children);
  },
};






export const FixedListAtom: IComponent = {
  view ( vnode ) {
    return m('div.fixedlist.viewport-y', vnode.attrs, vnode.children);
  },
};
