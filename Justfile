default:
    @just --list

# Development
dev-build:
    docker-compose build dev

dev-up:
    docker-compose up dev

dev:
    docker-compose up dev --build

dev-down:
    docker-compose down

dev-logs:
    docker-compose logs -f dev

# Production
prod-build:
    docker-compose build prod

prod-up:
    docker-compose up prod

prod:
    docker-compose up prod --build

prod-down:
    docker-compose down

prod-logs:
    docker-compose logs -f prod

# Both
down:
    docker-compose down

logs:
    docker-compose logs -f

# Cleanup
clean:
    docker-compose down -v --rmi local

# Tests
test:
    pnpm test:watch

test-run:
    pnpm test:run

test-ui:
    pnpm test:ui
