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
		const podcastTitle = document.querySelector('channel title')?.innerHTML

		document.querySelectorAll('item').forEach((item) => {
			function get(selector: string): string | undefined {
				return sanitizeInnerHtml(item.querySelector(selector)?.innerHTML)
			}

			function addTitleToDescription(text: string) {
				return `[${podcastTitle}]\n${text}`
			}

			if (item) {
				const enclosure = item.querySelector('enclosure')

				const feedItem: Partial<Item> = {
					title: get('title'),
					author: podcastTitle,
					guid: get('guid'),
					description: addTitleToDescription(get('description')),
					content: addTitleToDescription(get('description')),
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
					itunesSummary: addTitleToDescription(get('itunes\\:summary')),
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

	feed.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	return feed.buildXml()
}

function sanitizeInnerHtml(text: string) {
	if (text) {
		return he.decode(text).replace('<!--[CDATA[', '').replace(']]-->', '')
	}
}
