JS_MD_SOURCE = $(wildcard js/*.js.md)
JS_SOURCE = $(JS_MD_SOURCE:.js.md=.js)
JS_MIN_SOURCE = $(patsubst js/%.js.md,build/%.min.js,$(JS_MD_SOURCE))

YUI_VERSION = "2.4.8"

all: build_tools build/ $(JS_MIN_SOURCE) build/F.min.js

clean:
	rm -Rf js/*.js build/

##############
# Build Tools
##############

build_tools: mdtangle mdweave yuicompressor
	echo $(JS_SOURCE) && echo $(JS_MIN_SOURCE)

mdtangle:
	@type -P mdtangle > /dev/null \
	|| go install github.com/tokenshift/mdweb/mdtangle

mdweave:
	@type -P mdweave > /dev/null \
	|| go install github.com/tokenshift/mdweb/mdweave

yuicompressor:
	@find yuicompressor-2.4.8.jar > /dev/null \
	|| wget "https://github.com/yui/yuicompressor/releases/download/v$(YUI_VERSION)/yuicompressor-$(YUI_VERSION).jar"

##############
# Compilation
##############

build/:
	mkdir build

# Build .js files from literate source.
%.js: %.js.md
	mdtangle $<

# Minify .js files using YUI Compressor.
build/%.min.js: js/%.js
	java -jar yuicompressor-$(YUI_VERSION).jar $< -o $@

# Create a minified uber-JS containing all of the F.* libraries.
build/F.min.js: $(JS_SOURCE)
	java -jar yuicompressor-$(YUI_VERSION).jar $< -o $@
