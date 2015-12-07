# Magento + RWD Template + SASS + GulpJS + BrowserSync #

This is default Magento RWD template with Gulp (Sass) without Compass.
Now compilation time is very fast - about ~5ms.  


### What is this? ###

* Magento RWD Template  
* [SASS](http://sass-lang.com/)
* [Gulp](http://gulpjs.com/)
* [Node.JS](https://nodejs.org/)
* [Magento 1.9](http://magento.com/)
* [BrowserSync](http://browsersync.io/)
* [Bower](http://bower.io/)


### Installation ###

1) First install nodeJS dependencies `packages.json`

	npm install
    
2) Install Bower dependency tree
    
    npm install -g bower
    
    bower install

3) Run Gulp + BrowserSync to watch changes and reload browsers

    gulp serve


### Usage / tasks ###

* SASS (minify + uglify)
* JS (JShint + minify)
* Images (optimization)


## TODO:
[ ] gulp-plugin-load
[ ] fonts
[ ] css optimize / Minify by csso
[ ] stats 
[ ] directory refactoring


### Author ###

* Karol Parfieńczyk <parfienczyk@gmail.com>
* [http://parfienczyk.pl](http://parfienczyk.pl)
