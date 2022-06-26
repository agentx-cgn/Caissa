import m from 'mithril';

import { IAtomAttrs, IAtomComponent, IEvent} from '@app/domain';

export const NothingAtom: IAtomComponent = {
  view ( ) {
    return m('div.nothing.dn');
  },
};
interface ITitleAttrs extends IAtomAttrs {
  className: string;
  style: string;
  onclick: (e: IEvent) => void;
}
export const SectionTitleAtom: IAtomComponent<ITitleAttrs> = {
  view ( { attrs, children } ) {
    const { className, style, onclick } = attrs;;
    return m('atom-section-title', { className, onclick },
      m('h2.f3.sair.white.pl2.mt3', { style }, children),
    );
  }
};


export const  YScrollAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-scroll-y', vnode.children);
  },
};

export const SpacerAtom: IAtomComponent = {
  view ( { attrs } ) {
    return m('atom-spacer', attrs, m.trust('&nbsp;'));
  },
};

export const GrowSpacerAtom: IAtomComponent = {
  view ( { attrs } ) {
    return m('atom-spacer.flex-grow', attrs, m.trust('&nbsp;'));
  },
};

export const FlexListAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-flexlist', vnode.attrs, vnode.children);
  },
};

export const TextLeftAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-text-left.db.tl.fiom.f4.white',
      m('span', vnode.attrs, vnode.children)
    );
  },
};

export const FlexListTextCenterAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-text-center.db.tc.fiom.f4.white',
      m('span', vnode.attrs, vnode.children)
    );
  },
};

export const FlexListTextAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-flexlist-text',
      m('.fiom', vnode.attrs, vnode.children)
    );
  },
};

export const FlexListEntryAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-flexlist-entry', vnode.attrs,
      m('div', vnode.children)
    );
  },
};

export const FlexListHeaderAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-flexlist-header',
      m('h3.cfff.sair', vnode.children)
    );
  },
};

export const FlexListMenuEntryAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-flexlist-menu-entry.db', vnode.attrs, vnode.children);
  },
};






export const FixedListAtom: IAtomComponent = {
  view ( vnode ) {
    return m('div.fixedlist.viewport-y', vnode.attrs, vnode.children);
  },
};
