
import './logs.scss';

import Menu    from './../../components/menu';
import Status  from './../../components/status';
import Logger    from '../../globals/logger';

// const ol = '.outline'; // ''
const ol = ''; // ''

export default function() {
    return {

        view: vnode => m(
            '.container.flex.flex-column', [

                m(`div.header.flex.flex-row${ol}.w-100`, 
                    {style: 'border-bottom: 1px solid white'}, 
                    [
                        m(Menu), 
                    ],
                ),

                // content + sections
                m(`div.content.flex.flex-row.flex-auto${ol}.w-100;`, 
                    {style: 'border-bottom: 1px solid white;  background-color: #eee;'}, 
                    [
                        m(`pre.section-center.${ol}.ml3.black.overflow-y-scroll.overflow-x-hidden.w-100`, 

                            m.trust(Logger.offset(0, 1000).join('<br/>')),

                        ),
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
