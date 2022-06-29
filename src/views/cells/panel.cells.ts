
import m from 'mithril';
import { IEvent, ICellComponent, ICellAttrs, IGameTree } from '@app/domain';
import { DatabaseService as DB } from '@app/services';
import { AppConfig } from '@app/config';
import { App } from '@app/views';
import { GameMovesCell } from '@app/pages';

// import GameEcos   from './game-ecos';

interface IPanelAttrs {
  className: string;
  show: boolean;
  onclick: (e: IEvent) => void;
}
const PanelHeaderCell: ICellComponent<IPanelAttrs> = {
  view ( vnode ) {
    const { onclick, show, className } = vnode.attrs;
    return m('div.panel-header.flex.flex-row', { className, onclick }, [
      m('div.caption.ellipsis.flex-grow', vnode.children),
      m('div.toggle', show ? 'O' : 'X'),
    ]);
  },
};

const PanelCell: ICellComponent<IPanelAttrs> = {
  view ( vnode ) {
    const { show, className, onclick } = vnode.attrs;
    const [ caption, panel ] = vnode.children as [string, m.Vnode<IPanelAttrs>[]];
    return m('div.panel', { className }, [
      m(PanelHeaderCell, { className, show, onclick }, caption),
      show && m('div.panel-content', panel),
    ]);

  },
};

interface IPanelMovesAttrs  {
  game: IGameTree;
}
const PanelMovesCell: ICellComponent<IPanelMovesAttrs> = {
    view ( vnode ) {

      const { game } = vnode.attrs;

        //TODO: exchange onclick with group
        const group   = 'game-panel-toggles';
        const show    = DB.Options.first[group].moves === 'show';

        const onclick = function (e: IEvent) {
            const value = show ? 'hide' : 'show';
            DB.Options.update('0', { [group]: { moves: value } }, true);
            App.redraw(e);
        };

        return m(PanelCell, { onclick, show, className: 'moves'},
            'Moves',
            m(GameMovesCell, { game }),
        );

    },
};

// const PanelIllus = FactoryService.create('PanelIllus', {
//     view () {

//         //TODO: exchange onclick with group
//         const group   = 'game-panel-toggles';
//         const show    = DB.Options.first[group].illus === 'show';

//         const onclick = function (e) {
//             const value = show ? 'hide' : 'show';
//             DB.Options.update('0', { [group]: { illus: value } }, true);
//             App.redraw(e);
//         };

//         return m(Panel, { onclick, show, className: 'illustrations'},
//             'Illustrations',
//             m(FormIllus),
//         );

//     },
// });

// const PanelEcos = FactoryService.create('PanelEcos', {
//     view ( vnode ) {

//         const group   = 'game-panel-toggles';
//         const show    = DB.Options.first[group].ecos === 'show';

//         const onclick = function (e) {
//             const value = show ? 'hide' : 'show';
//             DB.Options.update('0', { [group]: { ecos: value } }, true);
//             App.redraw(e);
//         };

//         return m(Panel, { onclick, show, className: 'ecos'},
//             'ECO Browser',
//             m(GameEcos, { game: vnode.attrs.game }),
//         );

//     },
// });

export {
    PanelCell,
    PanelMovesCell,
    // PanelMoves,
    // PanelIllus,
    // PanelEcos,
};
