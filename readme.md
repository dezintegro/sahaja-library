TODO:
1. Работающее апи на существующей базе. Исходим из того, что индексы, хранимки и триггеры уже заведены в БД прошлым проектом.
   * Докер поднимающий инфру - база, редис?
   * Модели для работы с существующей базой
   * Простые CRUD АПИ на ДРФ
   * Запросы для поиска
     * скопировать raw sql из прошлого проекта
     * переписать на django orm
2. Каталог по годам и странам
   1. бек
   2. фронт
3. Подумать насчет поиска по дате
   1. индекс по полю с датой и учитывать в полнотекстовом поиске?
   2. выделение сущностей и отдельный поиск если есть дата
4. Сделать так, чтобы проект заводился на пустой базе
   * Миграции для наката триггеров, хранимок и индексов через джангу.
   * Накатить фейк миграции на лайв
   * Сделать дамп в виде фикстур чтобы легко накатывался на джанго проект
5. Модель юзера и авторизация через соцсети
   * Решить будет ли 0auth либо каких провайдеров будем поддреживать - гугл, ВК?
   * Сделать какой-то вариант авторизаци
6. Редактирование через админку и актуализация\проверка текстов с амрутой
   * продумать флоу
   * найти кто будет делать
   
NGINX config
   https://www.digitalocean.com/community/tools/nginx?domains.0.server.domain=sahajalib.com&domains.0.php.php=false&domains.0.routing.root=false&domains.0.routing.index=index.html&domains.0.routing.fallbackHtml=true&domains.0.routing.fallbackPhp=false&global.logging.cloudflare=true&global.logging.trueClientIp=true&global.docker.dockerfile=true&global.docker.dockerCompose=true&global.app.lang=ru

NGINX + LetsEncrypt
   https://mindsers.blog/en/post/https-using-nginx-certbot-docker/
