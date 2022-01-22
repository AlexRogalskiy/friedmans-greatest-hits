import { getEpisodesFromXml, podcasts } from '$lib/podcasts'
import type { RequestHandler } from '@sveltejs/kit'
import he from 'he'
import { parseHTML } from 'linkedom'
import { FeedOptions, Item, Podcast } from 'podcast'

export const get: RequestHandler = async ({ url: { searchParams } }) => {
	const slugs = []

	searchParams.forEach((_, key) => slugs.push(key))

	if (slugs.length === 0) {
		slugs.push(Object.keys(podcasts))
	}

	const body = await generateFeed({
		slugs,
		podcast: {
			title: "Friedman's Greatest Hits",
			description: 'All Friedman, all the time',
			feedUrl: `https://fgh.mattjennings.io/feed.xml?${slugs.join('&')}`,
			imageUrl: `https://fgh.mattjennings.io/fgh.jpeg`
		}
	})

	return {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 's-maxage=3600'
		},
		body
	}
}

async function generateFeed(args: { podcast: FeedOptions; slugs: string[] }) {
	const feeds = await Promise.all(
		args.slugs
			.map((slug) => podcasts[slug])
			.filter(Boolean)
			.map(async ({ url, filter }) => ({
				filter,
				xml: await fetch(url).then((res) => res.text())
			}))
	)

	const feed = new Podcast({ ...args.podcast, siteUrl: 'https://fgh.mattjennings.io' })

	feeds.forEach(({ xml, filter }) => {
		getEpisodesFromXml(xml).forEach((episode) => {
			if (filter(episode)) {
				feed.addItem(episode)
			}
		})
	})

	feed.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	return feed.buildXml()
}
