# River of Ebooks REST API
## Information on how to use the api endpoints to publish and view ebook metadata

### Publishing a book

```
POST to /api/publish containing the body:

{
  title: The book's title,
  author: The author (optional),
  version: A version number (optional),
  isbn: The ISBN (optional),
  opds: file
}
```

Each tuple of `(title, author, version, isbn)` must be unique.

The `opds` parameter is an opds file sent along with the post body.

The server will respond with either:

```
200 OK
{
  "created_at": 1550102480021,
  "updated_at": 1550102480021,
  "id": number,
  "title": string,
  "author": string,
  "isbn": string,
  "version": string
}
```

or

```
400 BAD REQUEST
{
  "error": string,
  "hint": string
}
```

### Fetching published books

GET from /api/books with the query string parameters:

```
title: The book's title (optional)
author: The author (optional)
version: A version number (optional)
isbn: The ISBN (optional)

page: The page of results to view (200 results per page)
```

For example: `GET /api/books?title=foo&page=3`

The server will respond with either:

```
200 OK
[
  {
    "storage": "path/to/opds/storage/location",
    "created_at": timestamp,
    "updated_at": timestamp,
    "id": number,
    "title": string,
    "author": string,
    "isbn": string,
    "version": string
  }
]
```

or

```
404 NOT FOUND
{
  "error": string,
  "hint": string
}
```

### Receiving push notifications to your webhooks:

- Log in to the River of Ebooks website
- Add your webhook URL and desired filters

The server will send a POST request to the provided URL whenever a new ebook is published through the pipeline with the following data:

```
HTTP Headers:
  User-Agent: RoE-aggregator

HTTP Body:
{
  "storage": "path/to/opds/storage/location",
  "created_at": timestamp,
  "updated_at": timestamp,
  "id": number,
  "title": string,
  "author": string,
  "isbn": string,
  "version": string
}
```
