export default {

    lastMove (list) {

        return (
            list.length % 2 === 0 ? 
                'b' + (~~(list.length/2) -1)    :
                'w' + (~~(list.length/2))
        );

    },

    // puts blacks and white move on same line
    combine (acc, val, idx) {
        val.pointer = val.color === 'w' ? 'w' + ~~(idx/2) : 'b' + ~~(idx/2);
        if (val.color === 'w'){ acc.push( [ val ] ); } 
        else { acc[acc.length -1].push(val); }
        return acc;
    },
    
};
