
import { IAtomComponent, IEvent, IGameTree } from '@app/domain';
import { H } from '@app/services';
import m from 'mithril';

interface IAttrs {
  game: IGameTree;
  onclick: (e: IEvent) => void;
}

var unique = (str: string) => str
  .split(' ')
  .filter(Boolean)
  .filter(function(item, i, allItems){
    return i==allItems.indexOf(item);
  })
  .join(' ')
;

const GameEntryAtom: IAtomComponent<IAttrs> = {

  view ( vnode ) {

      const { game, onclick } = vnode.attrs;

      let line1 = `${game.header.white} - ${game.header.black}`.trim();
      let item1 = `<b class="fiob">${game.header.result}</b> (${game.plycount}) &nbsp`.trim();
      let item2 = unique(`${game.header.date} ${game.header.site} ${game.header.event}`.trim());

      return m('game-entry.db.pt2.pointer', { onclick }, [
          m('div.game-line1.f4.sait.white', line1 ),
          m('div.game-line2.f5.fior', [
            m.trust(item1),
            m.trust(item2),
          ]),
      ]);

  },

};

export { GameEntryAtom };
