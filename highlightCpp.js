(()=>{
var
    db=new syntaxHighlighter.Database('cpp'),
    matchingRules={
        characterLiteral:{
            regex:/^('(?:[^'\\]|\\.)')/,
        },
        comment:[
            {
                regex:/^(\/\/.*)\n/,
            },{
                regex:/^(\/\*(?:.|\n)*\*\/)/,
            }
        ],
        rawStringLiteral:{
            regex:/^(R"([^\ \(\)\\]{0,16})\((?:(?!\)\2")(?:.|\n))*\)\2")/,
        },
        cStringLiteral:{
            regex:/^("(?:[^"\\]|\\.)*")/,
        },
        identifier:{
            regex:/^([A-Z_a-z][0-9A-Z_a-z]*)/,
            containKeywords:[
                'keywords',
                'library',
                'stlcontainers',
                'constants',
            ]
        },
        numberLiteral:{
            regex:/^([0-9][0-9ELXelx.]*)/,
        },
        operator:{
            regex:/^([()\[\]{}<>+\-*\/%,:;?&^=!~.|])/,
        },
        preprocessingDirective:{
            headRegex:/^(#)/,
            tailRegex:/^()\n/,
            contain:['comment','includePD','definePD'],
        },
        includePD:{
            active:false,
            headRegex:/^(include)/,
            tailRegex:/^()\n/,
            contain:['comment','headerName'],
        },
        headerName:[
            {
                active:false,
                regex:/^(\<[^\>]*\>)/,
            },{
                active:false,
                regex:/^("[^"]*")/,
            },
        ],
        definePD:{
            active:false,
            headRegex:/^(define)/,
            tailRegex:/^()\n/,
            contain:['comment','operator','definePDKeyValue'],
        },
        definePDKeyValue:{
            active:false,
            headRegex:/^([A-Z_a-z]+(?:\([^\)]*\))?)/,
//
            tailRegex:/^()\n/,
            contain:['comment','operator','definePDValue'],
        },
        definePDValue:{
            active:false,
            headRegex:/^(.)/,
            tailRegex:/^()\n/,
            contain:['comment','operator'],
        },
        keywords:{
            active:false,
        },
        library:{
            active:false,
        },
        stlcontainers:{
            active:false,
        },
        constants:{
            active:false,
        },
    }
syntaxHighlighter.highlightCpp=highlightCpp
function highlightCpp(source,cb){
    db.require([
        'keywords',
        'library',
        'stlcontainers',
        'constants',
    ],err=>{
        if(err)
            return cb(err)
        matchingRules.keywords.keywords=db.data.keywords
        matchingRules.library.keywords=db.data.library
        matchingRules.stlcontainers.keywords=db.data.stlcontainers
        matchingRules.constants.keywords=db.data.constants
        cb(null,syntaxHighlighter.highlight(
            syntaxHighlighter.newlineDeletedAnalyze(matchingRules,source)
        ))
    })
}
})()
