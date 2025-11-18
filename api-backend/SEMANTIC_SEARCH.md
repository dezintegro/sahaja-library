# Семантический поиск с использованием pgvector

Этот документ описывает функциональность семантического поиска, добавленную в проект для улучшения качества поиска лекций.

## Обзор

Семантический поиск использует векторные представления (embeddings) текстов для поиска по смыслу, а не только по ключевым словам. Это позволяет находить релевантные результаты, даже если они не содержат точных слов из запроса.

### Основные возможности:

- **Семантический поиск**: Поиск по смыслу с использованием векторных embeddings
- **Гибридный поиск**: Комбинация полнотекстового и семантического поиска
- **Полнотекстовый поиск**: Классический поиск (сохранен для обратной совместимости)

## Технологии

- **pgvector**: PostgreSQL расширение для работы с векторами
- **sentence-transformers**: Библиотека для генерации embeddings
- **Модель**: `paraphrase-multilingual-MiniLM-L12-v2` (поддерживает русский язык)
- **Размерность векторов**: 384

## Установка и настройка

### 1. Установка зависимостей

```bash
cd api-backend
poetry install
```

### 2. Установка pgvector в PostgreSQL

Если pgvector еще не установлен в вашей базе данных:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Применение миграций

```bash
python manage.py migrate
```

Это создаст:
- Расширение pgvector в базе данных
- Поле `embedding` в таблице `lection`
- Индекс для быстрого векторного поиска

### 4. Генерация embeddings для существующих лекций

После применения миграций необходимо сгенерировать embeddings для всех существующих лекций:

```bash
# Генерация для всех лекций без embeddings
python manage.py generate_embeddings

# Регенерация для всех лекций (включая те, у которых уже есть embeddings)
python manage.py generate_embeddings --force

# Обработка первых N лекций (для тестирования)
python manage.py generate_embeddings --limit 100

# Настройка размера батча
python manage.py generate_embeddings --batch-size 50
```

**Примечание**: Генерация embeddings может занять значительное время для большого количества лекций (несколько минут для тысяч записей).

## API Endpoints

### 1. Полнотекстовый поиск (существующий)

```
GET /api/search/lections/search/{query}/
```

Классический полнотекстовый поиск с использованием PostgreSQL tsvector.

**Пример:**
```bash
curl "http://localhost:8000/api/search/lections/search/медитация/"
```

### 2. Семантический поиск (новый)

```
GET /api/search/lections/semantic-search/{query}/
```

Поиск по смыслу с использованием векторных embeddings.

**Query параметры:**
- `similarity_threshold` (float, 0-1): Минимальный порог схожести (по умолчанию: 0.5)
- `page` (int): Номер страницы
- `page_size` (int): Размер страницы

**Пример:**
```bash
# Базовый запрос
curl "http://localhost:8000/api/search/lections/semantic-search/осознанность/"

# С настройкой порога схожести
curl "http://localhost:8000/api/search/lections/semantic-search/осознанность/?similarity_threshold=0.7"

# С пагинацией
curl "http://localhost:8000/api/search/lections/semantic-search/медитация/?page=2&page_size=20"
```

### 3. Гибридный поиск (новый)

```
GET /api/search/lections/hybrid-search/{query}/
```

Комбинированный поиск, использующий как полнотекстовый, так и семантический подходы.

**Query параметры:**
- `similarity_threshold` (float, 0-1): Минимальный порог схожести (по умолчанию: 0.5)
- `fulltext_weight` (float, 0-1): Вес полнотекстового поиска (по умолчанию: 0.3)
- `semantic_weight` (float, 0-1): Вес семантического поиска (по умолчанию: 0.7)

**Пример:**
```bash
# Базовый запрос
curl "http://localhost:8000/api/search/lections/hybrid-search/вибрации/"

# Настройка весов
curl "http://localhost:8000/api/search/lections/hybrid-search/вибрации/?fulltext_weight=0.5&semantic_weight=0.5"
```

## Примеры использования

### Поиск похожих по смыслу текстов

Семантический поиск особенно полезен когда:

1. **Синонимы**: Запрос "радость" найдет тексты о "счастье" и "блаженстве"
2. **Контекст**: Запрос "внутренний покой" найдет тексты о медитации, даже если они не содержат эти слова
3. **Разные формулировки**: Запрос "как достичь самореализации" найдет тексты о духовном развитии

### Python примеры

```python
import requests

# Семантический поиск
response = requests.get(
    "http://localhost:8000/api/search/lections/semantic-search/самореализация/",
    params={"similarity_threshold": 0.6}
)
results = response.json()

# Гибридный поиск
response = requests.get(
    "http://localhost:8000/api/search/lections/hybrid-search/медитация/",
    params={
        "similarity_threshold": 0.5,
        "fulltext_weight": 0.3,
        "semantic_weight": 0.7
    }
)
results = response.json()
```

## Производительность

### Оптимизация

1. **Индекс IVFFlat**: Используется для ускорения векторного поиска
   - Параметр `lists=100` подходит для средних баз данных
   - Для больших баз данных (>1M записей) рекомендуется увеличить до 1000

2. **Batch processing**: Генерация embeddings выполняется пакетами
   - Размер батча по умолчанию: 100 лекций
   - Можно настроить через `--batch-size`

3. **Кэширование**: Модель sentence-transformers загружается один раз (singleton pattern)

### Метрики производительности

- **Время генерации одного embedding**: ~50-100ms
- **Время поиска по 10000 записей**: ~50-200ms (с индексом)
- **Размер одного embedding**: 384 * 4 bytes = 1.5KB

## Автоматическая генерация embeddings

Для автоматической генерации embeddings при создании новых лекций можно добавить сигнал Django:

```python
# modules/core/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from modules.core.models import Lection
from modules.search.services.embeddings import embedding_service

@receiver(post_save, sender=Lection)
def generate_embedding_on_save(sender, instance, created, **kwargs):
    """Generate embedding when lection is created or updated."""
    if instance.content_ru and not instance.embedding:
        embedding = embedding_service.generate_embedding(instance.content_ru)
        instance.embedding = embedding.tolist()
        instance.save(update_fields=['embedding'])
```

## Устранение неполадок

### Ошибка: "pgvector extension not found"

Убедитесь, что pgvector установлен в PostgreSQL:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Ошибка: "Model not found"

При первом запуске модель `paraphrase-multilingual-MiniLM-L12-v2` будет загружена автоматически. Это может занять несколько минут и требует интернет-соединения.

### Медленная генерация embeddings

- Уменьшите размер батча: `--batch-size 50`
- Проверьте доступность GPU (если есть)
- Генерируйте embeddings порциями: `--limit 1000`

## Дополнительная информация

### Изменение модели embeddings

Для использования другой модели отредактируйте файл:
```python
# modules/search/services/embeddings/embedding_service.py
self._model = SentenceTransformer("your-model-name")
```

**Важно**: При изменении модели необходимо:
1. Обновить размерность в миграции и модели
2. Пересоздать индекс
3. Регенерировать все embeddings

### Мониторинг

Рекомендуется мониторить:
- Количество лекций без embeddings
- Время выполнения поисковых запросов
- Использование памяти при генерации embeddings

```sql
-- Лекции без embeddings
SELECT COUNT(*) FROM lection WHERE embedding IS NULL AND content_ru IS NOT NULL;

-- Размер индекса
SELECT pg_size_pretty(pg_relation_size('lection_embedding_idx'));
```

## Поддержка

При возникновении проблем или вопросов, пожалуйста, создайте issue в репозитории проекта.
