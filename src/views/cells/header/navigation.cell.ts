import m from 'mithril';

import { ICellComponent, IEvent } from '@app/domain';
import { App } from '@app/views';

const NavigationCell: ICellComponent =  {

  view ( ) {

    const onclick = (e: IEvent) => {
      e.redraw = false;
      App.route('/start/');
    };

    return m('nav', [
      m('label', {'aria-label':'Menu', onclick},
        m('i.hamburger.fa.fa-bars '),
        m('h1.home.f4.fiom.white.pl3.di', 'Caissa'),
      ),
    ]);
  },

};

export { NavigationCell };
