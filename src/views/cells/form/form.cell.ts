import m from 'mithril';
import stream from "mithril/stream";
import './form.cell.scss';

import { IEvent, IFormCellComponent, IFormField, IFormValues } from '@app/domain';
import { FormListAtom, FormButton, FormCheckbox, FormTextField, FormNote, FormHeader } from '@app/atoms';

type TState = stream<string | boolean | number>;
type TStates = {
  [key: string]: TState;
}

const controls = {
  button:     FormButton,
  submit:     FormButton,
  textfield:  FormTextField,
  checkbox:   FormCheckbox,
  note:       FormNote,
  header:     FormHeader,
};

function readState(state: TStates): IFormValues {
  const result = {} as IFormValues;
  Object.entries(state).forEach(([key, stream]) => {
    result[key] = stream();
  });
  return result;
}

function createState(values: IFormValues): TStates {
  const result = {} as TStates;
  Object.entries(values).forEach(([key, value]) => {
    result[key] = stream(value);
  });
  return result;
}

function renderField(field: IFormField, state: TState, onchange: (e: IEvent)=>void, onsubmit: (e: IEvent)=>void) {

  if (field.type === 'button' || field.type === 'submit') {
    return m(controls[field.type], {
      label:     field.label,
      events: {
        onclick: field.type === 'submit' ? onsubmit: onchange
      }
    });

  } else if (field.type === 'textfield') {
    return m(controls[field.type], {
      label:     field.label,
      help:      field.help,
      onChange:  newState => state(newState.value),
      value:     state() as string,
    });

  } else if (field.type === 'checkbox') {
    return m(controls[field.type], {
      label:     field.label,
      checked:   state() as boolean,
      onChange:  newState => state(newState.checked),
    });

  } else if (field.type === 'note') {
    return m(controls[field.type], {
      label:     field.label,
    });

  } else if (field.type === 'header') {
    return m(controls[field.type], {
      label:     field.label,
    });

  } else {
    return m('div', JSON.stringify(field));

  }

}

export const FormCell: IFormCellComponent = {

  oninit ( vnode ) {
    Object.assign(vnode.state, createState(vnode.attrs.values));
  },

  view ( vnode ) {

    const state: TStates = vnode.state;
    const { fields, onsubmit, onchange=()=>{}, className='', style='' } = vnode.attrs;

    const onformsubmit = () => onsubmit(readState(state));
    const onformchange = () => onchange(readState(state));

    return m('cell-form', { className, style }, [

      m(FormListAtom, { className, style }, [
        fields.map((field: IFormField) => {
          return renderField(field, state[field.name], onformchange, onformsubmit);
        })
      ]),

    ]);

  },

};
