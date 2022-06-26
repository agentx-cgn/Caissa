import m from 'mithril';

import { H }       from './helper.service';
import { App }     from '@app/views';
import { IEvent, IPageComponent, IParams, IRouteOptions, TPageOptions } from '@app/domain';
import { FactoryService } from './factory.service';

interface IEntry  {
  key:     string;
  route:   string;
  params:  IParams;
  // page:    IPage<IPageAttrs>;
  page:    IPageComponent;
  options: TPageOptions;
  routeOptions: IRouteOptions;
}

const DEBUG = false;

const candidate = {} as Record<string, IEntry>;
const stack     = [] as IEntry[];
let pointer     = NaN;

const detected  = {
  back:        false,
  fore:        false,
  same:        false,
  replace:     false,
  redraw:      false,
  popstate:    false,
  hashchange:  false,
  noanimation: false,
};

const NothingPage = FactoryService.create('Nothing', {
  view ( vnode ) {
    const { className } = vnode.attrs;
    return m('div.page.nothing', { className },
    );
  },
});

const History = {

    stack, // needed in Header

    get pointer () {return pointer;},

    log () {
      stack.forEach( (entry, idx) => {
        if (idx === pointer) {
          console.log('HIST.' + idx, [entry.key, entry.page.name || '', H.shrink(entry.params)]);
        } else {
          console.log('hist.' + idx, [entry.key, entry.page.name, H.shrink(entry.params)]);
        }
      });
    },

    isCurrent (key: string) {
      return !!(stack[pointer] && stack[pointer].key === key);
    },

    get current () {
      return !stack.length  ? '' : stack[pointer].key;
    },
    get canBack () {
      return !isNaN(History.pointer) && History.pointer > 0;
    },
    get canFore () {
      return !isNaN(History.pointer) && History.pointer < History.stack.length -1;
    },

    // no checks here
    // inits 'silent' back, no animation
    goback () {
      const { route, params } = stack[pointer -1];
      App.route(route, params, { back: true, noanimation: true });
    },
    gofore (){
      const { route, params } = stack[pointer +1];
      App.route(route, params, { fore: true, noanimation: true });
    },
    // comes from UI
    onback (e: IEvent) {
      e.redraw = false;
      const { route, params } = stack[pointer -1];
      App.route(route, params, { back: true });
      return H.eat(e);
    },
    onfore (e: IEvent) {
      e.redraw = false;
      const { route, params } = stack[pointer +1];
      App.route(route, params, { fore: true });
      return H.eat(e);
    },
    /**
     * Events come on BACK/FORE, user edits adressbar and bookmark click
     * there is always onpopstate and hashchange, except no hashchange if url is same
     */
    onhashchange (e: Event) {
      detected.hashchange = true;
      // console.log('history.onadresschange', e.type);
      return H.eat(e);
    },
    onpopstate (e: Event) {
      detected.popstate = true;
      // console.log('history.onadresschange', e.type);
      return H.eat(e);
    },

    recent (amount: number) {
      return stack
        .map(entry => entry.page)
        .slice(-amount)
      ;
    },

    prepare (route: string, params={}, options: TPageOptions, routeOptions: IRouteOptions={replace: false}) {
        /**
         *  called from onmatch/route,
         *  creates candidate on new route
         *  lots of special cases
        */
        const key: string = m.buildPathname(route, params);
        const entry: IEntry = { key, route, params, options, page: NothingPage, routeOptions };

        // fresh stack, e.g. after reload
        if (isNaN(pointer)) {
            DEBUG && console.log('history.check.pointer NaN', 'OK');
            candidate[key] = entry; //{ ...options };

        // candidate exists from former cycle
        } else if (candidate[key]) {
            DEBUG && console.log('history.prepare.ignored.exists', key);

        // ignored, because already there, e.g. options form submit, system+module, or filtered content, e.g. GamesList
        } else if (stack[pointer] && stack[pointer].key === key) {
            detected.same = true;
            DEBUG && console.log('history.prepare.ignored.same', key);

        // e.g. pages.afteranimate
        } else if (routeOptions.redraw) {
            detected.redraw = true;
            DEBUG && console.log('history.prepare.redraw', key);

        // route.set w/ replace e.g. game+turn
        } else if (routeOptions.replace || detected.replace) {
            candidate[key] = entry; //{ ...options };
            detected.replace = true;
            DEBUG && console.log('history.prepare.replace', key, '=>', stack[pointer].key), H.shrink(options);

        // back from caissa
        } else if (routeOptions.back || detected.back) {
            detected.back = true;
            if (typeof routeOptions.noanimation !== 'undefined'){
                detected.noanimation = !!routeOptions.noanimation;
            }
            DEBUG && console.log('history.prepare.back', key, H.shrink(options));

        // fore from caissa
        } else if (routeOptions.fore || detected.fore) {
            detected.fore = true;
            if (typeof routeOptions.noanimation !== 'undefined'){
                detected.noanimation = !!routeOptions.noanimation;
            }
            DEBUG && console.log('history.prepare.fore', key, H.shrink(options));

        // something changed addressbar
        } else if (detected.hashchange || detected.popstate) {

            // assuming back
            if (detected.hashchange && stack[pointer -1] && stack[pointer -1].key === key){
                detected.back = true;
                DEBUG && console.log('history.prepare.urlChangeDetected.back', key);

            // assuming fore
            } else if (detected.hashchange && stack[pointer +1] && stack[pointer +1].key === key){
                detected.fore = true;
                DEBUG && console.log('history.prepare.urlChangeDetected.fore', key);

            // assuming fore ???
            } else if (!detected.hashchange && detected.popstate){
                detected.same = true;
                DEBUG && console.log('history.prepare.urlChangeDetected.same', key);

            // start over
            } else {
                candidate[key] = entry; //{ ...options };
                while (stack.length){ stack.pop(); }
                DEBUG && console.log('history.prepare.urlChangeDetected.clear', key);
            }

        } else {
            candidate[key] = entry; //{ ...options };
            DEBUG && console.log('history.prepare.done', key, H.shrink(routeOptions));
        }
    },

    finalize (route: string, params: IParams, options: TPageOptions, page: IPageComponent) {

        const key = m.buildPathname(route, params);

        if (detected.replace && candidate[key]) {
            stack[pointer].key    = key;
            stack[pointer].params = params;
            delete candidate[key];
            DEBUG && console.log('history.finalize.replace.done', key, '==', stack[pointer].key);

        } else if (detected.redraw) {
            DEBUG && console.log('history.finalize.redraw.done', stack[pointer]);

        } else if (detected.same || (stack[pointer] && stack[pointer].key === key)) {
            detected.same = true;
            DEBUG && console.log('history.finalize.same.done', stack[pointer]);

        } else if (detected.back) {
            pointer -= 1;
            DEBUG && console.log('history.finalize.back.done', stack[pointer]);

        } else if (detected.fore) {
            pointer += 1;
            DEBUG && console.log('history.finalize.fore.done', stack[pointer]);

        } else if (!candidate[key]) {
            DEBUG && console.log('history.finalize.nocandidate.ignored', key);

        } else {
            // kick out entries from old browsing path
            while (pointer < stack.length -1){
                // eslint-disable-next-line no-unused-vars
                const entry = stack.pop();
                DEBUG && console.log('history.finalize.next.popped', pointer, stack.length, entry);
            }
            pointer = stack.push(H.create({key, route, params, options, page}) as IEntry) -1;
            delete candidate[key];
            DEBUG && console.log('history.finalize.next.done', key, stack[pointer]);
        }

    },
    get animation () {
      return (
        stack.length === 1 ? '=1=' :
        detected.replace   ? '=r=' :
        detected.redraw    ? '=w=' :
        detected.same      ? '=s=' :
        (detected.back &&  detected.noanimation)  ? '=b=' :
        (detected.back && !detected.noanimation)  ? '=b>' :
        (detected.fore &&  detected.noanimation)  ? '=f=' :
        (detected.fore && !detected.noanimation)  ? '<f=' :
        '<c='
      );
    },

    /**
     * return three contents from history stack + needed animation
     */
    slides () {

        const result = {
          anim:    '',
          names:   [] as string[],
          entries: [] as IEntry[],
        };

        const noEntry: IEntry = { key: '', page: NothingPage, route: '', params: {}, options: {} as TPageOptions , routeOptions: {} as IRouteOptions };

        function collectFrom(start: number) {
          [0, 1, 2].forEach((diff: number) => {
            const index = pointer + start + diff;
            const entry = stack[index] ? stack[index] : noEntry;
            result.names.push(entry.page.name);
            result.entries.push(entry);
          });
        }

        if (stack.length === 1) {
          collectFrom(-1);
          result.anim = '=1=';

        } else if (detected.replace) {
          collectFrom(-1);
          result.anim = '=r=';

        } else if (detected.redraw) {
          collectFrom(-1);
          result.anim = '=w=';

        } else if (detected.same) {
          collectFrom(-1);
          result.anim = '=s=';


        } else if (detected.back) {
          collectFrom(0);
          result.anim = (detected.noanimation) ? '=b=' : '=b>';

        } else if (detected.fore) {
          collectFrom(-2);
          result.anim = (detected.noanimation) ? '=f=' : '<f=';

        // clicked
        } else {
          collectFrom(-2);
          result.anim = '<c=';
        }

        // cleanup
        H.clear(candidate);
        detected.replace     = false;
        detected.back        = false;
        detected.fore        = false;
        detected.same        = false;
        detected.redraw      = false;
        detected.popstate    = false;
        detected.hashchange  = false;
        detected.noanimation = false;

        return result;

    },

};

export { History as HistoryService };
