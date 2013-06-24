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
  //_nodeName = "root." + node.toString();
  //_nodeName = {name: _nodeName};

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
          _nodeName = "wiki." + node.toString().split('.').join('');
          _importsItem = "wiki." + rootNode + "." + title.split('.').join('');
        }else{
          _nodeName = "wiki." + rootNode + "." + node.toString().split('.').join('');
          _importsItem = "wiki." + rootNode + "." + node[i].split('.').join('') + "." + title.split('.').join('');
          
          // create nodes for import items
          nodes.push({name: _importsItem, imports: [], size: 0});
        }
        console.log("path: " + _importsItem);

        _nodeName = {name: _nodeName};

        _importsList.push(_importsItem);
        _nodeList.push(title);

      }
    }); 

    // create "nodes" property of object and push temp list to it
    _nodeName["_nodes"] = _nodeList;

    // create "imports" property of object and push temp list to it
    _nodeName["imports"] = _importsList;

    // create "size" property of object
    _nodeSize = _nodeName["_nodes"].length;
    _nodeName["size"] = _nodeSize;
    // push object to global array
    nodes.push(_nodeName);
  };
}

// Start
console.log("starting at root node: " + rootNode)
// start with root node on level 1
extractNodes([rootNode], 1);
// loop over level 2
for(var i in nodes[0]._nodes){
  _tempNode = nodes[0]._nodes[i]
  extractNodes([_tempNode], 2);
}
// flat loop over level 3



// Show results as JSON-String
  $("#firstHeading span").text("Result");
  nodeData = JSON.stringify(nodes);
  $("#mw-content-text").html(nodeData);
  console.log(nodes);
