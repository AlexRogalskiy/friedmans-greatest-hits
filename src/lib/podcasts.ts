import type { Item } from 'podcast'
import he from 'he'
import { parseHTML } from 'linkedom'

const filter = (item) => item.title.match(/friedman/gi) || item.description.match(/friedman/gi)

interface Podcast {
	url: string
	filter: (item: Partial<Item>) => boolean
	teams?: string[]
}

export const podcasts: Record<string, Podcast> = {
	'32-thoughts': {
		url: 'https://feeds.simplecast.com/fYqFr5h_',
		filter: (item) => filter(item) || item.description.match(/Elliotte/gi)
	},
	'jeff-marek-show': {
		url: 'https://podcast.sportsnet.ca/shows/hockey-central/feed/podcast/',
		filter
	},
	'donnie-and-dhali': {
		url: 'https://www.spreaker.com/show/4836063/episodes/feed',
		filter,
		teams: ['VAN']
	},
	'tim-and-friends': {
		url: 'https://feeds.simplecast.com/EjXSVgwK',
		filter
	},
	'oilers-now-bob-stauffer': {
		url: 'https://www.omnycontent.com/d/playlist/fdc2ad13-d199-4e97-b2db-a59300cb6cc2/5f246e03-36fc-496e-ad5f-a5bc0108b5f0/2e927caf-b673-4c33-9ae0-a5bc010933fc/podcast.rss',
		filter,
		teams: ['EDM']
	},
	'flames-talk': {
		url: 'https://feeds.simplecast.com/HAqm0QNa',
		filter,
		teams: ['CGY']
	}
}

export function getEpisodesFromXml(xml: string) {
	const { document } = parseHTML(xml)
	const podcastTitle = document.querySelector('channel title')?.innerHTML

	return Array.from(document.querySelectorAll('item')).map((item) => {
		function get(selector: string): string | undefined {
			return sanitizeInnerHtml(item.querySelector(selector)?.innerHTML)
		}

		function addPodcastTitle(text: string) {
			return `[${podcastTitle}] ${text}`
		}

		if (item) {
			const enclosure = item.querySelector('enclosure')

			return {
				title: addPodcastTitle(get('title')),
				author: podcastTitle,
				guid: get('guid'),
				description: get('description'),
				content: get('description'),
				date: get('pubDate'),
				enclosure: enclosure
					? {
							url: enclosure.getAttribute('url')!,
							type: enclosure.getAttribute('type')!,
							size: parseInt(enclosure.getAttribute('length')!)
					  }
					: undefined,
				itunesTitle: addPodcastTitle(get('itunes\\:title')),
				itunesAuthor: get('itunes\\:author'),
				itunesSubtitle: get('itunes\\:subtitle'),
				itunesSummary: get('itunes\\:summary'),
				itunesDuration: get('itunes\\:duration'),
				itunesExplicit: get('itunes\\:explicit') === 'yes',
				itunesImage: get('itunes\\:image')
			}
		}
	})
}

function sanitizeInnerHtml(text: string) {
	if (text) {
		return he.decode(text).replace('<!--[CDATA[', '').replace(']]-->', '')
	}
}
