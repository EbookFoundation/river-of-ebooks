# River of Ebooks signed requests
## Information on how to receive new publications from RoE

To have RoE send your service any newly published or updated ebooks, you will first need to register an account and then create a Push URI. RoE will send a POST request containing the OPDS2 metadata from any published or updated book to each valid URL. The POST body structure can be viewed in the [API documentation](docs/api).


## Information on how to verify that requests are sent by RoE

1. Grab your Signing Secret from the bottom of the 'My account' page. In this example, the Signing Secret is `919ac0b6c07b50`. Additionally, extract the raw request body from the request.
```js
signing_secret = 'ROE_SIGNING_SECRET' // set this as an environment variable
>>> '919ac0b6c07b50'
request_body = request.body()
>>> {"metadata":{"@type":"http://schema.org/Book","title": "Moby-Dick" ...
```

2. Extract the timestamp header (`1551832182955` in this example). The signature depends on the timestamp to protect against replay attacks. While you're extracting the timestamp, check to make sure that the request occurred recently. In this example, we verify that the timestamp does not differ from local time by more than five minutes.
```js
timestamp = request.headers['X-RoE-Request-Timestamp']
>>> 1551832182955
if absolute_value(time.time() - timestamp) > 60 * 5:
  // The request timestamp is more than five minutes from local time.
  // It could be a replay attack, so let's ignore it.
  return
```

3. Concatenate the version number (`v0`), the timestamp (`1551832182955`), and the request body (`{"metadata":{"@type":"http...`) together, using a colon (`:`) as a delimiter.
```js
sig_basestring = 'v0:' + timestamp + ':' + request_body
>>> 'v0:1551832182955:{"metadata":{"@type":"http://schema.org/Book","title": "Moby-Dick" ...'
```

4. Then hash the resulting string, using the signing secret as a key, and take the hex digest of the hash. In this example, we compute a hex digest of `1d37b59f919ac0b6c07b50484091ab1375063ee0913ea728c23`. The full signature is formed by prefixing the hex digest with `v0=`, to make `v0=1d37b59f919ac0b6c07b50484091ab1375063ee0913ea728c23`.
```js
my_signature = 'v0=' + hmac.compute_hash_sha256(
signing_secret,
sig_basestring
).hexdigest()
>>> 'v0=1d37b59f919ac0b6c07b50484091ab1375063ee0913ea728c23'
```

5. Compare the resulting signature to the header on the request.
```js
signature = request.headers['X-RoE-Signature']
>>> 'v0=1d37b59f919ac0b6c07b50484091ab1375063ee0913ea728c23'
if (hmac.compare(my_signature, signature)) {
  deal_with_request(request)
}
```
