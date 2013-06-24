// copy/paste into web developer console on any wikipedia article

var nodes = {};
var nodeNr = 0;

// get root node from page heading
var rootNode = $("#firstHeading span").text();

// set ajax requests to sync
$.ajaxSetup({async:false});
 
// get all nodes of article
var extractNodes = function(name){        
  nodes[name] = [];

  // loop over given array
  for(var i=0;i<name.length; i++){
    
    console.log("creating node: " + name[i]);
    
    if(name[i]){
      // replace content on page with new content from target node
      $("#mw-content-text").load(name[i].split(' ').join('_')+" #mw-content-text");
    }else{
      // job finished if there are no more nodes
      console.log("process finished");
      console.log("result:" + Object.keys(nodes).length + " nodes on first level");
      return;
    }
    
    // extract all links from new content
    $("#mw-content-text a[href^='/wiki']").each(function(){
      title = $(this).attr("title");
      link = $(this).attr("href");

      // filter out internal wikipedia links
      if (title && link.indexOf(":") === -1) {
        nodes[name].push(title);
      }
    }); 
  };

  nodeNr++;
  var label = nodes[rootNode][nodeNr];
  extractNodes([label]);
}

// Start
console.log("starting at root node: " + rootNode)
extractNodes([rootNode]);


// Show results as JSON-String
  $("#firstHeading span").text("Result");
  nodeData = JSON.stringify(nodes);
  $("#mw-content-text").html(nodeData);
  console.log(nodes);
