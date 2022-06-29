import m from 'mithril';

import { ICellAttrs, ICellComponent, ICollectionProvider } from '@app/domain';
import { App } from '@app/views';

import { IEvent, IGameTree } from '@app/domain';

interface IAttrs extends ICellAttrs{
  provider: ICollectionProvider;
  searchtext: string
}

export const CollectionCell: ICellComponent<IAttrs> = {

  view ( vnode ) {

    const { provider, searchtext } = vnode.attrs;

    return m('cell-collection', [
      ...provider.collection
      .filter( (game: IGameTree) => searchtext ? game.searchtext.includes(searchtext) : true)
      .map( ( game: IGameTree ) => {
        return m('div.white.pointer', { onclick: (e: IEvent) => {

          e.redraw = false;
          App.route('/game/:turn/:uuid/', { uuid: game.uuid, turn: game.moves.length -1 });

        }}, game.tags?.White);
      } ),
    ]);

  },

};
