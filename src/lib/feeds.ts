export const feeds = {
	'32-thoughts': {
		url: 'https://feeds.simplecast.com/fYqFr5h_',
		filter: (item) => item.description.match(/Elliotte/gi) || item.description.match(/Friedman/gi)
	},
	'jeff-marek-show': {
		url: 'https://podcast.sportsnet.ca/shows/hockey-central/feed/podcast/',
		filter: (item) => {
			return !!item.title.match(/friedman/gi)
		}
	}
}
