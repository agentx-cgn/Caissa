import m from 'mithril';

import './board.cell.scss';

import testImage from '/assets/pictures/chess.test.png';

import { ICellComponent } from '@app/domain';

const $ = document.querySelector.bind(document);

const listener = (e: Event) => {

  const $board  = $('cell-board') as HTMLElement;
  const $img    = $('img.fake') as HTMLImageElement;
  const rect    = $board.getBoundingClientRect();
  const $eval   = $('cell-board-evaluation') as HTMLElement;

  $img.style.width  = `${rect.width -24}px`;
  $img.style.height = `${rect.width -24}px`;

  $eval.style.minHeight = `${rect.width -24}px`;

};


export const ChessboardCell: ICellComponent = {

  oncreate(vnode) {
    window.addEventListener('resize', listener);
  },

  view ( vnode ) {

    const { className, style } = vnode.attrs;

    return  m('cell-board', [
      m('cell-board-sizer'),
      m('cell-board-evaluation', { className }, 'E'),
      m('cell-board-container', { className },
        m('img.fake', {style: 'width: 128px; height: 128px', src: testImage})
        // m('img.fake', { style: 'width: 100%; height: 100%', src: testImage} )
      ),
    ]);

  }

};
