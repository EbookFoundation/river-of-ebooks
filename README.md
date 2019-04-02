# River of Ebooks
https://github.com/EbookFoundation/river-of-ebooks

## About
The River of Ebooks serves as an easy-to-use ebook aggregator. Publishers can send metadata from new and updated ebooks through the River where it will be available for any downstream consumers to read, allowing for a more widely available ebook collection. This way, ebooks can be made available on all end user sites, instead of only the site they were published with.

## Use cases

### Finding a list of relevant ebooks and keeping them updated
The River provides a filterable feed of ebook metadata in OPDS2 format. Consumers can use this to find new ebooks to catalogue, and can then choose to receive updates to the metadata when new revisions of the ebook are published.

> BigLister want to make a big list of software manuals, where people come to get the latest versions of documentation. Or maybe BigLister is making a list of textbooks that can be adopted for high schools. BigLister wants to find relevant books and doesn't want to be constantly updating the list when new versions come out. BigLister doesn't want deal with 18th century novels or academic books; BigLister wants to be able to ignore books that aren't of interest.

### Convenient notifications of ebook updates
Consumers can find books without searching through the feed as well - just enter some filters and get notifications sent to a webhook whenever a book matching your filters is published.

> UpdateLister isn't so much interested in finding books, UpdateLister just wants to be able to see when a book on UpdateLister's favorites list is updated - because the books get updated irregularly. UpdateLister needs to be able to easily add books to the list.

### Propogate ebook revisions quickly across multiple websites
Whenever a publisher sends ebook metadata through the River, it will be sent to any consumers who have chosen to be notified about changes to the book. This saves the publisher and consumers the trouble of having to worry about everyone having the latest version of the content.

> When TextbookWriter's book is first released, it needs to find adopters, and many of those adopters are scouring BigLister's textbook list. TextbookWriter can work to get the book in well known lists, but it turns out that there are more specialized lists all over the place. A month later TextbookWriter has discovered a terrible error in chapter 3 and hopes that teachers who have adopted the book can be notified about the new version.
