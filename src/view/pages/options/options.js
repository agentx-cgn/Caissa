
import './options.scss';

import Menu    from './../../components/menu';
import Status  from './../../components/status';

// const ol = '.outline'; // ''
const ol = ''; // ''

export default function() {
    return {
        oncreate: function( /* vnode */ ){
            // console.log('analyzer.oncreate');
        },
        view: vnode => m(
            '.container.flex.flex-column', [

                m(`div.header.flex.flex-row${ol}.w-100`, 
                    {style: 'border-bottom: 1px solid white'}, 
                    [
                        m(Menu), 
                    ],
                ),

                // content + sections
                m(`div.content.flex.flex-row.flex-auto${ol}.w-100`, 
                    {style: 'border-bottom: 1px solid white'}, 
                    [
        
                        m(`div.section-center.flex.flex-column${ol}.mh3`, [
                            m('div', 'OPTIONS'),
                        ]),
    
                    ],
                ),

                // footer
                m(`div.footer.flex.flex-row${ol}.w-100`, [
                    m(Status),
                ]),

                vnode.children,

            ],
        ),
    };
}
