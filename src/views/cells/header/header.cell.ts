import m from 'mithril';
import screenfull  from 'screenfull';
import './header.scss';

import { IDefComponent, IEvent } from '@app/domain';
import { SystemService, HistoryService } from '@app/services';
import { NavigationCell }  from './navigation.cell';

const HeaderCell: IDefComponent = {

  view( {attrs: {route, params}} ) {

    const toggle = (e: IEvent) => {e.redraw = false; SystemService.fullscreen && screenfull.toggle();};
    const reload = (e: IEvent) => {e.redraw = false; window.location.reload();};
    const width  = innerWidth >=720 ? '360px' : '100vw';

    return m('header',
      m('div.controls.flex', { style: 'width:' + width }, [
        m(NavigationCell, { route, params }),
        HistoryService.canBack
          ? m('i.navi.fa.fa-angle-left',  { onclick: HistoryService.onback })
          : m('i.navi.fa.fa-angle-left.ctrans'),
        HistoryService.canFore
          ? m('i.navi.fa.fa-angle-right', { onclick: HistoryService.onfore })
          : m('i.navi.fa.fa-angle-right.ctrans'),

        m('i.navi.fa.fa-retweet',           { onclick: reload }),
        //TODO: toggle the toggle
        m('i.navi.fa.fa-expand-arrows-alt', { onclick: toggle }),
      ]),
    );
  },

};

export { HeaderCell };
