export WORK_PATH=/work
export DEPLOY_PATH=.deploy
export CI_IMAGE=${CI_REGISTRY}/drx/drx-main:ci-build-image
ASSUME_REQUIRED?=.env.assume

# Check for specific environment variables
env-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable $* not set"; \
		exit 1; \
	fi

# Fill docker image with make vars
.PHONY: .env
.env:
	@echo "make .env"
	cp $(DEPLOY_PATH)/.env.template $(DEPLOY_PATH)/.env
	echo >> $(DEPLOY_PATH)/.env
	touch $(DEPLOY_PATH)/.env.auth
	touch $(DEPLOY_PATH)/.env.assume


.env.assume: $(DEPLOY_PATH)/.env env-AWS_ACCOUNT_ID env-AWS_ROLE
	@echo "make .env.assume"
	echo > $(DEPLOY_PATH)/.env.assume
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml pull aws
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run --rm aws assume-role.sh > $(DEPLOY_PATH)/.env.assume

.PHONY: gitlab-ci-docker
gitlab-ci-docker:
	@echo "Update gitlab-ci-docker"
	docker build --force-rm --no-cache --pull -f .deploy/gitlab-ci-docker/Dockerfile -t $(CI_IMAGE) .
	docker push $(CI_IMAGE)

build-and-upload: .env $(ASSUME_REQUIRED) env-BUILD_ENVIRONMENT
	@echo "Build and Upload to S3"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run build \
	$(DEPLOY_PATH)/node/01_build_and_S3_upload.sh
.PHONY: build-and-upload

deploy: .env $(ASSUME_REQUIRED)
	@echo "Call Deploy"
	$(DEPLOY_PATH)/node/02_trigger_aws_infra.sh
.PHONY: deploy

shell: .env
	@echo "Accessing bash:"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run shell
.PHONY: shell

tests: .env $(ASSUME_REQUIRED)
	@echo "PNPM Test"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run build \
	$(DEPLOY_PATH)/node/03_tests.sh
.PHONY: tests

install-dependencies: .env $(ASSUME_REQUIRED)
	@echo "PNPM Install"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run build \
	$(DEPLOY_PATH)/node/install_dependencies.sh
.PHONY: install-dependencies

.PHONY: slack
slack: .env 
	@echo "Sending Message"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run slack "../slack-notify"