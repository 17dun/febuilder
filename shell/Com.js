#! /usr/bin/env node

var Com = Com || {};
Com.base = {
    eval : function(string) {
        return eval('(' + string + ')');
    },
    func : function(string) {
        return (new Function( 'return (' + string + ')' )());
    }
};
exports.Com = Com;
