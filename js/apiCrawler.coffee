
window.wikiResults = []
window.wikiCounter = 0


class WikiGrabber

  printResults : () ->
		console.log "results: "
		console.log window.wikiResults


	getNodes : (articles) ->

		self = this
    
		if window.wikiCounter++ >= 1
			console.log "aborting"
			return

		for article in articles
			articleUrl = "http://de.wikipedia.org/w/api.php?page=#{article}&action=parse&format=json&prop=links&callback=?"

			$.ajax
				type: "GET"
				url: articleUrl
				dataType: "jsonp"
				jsonp: "jsonp"	
				
				success: (data) ->
					links = data.parse.links
					links = (link["*"] for link in links when link.ns == 0)
					window.wikiResults[article] = links
					self.getNodes(links)
					self.printResults()

				

      
# MAIN
g = new WikiGrabber()
g.getNodes(["informationssicherheit"])
