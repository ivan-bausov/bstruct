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
bstruct --watch test.ctdl
```
into test.html and test.scss files. Use **.ctdl** extention for your B:STRUCT files to compile.
**Note!** The executable bin file for B:STRUCT watcher is placed in **bin** folder of bstruct node module folder. If **bstruct** command does not work after the installation by default, try to add this folder to your PATH or create a symlink inside your bin folder.