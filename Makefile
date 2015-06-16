static-html: build/pymaze.html build/legacy.html

build/pymaze.html: build build/dist build/css build/res build/lib
	cp pymaze.html build/pymaze.html

build/legacy.html: build build/dist-legacy build/css build/res build/lib
	cp legacy.html build/legacy.html

build/res: build
	cp -r res build/res

# some of these polyfills are not needed for the modern version...
build/lib: build
	cp -r lib build/lib

build/dist: build
	babel src --out-dir build/dist --modules amd --whitelist strict,es6.modules,es6.classes,es6.blockScoping

build/dist-legacy: build
	babel src --out-dir build/dist-legacy --modules amd

build/css: build
	cp -r css build/css

build:
	mkdir build

clean:
	rm -r build
