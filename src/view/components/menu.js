
export default {
    view( /*vnode*/ ) {

        return m('ul.list.mv2.ml5.mr3.pa0', [

            m('li.dib.ph1', 
                m(m.route.Link, 
                    {href:'/analyzer', selector: 'a.link.f4.ahover-b' }, 
                    'ANALYZER',
                ),
            ),
            m('li.dib.ph1', 
                m(m.route.Link, 
                    {href:'/logs', selector: 'a.link.f4.ahover-b' }, 
                    'LOGS',
                ),
            ),
            m('li.dib.ph1', 
                m(m.route.Link, 
                    {href:'/options', selector: 'a.link.f4.ahover-b' }, 
                    'OPTIONS',
                ),
            ),
            m('li.dib.ph1', [
                m('a.link.ahover-b.f4', {href: 'https://github.com/agentx-cgn/caissa'}, 'SOURCE'),
            ]),

            m('li.dib.ph1', [
                m('a.link.ahover-b.f4', {href: 'https://agentx-cgn.github.io/caissa/dist/#!/analyzer'}, 'LIVE'),
            ]),

        ]);

    },
};
