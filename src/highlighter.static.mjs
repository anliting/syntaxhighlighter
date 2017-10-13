import althea from 'https://rawgit.com/anliting/althea/fc15503d703650e1e3a696260275cff0dcfc62d7/src/AltheaServer/HttpServer/files/lib/core.static.js';

var core = {
    althea
};

function Syntax(syntaxName,list){
    this.syntaxName=syntaxName;
    this.list=list||[];
}

function analyze(matchingRules,source){
    let result=[];
    while(
        match(result)||
        matchSingleCharcter(result)
    );
    return result
    function match(result){
        for(let syntaxName in matchingRules)
            if(matchBySyntaxName(syntaxName,result,true))
                return true
    }
    function matchBySyntaxName(syntaxName,result,root=false){
        if(matchingRules[syntaxName] instanceof Array){
            for(let i=0;i<matchingRules[syntaxName].length;i++)
                if(matchByRule(
                    syntaxName,
                    matchingRules[syntaxName][i],
                    result,
                    root
                ))
                    return true
            return
        }
        return matchByRule(
            syntaxName,
            matchingRules[syntaxName],
            result,
            root
        )
    }
    function matchByRule(syntaxName,rule,result,root){
        if(root&&rule.active==false)
            return
        if(rule.keywords)
            return matchSyntaxByKeyword(
                syntaxName,
                rule.keywords,
                result
            )
        if(rule.regex)
            return matchSyntaxByRegex(
                syntaxName,
                rule.regex,
                rule.containKeywords,
                result
            )
        if(rule.headRegex)
            return rangeSyntaxByRegex(
                syntaxName,
                rule.headRegex,
                rule.tailRegex,
                rule.contain,
                result
            )
    }
    function matchSyntaxByKeyword(syntaxName,keywords,result){
        for(let i=0;i<keywords.length;i++)
            if(source.substring(0,keywords[i].length)==keywords[i]){
                result.push(new Syntax(syntaxName,[keywords[i]]));
                source=source.substring(keywords[i].length);
                return true
            }
    }
    function matchSyntaxByRegex(
        syntaxName,
        regex,
        containKeywords,
        result
    ){
        if(!regex.test(source))
            return
        let match=source.match(regex)[1];
        source=source.substring(match.length);
        let syntax=new Syntax(syntaxName);
        containKeywords&&submatch()||
        syntax.list.push(match);
        result.push(syntax);
        return true
        function submatch(){
            for(let i=0;i<containKeywords.length;i++){
                let keywords=matchingRules[containKeywords[i]].keywords;
                if(keywords.indexOf(match)!=-1){
                    syntax.list.push(
                        new Syntax(containKeywords[i],[match])
                    );
                    return true
                }
            }
        }
    }
    function rangeSyntaxByRegex(
        syntaxName,
        headRegex,
        tailRegex,
        contain,
        result
    ){
        if(!headRegex.test(source))
            return
        let syntax=new Syntax(syntaxName);
        simpleMatch(headRegex,syntax.list);
        while(!source.match(tailRegex)&&(
            contain&&submatch()||
            matchSingleCharcter(syntax.list)
        ));
        simpleMatch(tailRegex,syntax.list);
        result.push(syntax);
        return true
        function submatch(){
            var i;
            for(i=0;i<contain.length;i++)
                if(matchBySyntaxName(contain[i],syntax.list))
                    return true
        }
        function simpleMatch(regex,result){
            var match;
            try{
                match=source.match(regex)[1];
                syntax.list.push(match);
                source=source.substring(match.length);
            }catch(e){
                console.log(source,regex,source.match(regex));
                throw''
            }
        }
    }
    function matchSingleCharcter(result){
        if(!source.length)
            return
        result.push(source[0]);
        source=source.substring(1);
        return true
    }
}

/*
    `keywords` contains `Keywords` and `Alternative representations`.
    Standard: N3242 2.13.
    Compelete.
*/
var keywords = [
    // Keywords
    'alignas','alignof','asm','auto','bool','break','case','catch','char','char16_t','char32_t','class','const','constexpr','const_cast','continue','default','delete','double','do','dynamic_cast','else','enum','explicit','export','extern','false','float','for','friend','goto','if','inline','int','long','mutable','namespace','new','noexcept','nullptr','operator','private','protected','public','register','reinterpret_cast','return','short','signed','sizeof','static','static_assert','static_cast','struct','switch','template','this','thread_local','throw','true','try','typedef','typeid','typename','union','unsigned','using','virtual','void','volatile','wchar_t','while',
    // Alternative representations
    'and','and_eq','bitand','bitor','compl','not','not_eq','or','or_eq','xor','xor_eq',
];

/*
    `stringset_library` contains the following:
    Algorithms library - Non-modifying sequence operations
    Algorithms library - Modifying sequence operations
    Algorithms library - Sorting and related operations
    Algorithms library - C library algorithms
    Numerics library - Floating-Point Environment
    Numerics library - Complex numbers
    Numerics library - Random number generation
    Standard: N3242 25, 26.
    Algorithm Compelete.
*/
var library = [
    // Algorithms library - Non-modifying sequence operations
    'all_of','any_of','none_of','for_each','find','find_if','find_if_not','find_end','find_first_of','adjacent_find','count','count_if','mismatch','equal','is_permutation','search','search_n',
    // Algorithms library - Modifying sequence operations
    'copy','copy_n','copy_if','copy_backward','move','move_backward','swap_ranges','iter_swap','transform','replace','replace_if','replace_copy','replace_copy_if','fill','fill_n','generate','generate_n','remove','remove_if','remove_copy','remove_copy_if','unique','unique_copy','reverse','reverse_copy','rotate','rotate_copy','random_shuffle','is_partitioned','partition','stable_partition','partition_copy','partition_point',
    // Algorithms library - Sorting and related operations
    'sort','stable_sort','partial_sort','partial_sort_copy','is_sorted','is_sorted_until','nth_element','lower_bound','upper_bound','equal_range','binary_search','merge','inplace_merge','includes','set_union','set_intersection','set_difference','set_symmetric_difference','push_heap','pop_heap','make_heap','sort_heap','is_heap','is_heap_until','min','max','minmax','min_element','max_element','minmax_element','lexicographical_compare','next_permutation','prev_permutation',// Algorithms library - C library algorithms
    'bsearch','qsort',
    // Numerics library - Floating-Point Environment
    'feclearexcept','fegetexceptflag','feraiseexcept','fesetexceptflag','fetestexcept','fegetround','fesetround','fegetenv','feholdexcept','fesetenv','feupdateenv',
    // Numerics library - Complex numbers
    'complex','real','imag','abs','arg','norm','conj','proj','polar','acos','asin','atan','acosh','asinh','atanh','cos','cosh','exp','log','log10','pow','sin','sinh','sqrt','tan','tanh',
    // Numerics library - Random number generation
    'linear_congruential_engine','mersenne_twister_engine','subtract_with_carry_engine','discard_block_engine','independent_bits_engine','shuffle_order_engine','minstd_rand0','minstd_rand','mt19937','mt19937_64','ranlux24_base','ranlux48_base','ranlux24','ranlux48','knuth_b','default_random_engine','random_device','seed_seq','RealType generate_canonical(URNG& g)','uniform_int_distribution','uniform_real_distribution','bernoulli_distribution','binomial_distribution','geometric_distribution','negative_binomial_distribution','poisson_distribution','exponential_distribution','gamma_distribution','weibull_distribution','extreme_value_distribution','normal_distribution','lognormal_distribution','chi_squared_distribution','cauchy_distribution','fisher_f_distribution','student_t_distribution','discrete_distribution','piecewise_constant_distribution','piecewise_linear_distribution',
    //
    'accumulate','adjacent_difference','advance','back','begin','chdir','chroot','cin','copy','copy','count','count_if','cout','distance','empty','end','endl','equal_range','execl','exit','fclose','fflush','fgets','FILE','fill','first','fopen','for_each','fork','fprintf','fputc','fputs','fputs','freopen','front','fscanf','getchar','getpagesize','gets','inner_product','int16_t','int32_t','int64_t','int8_t','uint16_t','uint32_t','uint64_t','uint8_t','ios_base','islower','isupper','iterator','kill','malloc','max','max_element','memset','min','min_element','nice','partial_sum','pclose','pop','popen','printf','ptrace','push','push_back','puts','random_shuffle','remove','reverse','scanf','second','setvbuf','size','sort','sprintf','sscanf','std','stdin','stdout','strcat','strcmp','strcpy','strlen','strncmp','swap','sync_with_stdio','top','unique','plus','equal','is_permutation','search','search_n','memcpy','log2','log10','log','exp','pow','round','floor','ceil','sqrt','clock','clock_t','erase','insert','plus','minus','multiplies','divides','modulus','negate','less','greater',
];

var stlcontainers = [
    'array','bitset','deque','forward_list','list','map','multimap','multiset','pair','priority_queue','queue','set','stack','string','unordered_map','unordered_set','valarray','vector',
];

var constants = [
    // Numerics library - Floating-Point Environment
    'FE_ALL_EXCEPT','FE_DIVBYZERO','FE_INEXACT','FE_INVALID','FE_OVERFLOW','FE_UNDERFLOW','FE_DOWNWARD','FE_TONEAREST','FE_TOWARDZERO','FE_UPWARD','FE_DFL_ENV',
    //
    'EOF','EXIT_FAILURE','EXIT_SUCCESS','INFINITY','INT_MAX','INT_MIN','LONG_MAX','LONG_MIN','NULL',
];

var matchingRules={
        characterLiteral:{
            regex:/^('(?:[^'\\]|\\.)')/,
        },
        comment:[
            {
                regex:/^(\/\/.*)\n/,
            },{
                regex:/^(\/\*(?:(?!\*\/)(?:.|\n))*\*\/)/,
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
                headRegex:/^(<)/,
                tailRegex:/^(>)/,
                contain:['headerNameSlash'],
            },{
                active:false,
                headRegex:/^(")/,
                tailRegex:/^(")/,
                contain:['headerNameSlash'],
            },
        ],
        headerNameSlash:{
            active:false,
            regex:/^(\/)/
        },
        definePD:{
            active:false,
            headRegex:/^(define)/,
            tailRegex:/^()\n/,
            contain:['comment','operator','definePDKeyValue'],
        },
        definePDKeyValue:{
            active:false,
            headRegex:/^([A-Z_a-z]+(?:\([^\)]*\))?)/,
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
    };
matchingRules.keywords.keywords=keywords;
matchingRules.library.keywords=library;
matchingRules.stlcontainers.keywords=stlcontainers;
matchingRules.constants.keywords=constants;
async function highlightCpp(source){
    return this.highlight(
        this.newlineDeletedAnalyze(matchingRules,source)
    )
}

var matchingRules$1={
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
    };
async function highlightHtml(source){
    return this.highlight(
        this.analyze(matchingRules$1,source)
    )
}

/*
The following keywords are listed on:
http://www.ecma-international.org/ecma-262/8.0/index.html#sec-keywords
*/
var keyword = [
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
];

var library$1 = [
    'alert',
];

var matchingRules$2={
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
    };
matchingRules$2.keyword.keywords=keyword;
matchingRules$2.library.keywords=library$1;
async function highlightJs(source){
    return this.highlight(
        this.analyze(matchingRules$2,source)
    )
}

var coreCommands = [
    'documentclass',
    'usepackage',
    'documentstyle',
    'title',
    'author',
    'date',
    'pagestyle',
    'thispagestyle',
    'begin',
    'end'
];

var documentClasses = [
    'article',
    'report',
    'book',
    'letter',
    'slides'
];

var commonArguments = [
    'document',
];

var commonPackages = [
    'fontspec',
];

var matchingRules$3={
        comment:{
            regex:/^(%.*\n)/,
        },
        command:{
            headRegex:/^()\\/,
            tailRegex:/^()[^\\a-z]/,
            contain:['operator','commandName'],
        },
        operator:{
            regex:/^([\\\[\]\{\}])/,
        },
        identifier:{
            regex:/^([a-z]+)/,
            containKeywords:[
                'documentClasses',
                'commonArguments',
                'commonPackages',
            ],
        },
        commandName:{
            active:false,
            regex:/^([a-z]+)/,
            containKeywords:['coreCommands'],
        },
        coreCommands:{
            active:false,
        },
        documentClasses:{
            active:false,
        },
        commonArguments:{
            active:false,
        },
        commonPackages:{
            active:false,
        },
    };
matchingRules$3.coreCommands.keywords=coreCommands;
matchingRules$3.documentClasses.keywords=documentClasses;
matchingRules$3.commonArguments.keywords=commonArguments;
matchingRules$3.commonPackages.keywords=commonPackages;
async function highlightTex(source){
    return this.highlight(
        this.analyze(matchingRules$3,source)
    )
}

var functions = {
    highlightCpp,
    highlightHtml,
    highlightJs,
    highlightTex,
};

async function f1(e,highlighter){
    let syntaxHighlighter=this;
    await Promise.all([
        ...e.querySelectorAll('div'+highlighter.selector)
    ].map(async e=>{
        /*e.ondblclick=()=>{
            e.contentEditable=true
        }*/
        e.onkeydown=event=>{
            var cursorPosition;
            event.stopPropagation();
            console.log(event.keyCode);
            if(event.keyCode==37){
                event.preventDefault();
                cursorPosition=
                    getCharacterOffsetWithin(document.getSelection().getRangeAt(0),e);
                goto(e,Math.max(0,cursorPosition-1),0);
            }
            if(event.keyCode==38){
                event.preventDefault();
            }
            if(event.keyCode==39){
                event.preventDefault();
                cursorPosition=
                    getCharacterOffsetWithin(document.getSelection().getRangeAt(0),e);
                goto(e,Math.min(e.textContent.length,cursorPosition+1),0);
            }
        };
        e.oninput=async event=>{
            var range,cursorPosition;
            range=document.getSelection().getRangeAt(0);
            if(range.startContainer!=range.endContainer||range.startOffset!=range.endOffset)
                return
            cursorPosition=getCharacterOffsetWithin(document.getSelection().getRangeAt(0),e);
            var a=e.querySelectorAll('.content');
            for(var j=0;j<a.length;j++)
                if(!/\n$/.test(a[j].textContent))
                    a[j].textContent+='\n';
            if(!/\n$/.test(e.textContent))
                e.textContent+='\n';
            dom(e,{innerHTML:''},text_border(
                await functions[
                    highlighter.functionName
                ].call(syntaxHighlighter,e.textContent)
            ));
            goto(e,cursorPosition,0);
        };
        e.innerHTML=await functions[highlighter.functionName].call(syntaxHighlighter,e.textContent);
        if(!e.classList.contains('bordered'))
            e.style.visibility='';
        function getCharacterOffsetWithin(range,node){
            var treeWalker=document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT,
                node=>{
                    var nodeRange=document.createRange();
                    nodeRange.selectNode(node);
                    return nodeRange.compareBoundaryPoints(Range.END_TO_END,range)<1?
                        NodeFilter.FILTER_ACCEPT
                    :
                        NodeFilter.FILTER_REJECT
                }
            );
            var charCount=0;
            while(treeWalker.nextNode())
                charCount+=treeWalker.currentNode.length;
            if(range.startContainer.nodeType==3)
                charCount+=range.startOffset;
            return charCount
        }
        function goto(node,position,which){
            var treeWalker=document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT
            );
            var charCount=0;
            while(treeWalker.nextNode()){
                if(position<charCount+treeWalker.currentNode.length){
                    var selection=window.getSelection();
                    var range=document.createRange();
                    if(which==0){
                        range.setStart(treeWalker.currentNode,position-charCount);
                        range.setEnd(treeWalker.currentNode,position-charCount);
                    }else if(which==1){
                        range.setStart(treeWalker.currentNode,position-charCount);
                    }else if(which==2){
                        range.setEnd(treeWalker.currentNode,position-charCount);
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                    return
                }
                charCount+=treeWalker.currentNode.length;
            }
        }
    }));
}

let highlighters=[{
        selector:'.highlighted_cpp',
        functionName:'highlightCpp',
    },{
        selector:'.highlighted_html',
        functionName:'highlightHtml',
    },{
        selector:'.highlighted_js',
        functionName:'highlightJs',
    },{
        selector:'.highlighted_tex',
        functionName:'highlightTex',
    }];
async function highlight_all(e){
    e=e||document;
    await Promise.all(highlighters.map(async highlighter=>{
        if(e.querySelectorAll(highlighter.selector).length==0)
            return
        await Promise.all([
            f0.call(this,e,highlighter),
            f1.call(this,e,highlighter),
            f2.call(this,e,highlighter),
        ]);
    }));
}
async function f0(e,highlighter){
    await Promise.all([
        ...e.querySelectorAll('span'+highlighter.selector)
    ].map(async e=>{
        e.innerHTML=await functions[highlighter.functionName].call(this,e.textContent);
        e.style.visibility='';
    }));
}
async function f2(e,highlighter){
    await Promise.all([
        ...e.querySelectorAll('script'+highlighter.selector)
    ].map(async e=>{
        e.innerHTML=await functions[highlighter.functionName].call(this,e.innerHTML);
        if(!e.classList.contains('bordered'))
            replaceByDiv(e);
    }));
}

let {dom: dom$2,html: html$1}=core.althea;
function text_border$1(s){
    let
        countOfLines,
        logCountOfLines;
    s=splitSourceByNewlineCharacter(s);
    countOfLines=s.split('\n').length-1;
    logCountOfLines=Math.floor(Math.round(
        Math.log(countOfLines)/Math.log(10)*1e6
    )/1e6);
    return table()
    function splitSourceByNewlineCharacter(source){
        return splitElementByNewlineCharacter(
            dom$2('div',{innerHTML:source})
            )
    }
    function splitElementByNewlineCharacter(e){
        return[...e.childNodes].map(node=>
            node.nodeType==Node.TEXT_NODE?
                html$1.encodeText(node.wholeText)
            :
                splitElementByNewlineCharacter(
                    node
                ).split('\n').map(s=>(
                    node.innerHTML=s,
                    node.outerHTML
                )).join('\n')
        ).join('')
    }
    function table(){
        let lines=s.split('\n');
        lines.pop();
        return dom$2('table',
            lines.map(s=>s+'\n').map((e,i)=>
                tr(i,e)
            )
        )
    }
    function tr(i,s){
        return dom$2('tr',
            tr=>{tr.dataset.lineNumber=i+1;},
            td_lineNumber(i),
            dom$2('td',{className:'content',innerHTML:s})
        )
    }
    function td_lineNumber(i){
        return dom$2('td',{className:'lineNumber'},td=>{
            td.dataset.lineNumber=i+1;
            td.style.width=6*(logCountOfLines+1)+'pt';
        })
    }
}
async function border_all(e){
    e=e||document;
    for(let f of e.querySelectorAll('div.bordered'))
        dom$2(f,
            {innerHTML:''},
            text_border$1(f.innerHTML),
            f=>{f.style.visibility='';}
        );
    for(let f of e.querySelectorAll('script.bordered'))
        replaceByDiv$1(
            dom$2(f,{innerHTML:''},
                text_border$1(f.innerHTML)
            )
        );
}
function replaceByDiv$1(e){
    let div=dom$2('div',e.firstChild);
    for(let i=0;i<e.classList.length;i++)
        div.classList.add(e.classList[i]);
    e.parentNode.insertBefore(div,e);
    e.parentNode.removeChild(e);
    return div
}

function newlineDeletedAnalyze(matchingRules,source){
/*
C++
N3242 2.2.2
.   Delete "backslash character (\) immediately followed by a
    new-line character".
.   Call analyze0().
.   Add DeletedNewline() back.
*/
    var
        result=[],
        a=source.split('\\\n'),
    source=this.analyze(matchingRules,a.join(''));
    a=a.map(s=>s.length);
    a.pop();
    dfs(source,result,a);
    return result
}
function dfs(source,result,a){
    while(source.length){
        if(typeof source[0]=='string'){
            if(a.length==0){
                result.push(source[0]);
                source.shift();
            }else{
                if(a[0]<source[0].length){
                    result.push(source[0].substring(0,a[0]));
                    result.push(new Syntax(
                        'deletedNewline',
                        ['\\\n']
                    ));
                    source[0]=source[0].substring(a[0]);
                    a.shift();
                }else{
                    result.push(source[0]);
                    a[0]-=source[0].length;
                    source.shift();
                }
            }
            continue
        }
        if(typeof source[0]=='object')(()=>{
            var list=[];
            dfs(source[0].list,list,a);
            result.push(new Syntax(source[0].syntaxName,list));
            source.shift();
        })();
    }
    while(a.length&&a[0]==0){
        result.push(new Syntax('deletedNewline',['\\\n']));
        a.shift();
    }
}

var style = `
/*
    font-weight:bold; 總是要加上 line-height:0px; 忘記原因了
*/
.bordered{
    word-break:break-all;
}
.bordered table{
    table-layout:fixed;
    width:100%;
    font-family:monospace;
    text-align:left;
}
.bordered td.lineNumber::before{
    content:attr(data-line-number);
}
.bordered td.lineNumber{
    text-align:right;
    color:gray;
    vertical-align:top;
    height:12pt;
    white-space:nowrap;
}
.bordered td.content{
    padding-left:16px;
    white-space:pre-wrap;
    word-wrap:break-word;
}
.highlighted_cpp{
    tab-size:4;
    line-height:12pt;
}
span.highlighted_cpp{
    font-family:monospace;
}
span.highlighted_html{
    font-family:monospace;
}
span.highlighted_js{
    font-family:monospace;
}
span.highlighted_tex{
    font-family:monospace;
}
.highlighted_cpp span.deletedNewline{
    font-weight:normal;
    color:black;
}
.highlighted_cpp span.characterLiteral{
    color:blue;
}
.highlighted_cpp span.comment{
    color:gray;
}
.highlighted_cpp span.rawStringLiteral{
    color:blue;
}
.highlighted_cpp span.cStringLiteral{
    color:blue;
}
.highlighted_cpp span.numberLiteral{
    color:darkviolet;
}
.highlighted_cpp span.operator{
    color:red;
}
.highlighted_cpp span.preprocessingDirective{
    color:green;
}
.highlighted_cpp span.headerName{
    color:darkred;
}
.highlighted_cpp span.headerNameSlash{
    color:darkblue;
}
.highlighted_cpp span.definePDKeyValue{
    color:darkred;
}
.highlighted_cpp span.definePDValue{
    color:darkblue;
}
.highlighted_cpp span.definePDValue span.operator{
    color:darkblue;
}
.highlighted_cpp span.keywords{
    color:darkblue;
    font-weight:bold;
    line-height:0px;
}
.highlighted_cpp span.library{
    color:deeppink;
}
.highlighted_cpp span.stlcontainers{
    color:green;
    font-weight:bold;
    line-height:0px;
}
.highlighted_cpp span.constants{
    color:darkviolet;
    font-weight:bold;
    line-height:0px;
}
.highlighted_html span.startTag{
    color:green;
}
.highlighted_html span.tagname{
    color:darkblue;
    font-weight:bold;
    line-height:0px;
}
.highlighted_html span.attribute{
    color:deeppink;
}
.highlighted_html span.afterEqualInAttribute{
    color:green;
}
.highlighted_html span.attributeValue{
    color:blue;
}
.highlighted_html span.endTag{
    color:green;
}
.highlighted_html span.comment{
    color:gray;
}
.highlighted_js span.comment{
    color:gray;
}
.highlighted_js span.string{
    color:blue;
}
.highlighted_js span.number{
    color:darkviolet;
}
.highlighted_js span.keyword{
    color:darkblue;
    font-weight:bold;
    line-height:0px;
}
.highlighted_js span.operator{
    color:red;
}
.highlighted_tex span.comment{
    color:gray;
}
.highlighted_tex span.operator{
    color:red;
}
.highlighted_tex span.coreCommands{
    color:blue;
}
.highlighted_tex span.documentClasses{
    color:green;
}
.highlighted_tex span.commonArguments{
    color:green;
}
.highlighted_tex span.commonPackages{
    color:green;
}
`;

let {dom: dom$1,html}=core.althea;
dom$1.head(dom$1.style(style));
syntaxHighlighter.analyze=analyze;
syntaxHighlighter.newlineDeletedAnalyze=newlineDeletedAnalyze;
syntaxHighlighter.highlight=highlight;
syntaxHighlighter.highlight_all=highlight_all;
syntaxHighlighter.border_all=border_all;
async function syntaxHighlighter(){
    await this.highlight_all();
    await this.border_all();
}
function highlight(list){
    return list.map(item=>{
        if(typeof item=='string')
            return html.encodeText(item)
        else if(typeof item=='object')
            return `<span class=${item.syntaxName}>${
                highlight(item.list)
            }</span>`
    }).join('')
}

export default syntaxHighlighter;