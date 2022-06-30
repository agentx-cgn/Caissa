import m from 'mithril';
import './board.content.cell.scss';

import { ICellContentComponent, IGameTree } from '@app/domain';
import { SectionTitleAtom } from '@app/atoms';
import { DatabaseService as DB } from '@app/services';
import { ChessboardCell } from './chessboard.cell';
import { ToolbarCell } from '../toolbar/toolbar.cell';

const DEBUG = false;

let lastturn: string, lastuuid: string, game, board, controller;

export const ContentCellBoard: ICellContentComponent = {

  view ( vnode ) {

    // at start, there is nothing, default is chosen
    let { params: { uuid='default', turn=-1 } } = vnode.attrs;

    // but don't replace current game with default
    uuid === 'default' && lastuuid ? (uuid = lastuuid, turn = lastturn) : (void(0));

    const game  = DB.Games.find(String(uuid)) as IGameTree;
    const board = DB.Boards.find(String(uuid));
    const controller = {uuid: '123'};


    lastuuid = String(uuid);
    lastturn = String(turn);

    return m('cell-content-board', [
      m(SectionTitleAtom, { title: 'Content', description: 'description' }),
      m(ToolbarCell,      { className: '', style: '' } ),
      m(ToolbarCell,      { className: '', style: '' } ),
      m('cell-board', [
        m('cell-board-sizer'),
        m('cell-board-evaluation', { className: '' }, 'E'),
        m('cell-board-container', { className: '' },
          m(ChessboardCell, { game, board, controller }),
        ),
      ]),
      m(ToolbarCell,      { className: '', style: '' } ),
      m(ToolbarCell,      { className: '', style: '' } ),
    ]);

  },

  onbeforeupdate ( vnode, oldnode ) {
    DEBUG && console.log('ContentCellBoard.onbeforeupdate.in', vnode, oldnode);
    // This avoids the cell to be re-rendered when the route changes
    return false;
  },

  // onbeforeremove ( ) {
  //   DEBUG && console.log('ContentCellBoard.onbeforeremove.in');
  // },

  // onremove ( ) {
  //   DEBUG && console.log('ContentCellBoard.onremove.in');
  // }

};
