import m from 'mithril';

import { IAtomAttrs, IAtomComponent, IEvent} from '@app/domain';

export const NothingAtom: IAtomComponent = {
  view ( ) {
    return m('div.nothing.dn');
  },
};
interface ITitleAttrs extends IAtomAttrs {
  onclick?: (e: IEvent) => void;
  title: string;
  description: string;
}
export const SectionTitleAtom: IAtomComponent<ITitleAttrs> = {
  view ( { attrs } ) {
    const { title, description, onclick } = attrs;;
    return m('atom-section-title', { onclick },
      m('h2.f3.sair.white.pl2.mt3',  title),
      m('div.f4.sair.white.pl2.mt3',  description),
    );
  }
};


export const  YScrollAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-scroll-y', vnode.children);
  },
};

export const FlexListAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-flexlist', vnode.attrs, vnode.children);
  },
};

export const FlexListHeaderAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-flexlist-header',
      m('h3.cfff.sair', vnode.children)
    );
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



export const FlexListMenuEntryAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-flexlist-menu-entry.db', vnode.attrs, vnode.children);
  },
};






// export const FixedListAtom: IAtomComponent = {
//   view ( vnode ) {
//     return m('div.fixedlist.viewport-y', vnode.attrs, vnode.children);
//   },
// };
