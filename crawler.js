// copy/paste into web developer console on any wikipedia article

// global array of all objects
var nodes = [];

// get root node from page heading
var rootNode = $("#firstHeading span").text();

// set ajax requests to sync
$.ajaxSetup({async:false});
 
// get all nodes of article
var extractNodes = function(node, level){  
  
  // create "name" property of object
  _nodeName = node.toString();
  _nodeName = {name: _nodeName};

  // create temp lists for later use
  _nodeList = [];
  _importsList = [];

  // loop over given array
    for(var i in node){
    
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

        // build hierarchical node name dependent on level and remove dots
        if (level === 1){
          _importsItem = rootNode + "." + title.split('.').join('');
        }else{
          _importsItem = rootNode + "." + node[i].split('.').join('') + "." + title.split('.').join('');
        }
        console.log("path: " + _importsItem);
        _importsList.push(_importsItem);
        _nodeList.push(title);

      }
    }); 

    // create "nodes" property of object and push temp list to it
    _nodeName["nodes"] = _nodeList;

    // create "imports" property of object and push temp list to it
    _nodeName["imports"] = _importsList;

    // create "size" property of object
    _nodeSize = _nodeName["nodes"].length;
    _nodeName["size"] = _nodeSize;
    // push object to global array
    nodes.push(_nodeName);
  };
}

// Start
console.log("starting at root node: " + rootNode)
// start with root node
extractNodes([rootNode], 1);
// loop over level 1
for(var i in nodes[0].nodes){
  _tempNode = nodes[0].nodes[i]
  extractNodes([_tempNode], 2);
}

// Show results as JSON-String
  $("#firstHeading span").text("Result");
  nodeData = JSON.stringify(nodes);
  $("#mw-content-text").html(nodeData);
  console.log(nodes);
