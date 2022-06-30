import m from 'mithril';

import {
  // CheckboxCSS,
  // ButtonCSS,
  TextFieldCSS,
  // SwitchCSS,
  // ButtonGroupCSS
} from 'polythene-css';
import {
  // Button as polyButton,
  // Checkbox as polyCheckbox,
  TextField as polyTextField,
  // Switch as polySwitch,
  // ButtonGroup as polyButtonGroup,
} from 'polythene-mithril';

import { IAtomAttrs, IAtomComponent, IEvent} from '@app/domain';
import { App } from '@app/views';

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






TextFieldCSS.addStyle(`.atom-textfield-17`, {
  lineheight_input: 16,
  font_size_input: 16,
  dense_full_width_input_padding_v: 4,
  dense_full_width_input_padding_h: 16,
  color_light_input_background: 'white',
  color_light_input_text: '#333',
  color_light_background: '#688799',
  color_light_focus_border: "transparent",
});

interface ITextInputAttrs extends Partial<polyTextField> {
  onChange: (event: any) => void;
}

export const FlexListInputTextAtom: m.Component<ITextInputAttrs> = {
  view ( vnode ) {
    return m('atom-flexlist-input-text.fiob',
      m(polyTextField, {
        ...vnode.attrs,
        className: 'atom-textfield-17',
        floatingLabel: false,
        dense: true,
        fullWidth: true,
        label: 'type to search',
        tone: 'light'
      })
    );
  },
};



// TextFieldCSS.addStyle(`.atom-textfield`, {
//   color_light_input_background: 'white',
//   color_light_input_text: '#333',
//   color_light_background: '#688799',
// });


// const FormTextField: m.Component<ITextFieldAttrs> = {
//   view: ( vnode ) => m('atom-form-textfield.fior',
//     m(polyTextField, { ...vnode.attrs,
//       className: 'atom-textfield',
//       floatingLabel: true,
//       // dense:     true,
//   })),
// };

// export const FixedListAtom: IAtomComponent = {
//   view ( vnode ) {
//     return m('div.fixedlist.viewport-y', vnode.attrs, vnode.children);
//   },
// };
