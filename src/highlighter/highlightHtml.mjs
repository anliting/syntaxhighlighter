var
    matchingRules={
        startTag:{
            headRegex:/^()<[a-z]/,
            tailRegex:/^(\>)/,
            contain:['headOfStartTag','attribute']
        },
        headOfStartTag:{
            active:false,
            headRegex:/^()<[a-z]/,
            tailRegex:/^()[\ \>\n]/,
            contain:['tagname']
        },
        tagname:{
            active:false,
            regex:/^([-A-Za-z]+)/,
        },
        attribute:{
            active:false,
            headRegex:/^([-A-Za-z]+)/,
            tailRegex:/^()[\ \>\n]/,
            contain:['afterEqualInAttribute']
        },
        afterEqualInAttribute:{
            active:false,
            headRegex:/^(=)/,
            tailRegex:/^()[\ \>\n]/,
            contain:['attributeValue'],
        },
        attributeValue:[{
            active:false,
            headRegex:/^(')/,
            tailRegex:/^(')/,
        },{
            active:false,
            headRegex:/^(")/,
            tailRegex:/^(")/,
        },{
            active:false,
            headRegex:/^()/,
            tailRegex:/^()[\ \>\n]/,
        }],
        endTag:{
            headRegex:/^(<\/)/,
            tailRegex:/^(\>)/,
            contain:['tagname'],
        },
        comment:[
            {
                regex:/^(\<!--(?:(?!--\>)(?:.|\n))*--\>)/,
            },{
                regex:/^(\<![^\>]*\>)/,
            }
        ],
    }
async function highlightHtml(source){
    return this.highlight(
        this.analyze(matchingRules,source)
    )
}
export default highlightHtml