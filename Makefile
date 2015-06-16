.PHONY: static-html
static-html: build/pymaze.html build/legacy.html

build/pymaze.html: build build/dist build/css build/res build/lib pymaze.html
	cp pymaze.html build/pymaze.html

build/legacy.html: build build/dist-legacy build/css build/res build/lib legacy.html
	cp legacy.html build/legacy.html

build/res: build res
	cp -r res build

# some of these polyfills are not needed for the modern version...
build/lib: build lib
	cp -r lib build

build/dist: build src
	babel src --out-dir build/dist --modules amd --whitelist strict,es6.modules,es6.classes,es6.blockScoping

build/dist-legacy: build src
	babel src --out-dir build/dist-legacy --modules amd

build/css: build
	cp -r css build

build:
	mkdir build

.PHONY: clean
clean:
	rm -r build
