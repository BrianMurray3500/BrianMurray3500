/*global TopicFiles, TopicsWordsList, TopicTitles, viewedDocument */
TXT_RESULTS_FOR = "Search results for: "  
TXT_ERR_NO_INPUT= "You must enter at least one character";
TXT_NO_RESULTS = "No results found for ";


function generateRegExp(request)
{
    var searchExpr, regexp = /(\x20\x20)/g;
    while(request.match(regexp)) {
        // Escape sequence must be written as follows.
        request = request.replace(regexp,"\x20");
    }
    regexp = /(^\x20)|(\x20$)/g;
    while(request.match(regexp)) {
        request = request.replace(regexp,"");
    }
    request = request.replace("*","\\w*");

    searchExpr = new RegExp(request, "i");
    return searchExpr;
}

function normalizeSpace(string)
{
    var regexp = /(\x20\x20)/g;
    while(string.match(regexp)) {
        // Escape sequence must be written as follows.
        string = string.replace(regexp,"\x20");
    }
    regexp = /(^\x20)|(\x20$)/g;
    while(string.match(regexp)) {
        string = string.replace(regexp,"");
    }
    return string;
}

function createSearchResultsArray()
{
    
    //var i = 0, searchResults = new Array(TopicInfo.length);
    
    
    var i = 0, searchResults = new Array(TopicFiles.length);
    for(i = 0; i < searchResults.length; i = i + 1) {
        searchResults[i] = 0;
    }
    return searchResults;
}

function prepareRequest(request)
{
    var regexp = /\\/g;
    request = request.replace(regexp,"\\\\");
    return request;
}

function searchString(request)
{
   	 var searchResults, request1, requestArr, regexp, preparedRequest, element,
        counter = 0, 
        i = 0, 
        j = 0, 
        k = 0, 
        showedLinks = ""
        html=""
        headerHTML="";
        
    searchResults = createSearchResultsArray();
    request1 = normalizeSpace(request);
    requestArr = request1.split(" "); 
    regexp = new Array(requestArr.length);
    
    for(i = 0; i < regexp.length; i = i + 1)
    {
        preparedRequest = prepareRequest(requestArr[i]);
        regexp[i]=generateRegExp(preparedRequest);
    }
    for (j = 0; j < regexp.length; j = j + 1)
    {
        for(i = 0; i < TopicsWordsList.length; i = i + 1)
        {
            if(TopicsWordsList[i]) {
                if(TopicsWordsList[i][0].match(regexp[j])) {
	                for(k = 0; k < TopicsWordsList[i][1].length; k = k + 1) {
                        searchResults[TopicsWordsList[i][1][k]] += 1;
                    }
                }
            }
        }
    }
    
	
    headerHTML += "<div><span class='searchPageSectionTitle'>" + TXT_RESULTS_FOR + "</span>" + jQuery.sap.encodeHTML(request) + "</div>";
    
    
    for(i = 0; i < searchResults.length && counter < 512; i = i + 1)
    {

        if(searchResults[i] >= regexp.length && TopicFiles[i] !== "" && showedLinks.indexOf(TopicFiles[i]) === -1)
        {
			//tempArr = TopicInfo[i].split("@@@");

	        if (TopicTitles[i] !== 'null'){
		        html += "<div class='searchItem'><a href='" + jQuery.sap.encodeHTML(TopicFiles[i]) + "'>" + jQuery.sap.encodeHTML(TopicTitles[i]) + "</a>";
		        
		        if (TopicDescriptions[i] !== '')
		        	html += "<div class=\"searchItemDesc\">" + jQuery.sap.encodeHTML(TopicDescriptions[i]) + "</div>";
		        	
		        html += "</div>";
        	}

        	
            if (TopicTitles[i] !== 'null') {
	            counter += 1;
            }
        }
       
  	  }
    
    if (counter <=0) {
	     headerHTML += "<div> " + TXT_NO_RESULTS +  jQuery.sap.encodeHTML(request) + "</div>" ;
	}
	headerHTML += "<div class='searchPageSpacer'></div>"
	document.getElementById("resultsHeader").innerHTML = headerHTML;
    document.getElementById("results").innerHTML = html;
}

function ViewDocument()
{
    var searchList = document.getElementById("searchList");    
    viewedDocument = open(searchList.options[searchList.selectedIndex].value, "frmTopic");
}


function getParams(){
	var params = getQuerystring("search");
	
	
	//if (params){
	//	document.getElementById('txtSearchTerms').value=params;
		searchString(unescape(params));
	//}
	
	}
	
function redirect (frmSearch){

	    // Check browser compatibitily
    if (window.opera || navigator.userAgent.indexOf("Konquerer")>-1) {

    	alert(txt_browser_not_supported);
        return ;
    }

    searchTerms=frmSearch.txtSearchTerms.value

    if (searchTerms.length < 1) {
        document.getElementById('results').innerHTML = "<span class=\"searchError\">" + TXT_ERR_NO_INPUT + "</span>";
    }
    else {
       window.location = "search.html?search=" + searchTerms;
    }
    
}

function cleanHTML (results) {
	results=results.replace('&', '&amp;');
	results=results.replace('<', '&lt;');
	results=results.replace('>', '&gt;');
	results=results.replace('"', '&quot;');
	results=results.replace('\'', '&#x27;');
	results=results.replace('/', '&#x2F;');
	
	return results;
	}
	
function getQuerystring(key, default_)
	{
	  
      if (default_==null) default_=""; 
	  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
	  var qs = regex.exec(window.location.href);
	  if(qs == null)
	    return default_;
	  else
	    return qs[1];
	}