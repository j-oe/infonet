$(document).ready(function(){
  $("#start").click(function(){
		$(".hero-unit").fadeOut();
		$(".navbar").slideDown();
		$("input").focus();
		$("#content").fadeIn();
	});
	$(".presetNode").click(function(){
		_preset = $(this).text()
		event.preventDefault();
		$("input").val(_preset);
		$("#content").attr('src',"http://de.wikipedia.org/wiki/" + _preset.split(' ').join('_'))
	});
	$("#go").click(function(){
		event.preventDefault();
		_node = $("input").val();
		$("#content").attr('src',"http://de.wikipedia.org/wiki/" + _node.split(' ').join('_'))
	});
	$(".typeahead").typeahead({
		source: function(query, process){
			$.ajax({
				url: 'http://de.wikipedia.org/w/api.php',
				dataType: 'jsonp',
				data: {
					action: 'opensearch',
					search: query,
					limit: 10,
					namespace: 0,
					format: 'json'
				},
				success: function(data){
					return process(data[1]);
				}
			});
		}
	});
});

