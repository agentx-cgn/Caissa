import m from 'mithril';
import { IEvent, TVoid } from '@app/domain';
import { $ } from '@app/services';

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
      $('back-drop')!.classList.add('visible');
      callback = cb || null;
    },
    hide () {
      $('back-drop')!.classList.remove('visible');
    },
    view ( vnode ) {

      const { callback } = vnode.attrs;

      return m('back-drop', { onclick: (e: IEvent) => {
        e.redraw = false;
        BackdropCell.hide();
        callback && callback();
      }});

  },

};

export  { BackdropCell };
