import type { RequestHandler } from '@sveltejs/kit'
import { getEpisodesFromXml, podcasts } from '$lib/podcasts'
import { parseHTML } from 'linkedom'
import { add, format, isBefore } from 'date-fns'
import type { Item } from 'podcast'
export const get: RequestHandler = async () => {
	const feedData = await Promise.all(
		Object.entries(podcasts).map(([name, { url, filter, teams }], i) =>
			fetch(url)
				.then((r) => r.text())
				.then((xml) => {
					const { document } = parseHTML(xml)

					const episodes = getEpisodesFromXml(xml).sort(
						(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
					)

					const episodesWithFriedman = episodes.filter(filter)

					const weeklyOccurrence = getWeeklyOccurrence(
						new Date(episodes[0].date),
						new Date(episodes[episodes.length - 1].date),
						episodesWithFriedman
					)

					return {
						slug: name,
						title: document.querySelector('title').textContent,
						description: document.querySelector('description').textContent,
						img: document.querySelector('image url').textContent,
						teams,
						weeklyOccurrence
					}
				})
		)
	)

	return {
		status: 200,
		body: JSON.stringify(feedData)
	}
}

function getWeeklyOccurrence(since: Date, to: Date, episodes: Partial<Item>[]) {
	const episodesByWeek = episodes.reduce((acc, e) => {
		const week = format(new Date(e.date), 'yyyy-ww')
		return {
			...acc,
			[week]: [...(acc[week] || []), e.guid]
		}
	}, {})

	const allWeeks = {}
	let date = since

	while (isBefore(date, to)) {
		allWeeks[format(date, 'yyyy-ww')] = []
		date = add(date, { weeks: 1 })
	}

	const weeks: Record<string, number> = Object.entries(allWeeks).reduce((acc, [week, episodes]) => {
		return {
			...acc,
			[week]: episodesByWeek[week]?.length ?? 0
		}
	}, {})

	const average =
		Object.entries(weeks).reduce((sum, [, count]) => sum + count, 0) / Object.keys(weeks).length

	return average
}
