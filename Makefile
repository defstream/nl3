# nl3 developer tasks — thin wrappers around the npm scripts in package.json.

.DEFAULT_GOAL := help

.PHONY: help install build clean lint lint-fix format format-check typecheck test test-watch coverage bench check pack

help: ## Show this help
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies (npm ci)
	npm ci

build: ## Compile TypeScript to dist/
	npm run build

clean: ## Remove build output and coverage
	npm run clean
	rm -rf coverage

lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint with --fix
	npm run lint:fix

format: ## Format all files with Prettier
	npm run format

format-check: ## Check formatting without writing
	npm run format:check

typecheck: ## Type-check all sources including tests
	npm run typecheck

test: ## Run the test suite once
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

coverage: ## Run tests with coverage report
	npm run test:coverage

bench: ## Run the benchmark suite
	npm run bench

check: lint format-check typecheck build coverage ## Everything CI runs: lint, format, typecheck, build, tests+coverage

pack: build ## Build and preview the npm tarball contents
	npm pack --dry-run
