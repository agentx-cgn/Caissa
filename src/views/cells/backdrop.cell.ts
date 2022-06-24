import m from 'mithril';

import { IEvent, TVoid } from '@app/domain';

const $ = document.querySelector.bind(document);

let callback = null;

// https://github.com/MithrilJS/mithril.d.ts/blob/master/test/test-component.ts#L119

interface IAttrs  {
  callback: () => void;
}
interface IState {
  hide: TVoid;
  show: (cb: TVoid) => void;
}

const BackdropCell: m.Component<IAttrs, IState> & IState = {

    show (cb: TVoid) {
      $('cell-backdrop')!.classList.add('visible');
      callback = cb || null;
    },
    hide () {
      $('cell-backdrop')!.classList.remove('visible');
    },
    view ( vnode ) {

      const { callback } = vnode.attrs;

      return m('cell-backdrop', { onclick: (e: IEvent) => {
        e.redraw = false;
        BackdropCell.hide();
        callback && callback();
      }});

  },

};

export  { BackdropCell };
