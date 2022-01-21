import { parseHTML } from 'linkedom'
import { FeedOptions, Item, Podcast } from 'podcast'
import he from 'he'

export async function generateFeed(args: {
	podcast: FeedOptions
	feeds: Array<{
		url: string
		filter: (item: Partial<Item>) => boolean
	}>
}) {
	const feeds = await Promise.all(
		args.feeds.map(async ({ url, filter }) => ({
			filter,
			xml: await fetch(url).then((res) => res.text())
		}))
	)

	const feed = new Podcast({ ...args.podcast, siteUrl: 'https://hockey-feeds.vercel.app' })

	feeds.forEach(({ xml, filter }) => {
		const { document } = parseHTML(xml)

		document.querySelectorAll('item').forEach((item, i) => {
			function get(selector: string): string | undefined {
				const content = item.querySelector(selector)?.innerHTML

				if (content) {
					// remove cdata
					return he.decode(content).replace('<!--[CDATA[', '').replace(']]-->', '')
				}
			}

			if (item) {
				const enclosure = item.querySelector('enclosure')

				const feedItem: Partial<Item> = {
					title: get('title'),
					guid: get('guid'),
					description: get('description'),
					content: get('description'),
					date: get('pubDate'),
					imageUrl: get('image\\:url'),
					enclosure: enclosure
						? {
								url: enclosure.getAttribute('url')!,
								type: enclosure.getAttribute('type')!,
								size: parseInt(enclosure.getAttribute('length')!)
						  }
						: undefined,
					itunesTitle: get('itunes\\:title'),
					itunesAuthor: get('itunes\\:author'),
					itunesSubtitle: get('itunes\\:subtitle'),
					itunesSummary: get('itunes\\:summary'),
					itunesDuration: get('itunes\\:duration'),
					itunesExplicit: get('itunes\\:explicit') === 'yes',
					itunesImage: get('itunes\\:image')
				}
				if (filter(feedItem)) {
					feed.addItem(feedItem)
				}
			}
		})
	})

	return feed.buildXml()
}
