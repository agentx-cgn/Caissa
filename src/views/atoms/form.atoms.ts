
import { IComponent, IDefaultCellAttrs, IDefCellComponent } from '@app/domain';
import m from 'mithril';
import './form.atoms.scss';

// DEMO: https://arthurclemens.github.io/polythene-demos/mithril/#/
// https://github.com/ArthurClemens/polythene/tree/master/docs/components

import {
  CheckboxCSS,
  ButtonCSS,
  TextFieldCSS,
  SwitchCSS,
  ButtonGroupCSS
} from 'polythene-css';

import {
  Button as polyButton,
  Checkbox as polyCheckbox,
  TextField as polyTextField,
  Switch as polySwitch,
  ButtonGroup as polyButtonGroup,
} from 'polythene-mithril';


// Button
// https://arthurclemens.github.io/polythene-demos/mithril/#/raised-button

ButtonCSS.addStyle(`.atom-button`, {
  color_light_background: '#688799',
  color_light_text: '#fff',
  border_radius: 11,
  label_padding_v: 5,
});

interface IButtonAttrs extends Partial<polyButton> { }

const FormButton: IComponent<IButtonAttrs> = {
  view: ( vnode ) => m('atom-form-button',
    m(polyButton, Object.assign({
      className: 'atom-button',
      // separatorAtStart: false,
      raised: true,
      wash: true,
    }, vnode.attrs )
  )),
};

const AtomButton: IComponent<IButtonAttrs> = {
  view: ( vnode ) => m(polyButton, Object.assign({
      className: 'atom-button',
      raised: true,
      wash: true,
    }, vnode.attrs )
  )
};


// Checkbox

CheckboxCSS.addStyle(".atom-checkbox", {
  color_light_on:    "#eee",
  color_light_off:   "#eee",
  color_light_label: "#333",
});

interface ICheckboxAttrs extends Partial<polyCheckbox> { }

const FormCheckbox: IComponent<ICheckboxAttrs> = {
  view: ( vnode ) => m('atom-form-checkbox.fior',
    m(polyCheckbox, { ...vnode.attrs,
      className: 'atom-checkbox',
      raised: true,
  })),
};


// TextField
// https://arthurclemens.github.io/polythene-demos/mithril/#/textfield
// https://github.com/ArthurClemens/polythene/blob/master/packages/polythene-css-textfield/index.d.ts
// https://github.com/ArthurClemens/polythene/blob/master/packages/polythene-core-textfield/index.d.ts

TextFieldCSS.addStyle(`.atom-textfield`, {
  color_light_input_background: 'white',
  color_light_input_text: '#333',
  color_light_background: '#688799',

});

interface ITextFieldAttrs extends Partial<polyTextField> { }

const FormTextField: IComponent<ITextFieldAttrs> = {
  view: ( vnode ) => m('atom-form-textfield.fior',
    m(polyTextField, { ...vnode.attrs,
      className: 'atom-textfield',
      floatingLabel: true,
      // dense:     true,
  })),
};


// Note

interface INoteAttrs { label: string }

const FormNote: IComponent<INoteAttrs> = {
  view: ( vnode ) => {
    return m('atom-form-note',
      m('.fior', vnode.attrs.label)
    );
  },
};

// Header

interface IHeaderAttrs { label: string }

const FormHeader: IComponent<IHeaderAttrs> = {
  view: ( vnode ) => {
    return m('atom-form-header',
      m('h3.cfff.sair', vnode.attrs.label)
    );
  },
};

// m('h3.pv2.ph3.cfff.sair', label),

// List
const FormListAtom: IDefCellComponent = {
  view ( vnode ) {
    return m('atom-form-list', vnode.attrs, vnode.children);
  },
};

export {
  FormListAtom,
  AtomButton, FormButton,      IButtonAttrs,
  FormCheckbox,    ICheckboxAttrs,
  FormTextField,   ITextFieldAttrs,
  FormNote,        INoteAttrs,
  FormHeader,      IHeaderAttrs,
  polySwitch as Switch,
  polyButtonGroup as ButtonGroup,
};



// export {
//   Button,
//   Card,
//   Checkbox,
//   TextField,
//   Dialog,
//   Drawer,
//   FAB,
//   Icon,
//   IconButton,
//   IOSSpinner,
//   List,
//   ListTile,
//   MaterialDesignSpinner,
//   Menu,
//   Notification,
//   RadioGroup,
//   Slider,
//   Snackbar,
//   SVG,
//   Switch,
//   Tabs,
//   Toolbar,
//   ToolbarTitle,
// } from 'polythene-mithril';
