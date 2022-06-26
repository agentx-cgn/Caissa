import { IDispatcher, IPageComponent, IPageTemplate, IPageNode } from "@app/domain";

const DEBUG = false;

const freezer = [] as IPageNode[];

const Dispatcher = function (source: string): IDispatcher {

  return {
    send (msg) {
      freezer.forEach( (page: any) => {
        if (typeof page.onmessage === 'function' && source !== page.name){
          DEBUG && console.log('dispatcher.sending', msg, 'to', page.name, 'from', source);
          page.onmessage(source, msg);
        }
      });
    },
  };

};

const FactoryService = {

  // create<A, S={}> (name: string, tplPage: IPageTemplate<A, S> ): IPage<A, S> {
  create (name: string, tplPage: IPageTemplate ): IPageComponent  {

    //TODO: check for duplicates,
    // make onafterupdates special in dispatcher
    // ensure comps have oncreate, with onafterupdates

    // let vnode: INodeDOM<T>;
    let preventUpdates  = false;

    // before first view
    // if (typeof tplPage.onregister === 'function') { tplPage.onregister(Dispatcher(name)); }
    // if (typeof tplPage.onresize   === 'function') { tplPage.onresize(innerWidth, innerHeight); }

    const pageNode: IPageNode = Object.assign({
      name,
      data: { test: 'test' },
      onbeforeupdate( /* vnode, old */) {

        // https://mithril.js.org/lifecycle-methods.html#onbeforeupdate
        // The onbeforeupdate(vnode, old) hook is called before a vnode is diffed in a update.
        // If this function is defined and returns false, Mithril prevents a diff from happening to the vnode,
        // and consequently to the vnode's children.

        if (preventUpdates) {
            DEBUG && console.log('Component.' + name, 'prevented Updates');
        }
        // return !preventUpdates;
        return true;
      },
      get preventUpdates () {
        return preventUpdates;
      },
      set preventUpdates (value) {
        preventUpdates = value;
      },
    }, tplPage);

      // // monkeypatching
      // page.oncreate = function (...args) {
      //   // vnode = orgvnode;
      //   tplPage.oncreate && tplPage.oncreate(...args);
      // };
      // if (page.onupdate){
      //   page.onupdate = function (...args) {
      //     // vnode = orgvnode;
      //     tplPage.onupdate && tplPage.onupdate(...args);
      //   };
      // }

    freezer.push(pageNode as IPageNode);

    return () => pageNode;

  },
};

export { FactoryService };
