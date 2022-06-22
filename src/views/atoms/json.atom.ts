/* eslint-disable no-prototype-builtins */

import m from 'mithril';

import { IComponent, IObj } from '@app/domain';

type TOptions = {
  collapseAfter: number;
}

function mProp (prop: string, level: number) {
  return  level < 2
    ? m('span.fiob', m.trust(prop))
    : m('span',      m.trust(prop))
  ;
}

function renderCollapsed(sprop: string, isArray: boolean, path: string, statusLookup: IObj, length: number, level: number): m.Vnode {

  return m('div', [
    mProp(sprop, level),
    (isArray ? '[' : '{'),
    m('button', { onclick: () => statusLookup[path] = false }, '+'),
    (isArray ? '] [' + length + ']' : '}'),
  ]);

}

function renderExpanded(sprop: string, tree: IObj, paths: string[], isArray: boolean, path: string, statusLookup:IObj, options: TOptions, level: number): m.Vnode {

    var divs = [] as (string | m.Vnode)[];

    divs.push( mProp(sprop, level) );
    divs.push( (isArray ? '[' : '{') );
    divs.push( m('button', {onclick: () => statusLookup[path] = true}, '-') );

    for (var key in tree) {
      var child = tree[key];
      var newpath = paths.slice();
      newpath.push(key);
      divs.push(renderTree(key, child, newpath, statusLookup, options, level +1));
  }

    divs.push((isArray ? ']' : '}'));

    return m('div', divs);

}

function renderTree(prop: string | null, tree: IObj, paths: string[], statusLookup: IObj, options: TOptions, level: number): m.Vnode {

    var length, value, filler;
    var sprop   = prop === null ? '' : prop + ' : ';
    var path   = JSON.stringify(paths);
    var collapsed = statusLookup[path] !== undefined ? statusLookup[path] : paths.length > options.collapseAfter;

    if (tree !== null && tree instanceof Array) {
      length = tree.length;
      return collapsed
        ? renderCollapsed(sprop, true, path, statusLookup, length, level)
        : renderExpanded (sprop, tree, paths,   true, path, statusLookup, options, level)
      ;
    }

    if (tree !== null && typeof tree === 'object') {
      return collapsed
        ? renderCollapsed(sprop, false, path, statusLookup, 0, level )
        : renderExpanded (sprop, tree, paths, false, path, statusLookup, options, level)
      ;
    }

    value  =
      typeof tree === 'function'
        ? 'function'
        : (tree === undefined)
          ? 'undefined'
          : JSON.stringify(tree).replace(/"/g, '\'')
    ;
    filler = Array(Math.max(1, 12 - (prop||'').length)).fill('&nbsp;').join('');
    sprop  = prop + ' :' + filler;
    return level < 2 // 3 is top level
      ? m('div.fiob', m.trust(sprop), m('div.dib.fior.ma0', value))
      : m('div', m.trust(sprop + value))
    ;

}

interface IAttrs {
    tree: any;
    options: any;
}

const JsonAtom = function ( ): IComponent<IAttrs> {

  const statusLookup = {};

  return {
    view: function (vnode) {
      const { tree, options } = vnode.attrs;
      return renderTree(null, tree, [], statusLookup, options, 0);
    },
  };

};

export { JsonAtom, TOptions };
