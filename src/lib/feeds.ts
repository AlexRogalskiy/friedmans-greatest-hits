const filter = (item) => item.title.match(/friedman/gi) || item.description.match(/friedman/gi)

export const feeds = {
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
