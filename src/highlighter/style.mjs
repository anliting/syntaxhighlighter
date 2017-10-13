export default`
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
`