
import m from 'mithril';
import { IDispatcher } from '@app/domain';
import { FactoryService } from '@app/services';

let dispatcher: IDispatcher;

interface IAttrs {
  msecs: Number;
}

const LastAtom = FactoryService.create<IAttrs>('Last', {

  onregister (disp) {
    dispatcher = disp;
  },
  view ( ) {
    return m('div.last.dn');
  },
  onupdate ({ attrs: { msecs } }) {
    setTimeout( () => dispatcher.send({ msecs }), 100);
  },
  oncreate ({ attrs: { msecs } }) {
    setTimeout( () => dispatcher.send({ msecs }), 100);
  },

});

export { LastAtom };
