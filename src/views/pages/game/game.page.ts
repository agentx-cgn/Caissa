import m from 'mithril';
import './game.page.scss';

import { DatabaseService as DB, ToolsService as Tools, FactoryService } from '@app/services';
import { YScrollAtom, SectionTitleAtom, FlexListHeaderAtom, FlexListAtom, FlexListTextCenterAtom, GrowSpacerAtom, SpacerAtom } from '@app/atoms';
import { PanelMovesCell } from '@app/cells';
import { GameMovesCell } from './gamemoves.cell';

const GamePage = FactoryService.create('Game', {

  view ( vnode ) {

    const { params: { uuid='default', ply=-1 }, className } = vnode.attrs;

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
    const title = game.header.white  + ' - ' + game.header.black;
    const lineResult   = Tools.Format.lineResult(game);

    return m('div.page.game', { className },
      m(SectionTitleAtom, { title, description: '' } ),
      m(FlexListHeaderAtom, `lore ipsum dolor sit amet, consectetur adipiscing elit.` ),
      m(YScrollAtom,
        m(FlexListAtom, [
          m(PanelMovesCell,    { game }),
          m(SpacerAtom),
          m(FlexListTextCenterAtom,    { className: 'gm-result' }, lineResult ),
          m(GrowSpacerAtom),
        ]),
      ),
    );

  },

});

export { GamePage, GameMovesCell };
