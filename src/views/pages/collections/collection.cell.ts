import m from 'mithril';

import { ICellComponent, ICollectionProvider, IEvent, IGameTree } from '@app/domain';
import { AppConfig } from '@app/config';
import { App } from '@app/views';
import { DatabaseService as DB } from '@app/services';
import { GameEntryAtom } from './gameentry.atom';

interface IAttrs {
  provider: ICollectionProvider;
  searchtext: string
}

export const CollectionCell: ICellComponent<IAttrs> = {

  view ( vnode ) {

    const { provider, searchtext } = vnode.attrs;

    return m('cell-collection.mv2.ph3',
      provider.collection
        .filter( (game: IGameTree) => searchtext ? game.searchtext.includes(searchtext) : true)
        .map( ( game: IGameTree ) => {

          const onclick = (e: IEvent) => {

            if (!DB.Games.exists(game.uuid)) {
              game = Object.assign({}, AppConfig.templates.game, game, { turn: game.moves.length -1 });
              // // spend games a prototype
              // game.moves = Array.from(game.moves);
              // Tools.Games.updateMoves(game);
              DB.Games.create(game, true);
              // DB.Games.update(game.uuid, { turn: game.moves.length -1 }, true);
              DB.Boards.create(Object.assign(AppConfig.templates.board, { uuid: game.uuid }));
          }

            e.redraw = false;
            App.route('/game/:uuid/:ply/', { uuid: game.uuid, ply: game.moves.length -1 });

          };

          return m(GameEntryAtom, { game, onclick });

        })
      ,
    );

  },

};
