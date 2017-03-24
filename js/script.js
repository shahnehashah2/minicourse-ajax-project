
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');


    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');


    // load nytimes
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json" +
          '?q=' + cityStr + '&api-key=09bfc82b94d3412f9a82230279d364e5';

    $.getJSON(url, function(data) {
      $('#nytimes-header').text('New York Times Article About ' +
                                cityStr);
      var docs = data.response.docs;
      docs.forEach(function(doc) {
        $('.article-list').append('<li class="article"><a href="' +
                      doc.web_url + '">' +
                      doc.headline.main +
                      '</a><p>' + doc.lead_paragraph + '</li>');
      });
    }).error(function(){
      $('#nytimes-header').text('New York Times Article could not be loaded');
    });

    //load wiki links
    var wikiurl = `http://en.wikipedia.org/w/api.php?
                  action=opensearch&search=`+ cityStr +
                  `&format=json`;

    var timeout = setTimeout(function() {
      $('#wikipedia-header').text("Could not load wiki links");
    }, 5000);

    $.ajax({
      url: wikiurl,
      dataType: "jsonp",
      success: function(data) {
          var titles = data[1];
          var links = data[3];
          $('#wikipedia-header').text("Relevant wiki links");
          titles.forEach(function(title, i) {
            $('#wikipedia-links').append('<li> <a target= "_blank" href="' +
                                    links[i] + '">' + title + '</a></li>');
          });
          clearTimeout(timeout);
      }
    });
    return false;
};

$('#form-container').submit(loadData);
