#B:STRUCT
B:STRUCT is a simple preprocessor for easy to write structures into HTML and appropriate SCSS-templates. Because of syntax lack, B:STRUCT is easy to learn and use. Using B:STRUCT you get a good boilerplate for your front-end project. 

##Examples
Simple B:STRUCT structure like:
```
b:header
    id:main
    e:logo>img
    e:link>a
b:footer
    e:copyright>a
```
is compiled into appropriate HTML and SCSS-templates:
```html
<div class="block-header" id="main">
    <img class="header_logo" src="" alt=""/>
    <a class="header_link" href="#" title=""></a>
</div>
<div class="block-footer">
    <a class="footer_copyright" href="#" title=""></a>
</div>
```

```scss
.block-header {
    img.header_logo{
    }
    a.header_link{
    }
}
.block-footer {
    a.footer_copyright{
    }
}
```

##Usage
Use B:STRUCT watcher to compile **.ctdl** text files into HTML and SCSS. For, example run command:
```
$ bstruct --watch test.ctdl
```
to watch and compile test.ctdl file into test.html and test.scss files. Use **.ctdl** extention for your B:STRUCT files to compile.
**Note!** The executable bin file for B:STRUCT watcher is placed in **bin** folder of bstruct node module folder. If **bstruct** command does not work after the installation by default, try to add this folder to your PATH or create a symlink inside your bin folder.

##Syntax

###Declarations
B:STRUCT uses two main logical entities to describe page markup structure.
**BLOCK** represents complete logical part of web-site page like header, footer, popup, sale-block and etc. **BLOCK** contains **ELEMENTS** that represent its markup (for example, logo inside header, button inside product sale block and etc.).
Every **BLOCK** must have an unique name (class name in HTML and CSS). 

Use:
```
b:header
```
to declare block with name 'header' ('block-header' class name in markup).
```html
<div class="block-header"></div>
```

Use **'>'** operand to specify HTML-tag to use in markup for your block:
```
b:header>ul
```
creates UL HTML-element with 'block-header' class name.
```html
<ul class="block-header"></ul>
```

**ELEMENT** must have an unique name inside its block. To provide element name uniqueness inside whole web-page B:STRUCT preprocessor prepends ELEMENT name with its parent block name. For example:
```
b:header
    e:auth
```
e:auth structure compiles into DIV HTML-element with 'header_auth' CSS-class name.
```html
<div class="block-header">
    <div class="header_auth"></div>
</div>
```

**ELEMENT** declaration supports '>' and key:value syntax too.

###Nesting
To declare nested elements use ``4-spaces length`` offsets.

###Attributes
Use **key:value** pairs to specify attributes for your block:
```
b:stats>table
    id:main
    width:300
```
creates IMG HTML-element with class name 'block-logo', and attributes id="main" and width="300".
```html
<table class="block-stats" id="main" width="300"></table>
```