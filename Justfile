default:
    @just --list

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
