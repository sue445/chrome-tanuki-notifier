# Requirements: git, jq
NAME := chrome-tanuki-notifier
VERSION := $(shell cat manifest.json | jq --raw-output .version)

build/$(NAME)-$(VERSION).zip:
	git archive HEAD --format=zip --output=build/$(NAME)-$(VERSION).zip

.PHONY: clean
clean:
	rm -rf build/*

.PHONY: tag
tag:
	git tag -a $(VERSION) -m "Release v$(VERSION)"
	git push --tags

.PHONY: release
release: tag
	git push origin master
