import m from 'mithril';

import { App } from '@app/views';
import { $, HistoryService as History, StageService } from '@app/services';

const DEBUG = true;

const classLeft   = 'slide left trans-left';
const classCenter = 'slide center trans-center';
const classRight  = 'slide right trans-right';

let
  anim: string,
  pageWidth: number,
  endEvent = 'transitionend'
;

interface IState {
  onresize: (width: number) => void
}

const StageCell: m.Component<{}, IState> & IState= {

    oninit () {
      StageService.listen();
    },
    onbeforeupdate () {
      StageService.pause();
    },
    onremove () {
      StageService.remove();
    },
    onresize ( width: number ) {
      pageWidth = width <= 360 ? width : 360;
    },

    view ( ) {

      const style = '';
      const slides = History.slides();
      const [ l, c, r ] = slides.entries;

      // keep this
      anim = slides.anim;

      // slides.entries.forEach( entry => {
      //   // console.log(entry.params);
      //   // entry.page.preventUpdates = false;
      // });

      return m('.pages', [
        m(l.page as never, {route: l.route, params: l.params,  options: l.options, style, className: classLeft}),
        m(c.page as never, {route: c.route, params: c.params,  options: c.options, style, className: classCenter}),
        m(r.page as never, {route: r.route, params: r.params,  options: r.options, style, className: classRight}),
        m.fragment( {
            oncreate: () => setTimeout(onafterupdate, 100),
            onupdate: () => setTimeout(onafterupdate, 100)
        }, [m('div.dn')]),
      ]);

    },

};

function onafterupdate ( ) {

  DEBUG && console.log('onafterupdate.in', anim);

  const $Left   = $('div.slide.left');
  const $Center = $('div.slide.center');
  const $Right  = $('div.slide.right');

  // DEBUG && console.log('stage.onmessage.in', $('div.pages')?.children);
  // DEBUG && console.log('stage.onmessage.in', !!$Left, !!$Center, !!$Right, anim);

  if (anim === '=1=' || anim === '=r=' || anim === '=s=' || anim === '=w=') {

    if (History.canBack || History.canFore) {
      StageService.init(pageWidth);
    }

    // console.log('L:', $Left?.className);
    // console.log('C:', $Center?.className);
    // console.log('R:', $Right?.className);

    if ($Left?.classList.contains('trans-center')) {
      $Left.classList.add('trans-left');
      $Left.classList.remove('trans-center');
    }

    if ($Right?.classList.contains('trans-center')) {
      $Right.classList.add('trans-right');
      $Right.classList.remove('trans-center');
    }

  } else if (anim === '=b>') {
    // left and center move to the right
    $Left?.addEventListener(endEvent, onafteranimate);
    $Left?.classList.remove('trans-left');
    $Left?.classList.add('page-slide', 'trans-center');
    $Center?.classList.remove('trans-center');
    $Center?.classList.add('page-slide', 'trans-right');

  } else if (anim === '<c=' || anim === '<f=') {
    // right and center move to the left
    $Right?.addEventListener(endEvent, onafteranimate);
    $Right?.classList.remove('trans-right');
    $Right?.classList.add('page-slide', 'trans-center');
    $Center?.classList.remove('trans-center');
    $Center?.classList.add('page-slide', 'trans-left');

  } else if (anim === '=b=' || anim === '=f=') {
    // detected back/fore with noanimation
    App.redraw();

  } else {
    console.warn('pages.onafterupdates.unknown anim', anim);

  }

  // console.log('L:', $Left?.className);
  // console.log('C:', $Center?.className);
  // console.log('R:', $Right?.className);

}

function onafteranimate ( ) {

  // console.log('onafteranimate.in', anim);

  const $Left   = $('div.slide.left');
  const $Center = $('div.slide.center');
  const $Right  = $('div.slide.right');

  // $Center?.classList.remove('page-slide', 'trans-left', 'trans-right');
  // $Center?.classList.add('trans-center');

  // console.log('L:', $Left?.className);
  // console.log('C:', $Center?.className);
  // console.log('R:', $Right?.className);


  if (anim === '<c=' || '<f=') {
    $Left?.classList.remove('page-slide', 'trans-right', 'trans-center');
    $Left?.classList.add('trans-left');

    $Right?.removeEventListener(endEvent, onafteranimate);
    $Right?.classList.remove('page-slide', 'trans-right', 'trans-left');
    $Right?.classList.add('trans-center');

    $Center?.classList.remove('page-slide', 'trans-left', 'trans-right');
    $Center?.classList.add('trans-center');

  } else if (anim === '=b>') {
    $Right?.classList.remove('page-slide', 'trans-center', 'trans-left', 'trans-left');
    $Right?.classList.add('trans-right');

    $Center?.classList.remove('page-slide', 'trans-left', 'trans-right', 'trans-center');
    $Center?.classList.add('trans-center');

    $Left?.removeEventListener(endEvent, onafteranimate);
    $Left?.classList.remove('page-slide', 'trans-center', 'trans-right', 'trans-left');
    $Left?.classList.add('trans-center');

  } else if (anim === '=w=') {
    // $Center?.classList.remove('page-slide', 'trans-left');
    // $Center?.classList.add('trans-center');

  }

  anim = '';

  // console.log('L:', $Left?.className);
  // console.log('C:', $Center?.className);
  // console.log('R:', $Right?.className);


  // reorder back to LCR after animation
  App.redraw();

}

export { StageCell };
