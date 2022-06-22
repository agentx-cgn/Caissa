import m from 'mithril';

import './layout.cell.scss';

import { H, DatabaseService as DB } from '@app/services';

import { ILayoutComponent } from '@app/domain';
import { LastAtom, NothingAtom } from '@app/atoms';

import { BackdropCell } from './../backdrop.cell';
import { StageCell } from './../stage.cell';
import { HeaderCell } from './../header/header.cell';
import { AsideCell } from './../aside/aside.cell';
import { FooterCell } from './../footer/footer.cell';
import { SplashCell } from './../splash/splash.cell';

let break2: number, break3: number;

const LayoutCell: ILayoutComponent = {

  oninit () {
    break2 = parseInt(H.cssvar('--mediabreak2'), 10);
    break3 = parseInt(H.cssvar('--mediabreak3'), 10);
  },

  view ( vnode ) {

    const { center, page, route, params } = vnode.attrs;
    const showSplash = DB.Options.first.ui.waitscreen;

    return m('cell-layout',

      !showSplash
        ? [
          m(BackdropCell),
          m(HeaderCell, { route, params }),
          m('main', [
            m('section.stage',   {}, m(StageCell)),
            m('section.content', {}, innerWidth >= break2 ? m( center )  : m(NothingAtom)),
            m('section.aside',   {}, m(AsideCell)), //innerWidth >= break3 ? m(AsideCell) : m(NothingAtom))
          ]),
          m(FooterCell),
          m(LastAtom, { msecs: Date.now() }),
        ]
        : [
          m(BackdropCell),
          m(SplashCell),
          m(LastAtom, { msecs: Date.now() }),
        ]
      );

  },

};

export { LayoutCell };
