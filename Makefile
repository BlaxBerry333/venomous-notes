PROJECT_NAME_BASE = venomous_notes
ENV ?= dev

ifeq ($(ENV),dev)
    PROJECT_NAME = $(PROJECT_NAME_BASE)
	DOCKER_COMPOSE_FILE_PATH = ./docker/docker-compose.dev.yml
else ifeq ($(ENV),prod)
	PROJECT_NAME = $(PROJECT_NAME_BASE)_prod
	DOCKER_COMPOSE_FILE_PATH = ./docker/docker-compose.prod.yml
else
    $(error Unsupported ENV value: $(ENV))
endif


.PHONY: build-all setup-all stop-all clean-all entry


# ====================================================================================================
# build images of all containers
# ====================================================================================================
# example:
# make build-all
# make build-all ENV=dev
# make build-all ENV=prod
build-all:
	@echo "$(PROJECT_NAME) Build All ($(ENV))"
	@docker compose \
		-f ${DOCKER_COMPOSE_FILE_PATH} \
		-p ${PROJECT_NAME} \
		build


# ====================================================================================================
# setup all containers
# ====================================================================================================
# example:
# make setup-all
# make setup-all ENV=dev
# make setup-all ENV=prod
setup-all:
	@echo "$(PROJECT_NAME) Setup All ($(ENV))"
	@docker compose \
		-f ${DOCKER_COMPOSE_FILE_PATH} \
		-p ${PROJECT_NAME} \
		up -d


# ====================================================================================================
# stop then remove all containers, but keep volumes、images
# ====================================================================================================
# example:
# make stop-all
# make stop-all ENV=dev
# make stop-all ENV=prod
stop-all:
	@echo "$(PROJECT_NAME) Stop All ($(ENV))"
	@docker compose \
		-f ${DOCKER_COMPOSE_FILE_PATH} \
		-p ${PROJECT_NAME} \
		down


# ====================================================================================================
# stop then remove all containers、volumes、images
# ====================================================================================================
# example:
# make clean-all
# make clean-all ENV=dev
# make clean-all ENV=prod
clean-all:
	@echo "$(PROJECT_NAME) Clean All ($(ENV))"
	@docker compose \
		-f ${DOCKER_COMPOSE_FILE_PATH} \
		-p ${PROJECT_NAME} \
		down -v --rmi all --remove-orphans


# ====================================================================================================
# entry a running specific container
# ====================================================================================================
# example:
# make entry CONTAINER=notes_server
# make entry ENV=dev CONTAINER=notes_server
# make entry ENV=prod CONTAINER=notes_server
entry:
ifndef CONTAINER
	$(error CONTAINER is undefined. Usage: make entry CONTAINER=container_name)
endif
	@echo "$(PROJECT_NAME) Entry ${CONTAINER}"
	@docker exec -it ${CONTAINER} sh
