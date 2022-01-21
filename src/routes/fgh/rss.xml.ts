import { feeds } from '$lib/feeds'
import { generateFeed } from '$lib/generate-feed'
import type { RequestHandler } from '@sveltejs/kit'

export const get: RequestHandler = async () => {
	const body = await generateFeed({
		feeds: [feeds['jeff-marek-show']],
		podcast: {
			title: "Friedman's Greatest Hits",
			description: 'All Friedman, all the time',
			feedUrl: `https://hockey-feeds.vercel.app/fgh/rss.xml`,
			imageUrl: `https://hockey-feeds.vercel.app/covers/fgh.jpeg`
		}
	})

	return {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 's-maxage=10, stale-while-revalidate=59'
		},
		body
	}
}
