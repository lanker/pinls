include env

.PHONY: build
build:
	node_modules/.bin/tsc --noEmit

.PHONY: run
run:
	cd src && python3 -m http.server 4000

.PHONY: lint
lint: node_modules biome.json
	node_modules/.bin/biome check src/

.PHONY: ci
ci: lint build

.PHONY: publish
publish:
	rsync --progress -rl --filter 'protect .htaccess' --delete src/ $(REMOTE)
