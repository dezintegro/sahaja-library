infra_up:
	docker-compose -f docker-compose.local.yml up -d

infra_stop:
	docker-compose -f docker-compose.local.yml stop

fixtures_dump:
	./api-backend/manage.py dumpdata -e contenttypes -e auth.Permission -e admin -e=sessions --indent 2 -o fixtures.json

fixtures_load:
	./api-backend/manage.py loaddata fixtures.json
