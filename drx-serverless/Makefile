export WORK_PATH=/work
export DEPLOY_PATH=.deploy
export CI_IMAGE=registry.cochlear.dev/drx/drx-main:ci-build-image
export AWS_REGION?=ap-southeast-2
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

.PHONY: .env.assume
# .env.assume: .env env-AWS_ACCOUNT_ID env-AWS_ROLE
.env.assume: .env
	echo > $(DEPLOY_PATH)/.env.assume
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml pull -q aws
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run --rm aws assume-role.sh > $(DEPLOY_PATH)/.env.assume

.PHONY: cancel-job
cancel-job: .env
	@echo "Cancel Job"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd $(DEPLOY_PATH)/scripts/01_cancel_job.sh

.PHONY: serverless-deploy-version
serverless-deploy-version: .env env-SLS_PROJECT_NAME
	@echo "Serverless Deploy and Update Version"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd "$(DEPLOY_PATH)/scripts/02_serverless_deploy_update_version.sh $(SLS_PROJECT_NAME)"

.PHONY: apply-alias
apply-alias: .env env-SLS_PROJECT_NAME
	@echo "Apply Alias"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd "$(DEPLOY_PATH)/scripts/03_apply_version_alias.sh $(SLS_PROJECT_NAME)"

.PHONY: serverless-deploy
serverless-deploy: .env env-PROJECT
	@echo "Serverless Deploy"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd "$(DEPLOY_PATH)/scripts/02_serverless_deploy.sh $(PROJECT)"

.PHONY: update-dns
update-dns: .env env-PROJECT env-BASEPATH
	@echo "Update DNS"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd "$(DEPLOY_PATH)/scripts/03_update_DNS.sh $(PROJECT) $(BASEPATH)"

.PHONY: clear-stack
clear-stack: .env env-PROJECT
	@echo "Clear Stack"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd "$(DEPLOY_PATH)/scripts/04_clearStack.sh $(PROJECT)"

.PHONY: shell
shell: .env
	@echo "Loading Container:"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run shell

.PHONY: tests
tests: .env
	@echo "NPM Test"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd "$(DEPLOY_PATH)/scripts/00_tests.sh ${PROVIDER}"

.PHONY: slack
slack: .env
	@echo "Sending Message"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run slack "../slack-notify"

.PHONE: build-environment
build-environment: .env .env.assume
	@echo "test_run"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run --rm sceptre "cd $(WORK_PATH) && $(DEPLOY_PATH)/scripts/00_setup_aws_resource.sh"

.PHONE: build-apiauthorizer
build-apiauthorizer: .env .env.assume
	@echo "test_run"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd "$(DEPLOY_PATH)/scripts/12_serverless_deploy_update_version.sh cochlear-${PROJECT_CODE}"

.PHONE: build-features
build-features: .env .env.assume
	@echo "test_run"
	docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd "$(DEPLOY_PATH)/scripts/12_serverless_deploy.sh cochlear-${PROJECT_CODE}"

# docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run cicd "$(DEPLOY_PATH)/scripts/02_serverless_deploy.sh ${PROJECT}"

# docker-compose -f $(DEPLOY_PATH)/docker-compose.yml run sceptre "cd $(WORK_PATH) && $(DEPLOY_PATH)/scripts/03_update_DNS.sh ${PROJECT} ${BASEPATH}"
