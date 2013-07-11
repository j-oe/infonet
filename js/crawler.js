var nodes = [];

var filterLinks = function (links) {
  var cleanLinks = [];
  for (var link in links){
    if (links[link].ns === 0){
      cleanLinks.push(links[link]["*"]);
    }
  }
  return cleanLinks;
}

var getArticles = function (context) {
  _result = "";
  $.ajax({
    async: false,
    type: "GET",
    url: 'http://de.wikipedia.org/w/api.php',
    data: {
      page: context,
      action: 'parse',
      format: 'json',
      prop: 'links'
    },
    dataType: "jsonp",
    success: function(data){
      links = data.parse.links;
      links = filterLinks(links);
      _result = links;
    }
  });
  return _result;
}

var extractNodes = function (node, level) {  

  _articles = [];
  _nodeList = [];
  _importsList = [];

  // loop over given array
    for(var i in node){
      
      //if(node[i]){
      // replace content on page with new content from target node
        if (node[i]){
        _articles = getArticles(node[i].split(' ').join('_'));
      }
        //console.log(_articles);
        //$("#mw-content-text").load(node[i].split(' ').join('_')+" #mw-content-text");
      //}
    
    // extract all article links from new content
    $(_articles).each(function(){
      // title = $(this).attr("title");
      // link = $(this).attr("href");

      // filter out internal wikipedia links
      // if (title && link.indexOf(":") === -1) {

        // build node name and remove dots
        _nodeName = "wiki." + node.toString().split('.').join('').split('(')[0].split(" ").join("_");
        console.log(_nodeName);
        _importsItem = "wiki." + this.split('.').join('').split('(')[0].split(" ").join("_");

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
        _nodeList.push(this);

      // }
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

////////////// START //////////////////////////
// start with root node on level 1

var crawl = function (start) {

  startTime = new Date().getTime();

  extractNodes([start], 1);

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
  nirvana = nodes.splice(0,1);

  // show results as JSON-String
  //$("#firstHeading span").text("Result");
  nodeData = JSON.stringify(nodes, null, '\t');
  //$("#mw-content-text").html("<textarea rows='100'>" + nodeData + "</textarea>");
   
  // statistics  
  endTime = new Date().getTime();
  totalNodes = 0;

  for(var i in nodes){
    totalNodes = totalNodes + nodes[i].size;
  }

  console.log("process finished in",(endTime - startTime)/1000,"seconds.");
  console.log("analyzed a total of",totalNodes,"nodes.");  
}


crawl("Informationssicherheit");
