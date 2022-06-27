import m from 'mithril';
// import { Ripple as RipplePoly } from 'polythene-mithril';

import { IAtomAttrs, IAtomComponent, IEvent} from '@app/domain';
import { App } from '@app/views';

// interface IRippleAttrs extends IAtomAttrs {
//   onend?: (e: IEvent) => void;
// }
// const RippleAtom: IAtomComponent<IRippleAttrs> = {
//   view ( vnode ) {
//     const { onend } = vnode.attrs;
//     return m(RipplePoly, {
//       startOpacity: 0.7,
//       duration: 1.5,
//       style: {
//         color: "#fff8"
//       },
//       end: onend
//     });
//   },
// };

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
      m('h2',  title),
      m('div',  description),
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
      m('h3.white.sail', vnode.children)
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
      m('div', vnode.children),
      // m(Ripple)
    );
  },
};



export const FlexListMenuEntryAtom: IAtomComponent = {
  view ( vnode ) {
    return m('atom-flexlist-menu-entry.db.relative', vnode.attrs,
    // m(RippleAtom),
    vnode.children);
  },
};
// export const FlexListMenuEntryAtom: IAtomComponent<ILinkAttrs> = {
//   view ( vnode ) {
//     const { route, params } = vnode.attrs;
//     const onend = (e: IEvent) => {
//       e.redraw = false;
//       App.route(route, params);
//     };
//     return m('atom-flexlist-menu-entry.db.relative', {onclick: onend}, vnode.attrs,
//     // m(RippleAtom, { onend } ),
//     vnode.children);
//   },
// };


interface ILinkAttrs {
  route: string;
  params: m.Params;
}

export const FlexListLinkAtom: IAtomComponent<ILinkAttrs> = {
  view ( vnode ) {
    const { route, params } = vnode.attrs;
    const onend = (e: IEvent) => {
      e.redraw = false;
      App.route(route, params);
    };
    return m('atom-flexlist-link.db.relative', { onclick: onend },
      // m(RippleAtom, { onend } ),
      vnode.children
    );
  },
};






// export const FixedListAtom: IAtomComponent = {
//   view ( vnode ) {
//     return m('div.fixedlist.viewport-y', vnode.attrs, vnode.children);
//   },
// };
