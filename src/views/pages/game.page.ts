import m from 'mithril';

import { DatabaseService as DB, FactoryService } from '@app/services';
import { YScrollAtom, SectionTitleAtom, FlexListHeaderAtom, FlexListAtom, FlexListLinkAtom } from '@app/atoms';

const GamePage = FactoryService.create('Game', {

  view ( vnode ) {

    const { params: { uuid='default', turn=-1 }, className, options: { title, description } } = vnode.attrs;

    // there must be a complete game + turn, //TODO: except deeplink
    const game  = DB.Games.find(String(uuid));
    const board = DB.Boards.find(String(uuid));

    if(!game || !board) {
        // game or board are not properly prepared... :(
        // eslint-disable-next-line no-debugger
        console.log('GamePage: game and/or board not found', uuid);
        // debugger;
    }

    // const titlePlayers = Tools.Format.titlePlayers(game);
    // const lineResult   = Tools.Format.lineResult(game);

    return m('div.page.game', { className },
      m(SectionTitleAtom, { title, description } ),
      m(FlexListHeaderAtom, `lore ipsum dolor sit amet, consectetur adipiscing elit.` ),
      m(FlexListLinkAtom, { route: '', params: {} }, 'This is a Link' ),
    );

  },

});

export { GamePage };
