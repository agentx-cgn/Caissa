import m from 'mithril';
import screenfull  from 'screenfull';
import './header.scss';

import { App } from '@app/views';
import { ICellComponent, IEvent } from '@app/domain';
import { NavigationCell }  from './navigation.cell';

// interface IAttrs extends ICellAttrs, IAppAttrs {}

const HeaderCell: ICellComponent = {

  view () {

    const toggle = (e: IEvent) => {e.redraw = false; screenfull.isEnabled && screenfull.toggle();};
    const reload = (e: IEvent) => {e.redraw = false; window.location.reload();};
    const width  = innerWidth >=720 ? '360px' : '100vw';

    return m('header',
      m('div.controls.flex', { style: 'width:' + width }, [
        m(NavigationCell),
        App.canBack()
          ? m('i.navi.fa.fa-angle-left',  { onclick: App.onback })
          : m('i.navi.fa.fa-angle-left.ctrans'),
        App.canFore()
          ? m('i.navi.fa.fa-angle-right', { onclick: App.onfore })
          : m('i.navi.fa.fa-angle-right.ctrans'),

        m('i.navi.fa.fa-retweet',           { onclick: reload }),
        //TODO: toggle the toggle
        m('i.navi.fa.fa-expand-arrows-alt', { onclick: toggle }),
      ]),
    );
  },

};

export { HeaderCell };
