// copy/paste into web developer console on any wikipedia article

// global array of all objects
var nodes = [];

// get root node from page heading
var rootNode = $("#firstHeading span").text();

// set ajax requests to sync
$.ajaxSetup({async:false});
 
// get all nodes of article
var extractNodes = function(node){  
  
  // create "name" property of object
  _nodeName = node.toString();
  _nodeName = {name: _nodeName};

  // create temp list for later use
  _nodeList = [];

  // loop over given array
    for(var i in node){
    
    console.log("output i: " + i);
    console.log("creating node: " + node[i]);
    
    if(node[i]){
      // replace content on page with new content from target node
      $("#mw-content-text").load(node[i].split(' ').join('_')+" #mw-content-text");
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
        _nodeList.push(title);
      }
    }); 

    // create "imports" property of object and push temp list to it
    _nodeName["imports"] = _nodeList;
    // push object to global array
    nodes.push(_nodeName);
  };
}

// Start
console.log("starting at root node: " + rootNode)
// start with root node
extractNodes([rootNode]);
// loop over level 1
for(var i in nodes[0].imports){
  _tempNode = nodes[0].imports[i]
  extractNodes([_tempNode]);
}

// Show results as JSON-String
  $("#firstHeading span").text("Result");
  nodeData = JSON.stringify(nodes);
  $("#mw-content-text").html(nodeData);
  console.log(nodes);
