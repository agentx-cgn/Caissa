
// import G from './../globals/g';

const Parser = {
    get: function (pgn, what, otherwise) {

        const 
            akku = {},
            lines = pgn.split('\n')
        ;

        if (lines.length === 0) return otherwise;
        
        if ( what === 'game' ){

            lines.forEach(line => {
                
                if (line.startsWith('[Date ')) {
                    let item = line.split(' ')[1];
                    akku.date = item.slice(1, item.length -2);

                } else if (line.startsWith('[White ')) {
                    let item = line.split(' ')[1];
                    akku.white = item.slice(1, item.length -2);

                } else if (line.startsWith('[Black ')) {
                    let item = line.split(' ')[1];
                    akku.black = item.slice(1, item.length -2);

                }

            });

            return `${akku.date}: ${akku.white} - ${akku.black}`;

        }

    },
};

export default Parser;
