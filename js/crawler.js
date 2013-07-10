// copy/paste into web developer console on any wikipedia article

// global array of all objects
var nodes = [];

// get root node from page heading
var rootNode = $("#firstHeading span").text();

// set ajax requests to sync
$.ajaxSetup({async:false});
 
// get all nodes of article
var extractNodes = function(node, level){  

  // create temp lists for later use
  _nodeList = [];
  _importsList = [];

  // loop over given array
    for(var i in node){
      
    if(node[i]){
      console.log("creating node on level 2: " + node[i]);
      // replace content on page with new content from target node
      $("#mw-content-text").load(node[i].split(' ').join('_')+" #mw-content-text");
    }
    
    // extract all article links from new content
    $("#mw-content-text a[href^='/wiki']").each(function(){
      title = $(this).attr("title");
      link = $(this).attr("href");

      // filter out internal wikipedia links
      if (title && link.indexOf(":") === -1) {

        // build node name and remove dots
        _nodeName = "wiki." + node.toString().split('.').join('').split('(')[0].split(" ").join("_");
        _importsItem = "wiki." + title.split('.').join('').split('(')[0].split(" ").join("_");

        // handle import nodes dependend on level
        if (level === 1){
          _importsList.push(_importsItem);
        }else{
          // test for common nodes with root node and duplicates. then push to imports list
          if(!(nodes[0].imports.indexOf(_importsItem) === -1) && _importsList.indexOf(_importsItem) === -1 && !(_importsItem === _nodeName)){
            _importsList.push(_importsItem);
          }
         
        }
        console.log("creating node on level 3: " + _importsItem);

        // create "name" property of object
        _nodeName = {name: _nodeName};

        // push title of node to temp list
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

// start
console.log("creating node on level 1: " + rootNode)
var startTime = new Date().getTime();

// start with root node on level 1
extractNodes([rootNode], 1);

// loop over level 2
for(var i in nodes[0]._nodes){
  _tempNode = nodes[0]._nodes[i];
  extractNodes([_tempNode], 2);
}

// clean Data for visualization
console.log("cleaning data");
// delete internal processing nodes
for (var k in nodes){
    delete nodes[k]._nodes;
}
// send root node to nirvana
var nirvana = nodes.splice(0,1);

// show results as JSON-String
$("#firstHeading span").text("Result");
nodeData = JSON.stringify(nodes, null, '\t');
$("#mw-content-text").html("<textarea rows='100'>" + nodeData + "</textarea>");
 
// statistics  
var endTime = new Date().getTime();
var totalNodes = 0;

for(var i in nodes){
  totalNodes = totalNodes + nodes[i].size;
}

//console.log(nodeData);
//console.log(nodes);

console.log("process finished in",(endTime - startTime)/1000,"seconds.");
console.log("analyzed a total of",totalNodes,"nodes.");
