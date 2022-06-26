
import m from 'mithril';
import { IEvent, ICellComponent, ICellAttrs } from '@app/domain';

// import GameEcos   from './game-ecos';

interface IPanelAttrs extends ICellAttrs {
  show: boolean;
  onclick: (e: IEvent) => void;
}

const PanelHeader: ICellComponent<IPanelAttrs> = {
  view ( vnode ) {
    const { onclick, show, className } = vnode.attrs;
    return m('div.panel-header.flex.flex-row', { className, onclick }, [
      m('div.caption.ellipsis.flex-grow', vnode.children),
      m('div.toggle', show ? 'O' : 'X'),
    ]);
  },
};

const Panel: ICellComponent<IPanelAttrs> = {
  view ( vnode ) {
    const { show, className } = vnode.attrs;
    const [ caption, panel ] = vnode.children as [string, m.Vnode<IPanelAttrs>[]];
    return m('div.panel', { className }, [
      m(PanelHeader, vnode.attrs, caption),
      show && m('div.panel-content', panel),
    ]);

  },
};


// const PanelMoves = FactoryService.create('PanelMoves', {
//     view (vnode: any) {

//         //TODO: exchange onclick with group
//         const group   = 'game-panel-toggles';
//         const show    = DB.Options.first[group].moves === 'show';

//         const onclick = function (e) {
//             const value = show ? 'hide' : 'show';
//             DB.Options.update('0', { [group]: { moves: value } }, true);
//             App.redraw(e);
//         };

//         return m(Panel, { onclick, show, className: 'moves'},
//             'Moves',
//             m(Moves, { game: vnode.attrs.game }),
//         );

//     },
// });

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
    Panel,
    // PanelMoves,
    // PanelIllus,
    // PanelEcos,
};
