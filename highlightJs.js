(()=>{
var
    db=new syntaxHighlighter.Database('js'),
    matchingRules={
        comment:[
            {
                regex:/^(\/\/.*\n)/,
            },{
                regex:/^(\/\*(?:.|\n)*\*\/)/,
            }
        ],
        string:[
            {
                regex:/^('(?:[^'\\]|\\.)*')/,
            },{
                regex:/^("(?:[^"\\]|\\.)*")/,
            },{
                regex:/^(`(?:[^`\\]|\\.)*`)/,
            }
        ],
        operator:{
            regex:/^([!%&\(\)\*\+\,\-\.\/\:;\<=\>\?\[\]\^\{\|\}\~])/,
        },
        number:{
            regex:/^([0-9]+(?:\.[0-9]+)?)/
        },
        identifier:{
            regex:/^([A-Z_a-z]+)/,
            containKeywords:[
                'keyword',
                'library',
            ]
        },
        keyword:{
            active:false,
        },
        library:{
            active:false,
        },
    }
syntaxHighlighter.highlightJs=highlightJs
function highlightJs(source,cb){
    db.require([
        'keyword',
        'library',
    ],err=>{
        if(err)
            return cb(err)
        matchingRules.keyword.keywords=db.data.keyword
        matchingRules.library.keywords=db.data.library
        cb(null,syntaxHighlighter.highlight(
            syntaxHighlighter.analyze(matchingRules,source)
        ))
    })
}
})()
