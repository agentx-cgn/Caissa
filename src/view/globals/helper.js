export default {

    range (st, ed, sp) {
        var i,r=[],al=arguments.length;
        if(al===0){return r;}
        if(al===1){ed=st;st=0;sp=1;}
        if(al===2){sp=1;}
        for(i=st;i<ed;i+=sp){r.push(i);}
        return r;
    },

};
