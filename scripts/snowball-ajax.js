jQuery(document).ready(function($) {
  // We can also pass the url value separately from ajaxurl for front end AJAX implementations
  $("#publish").click(function() {
    var blocksRetrieved = retrieveBlocks();
    var articleRetrieved = retrieveRenderedPage();
    
    var blocks_data = {
      "action": "add_blocks",   // this is needed to know which callback to use
      "blocks": blocksRetrieved,
      "post_id": ajax_object.post_id
    };

    var article_data = {
      "action": "add_article",
      "article": articleRetrieved,
      "post_id": ajax_object.post_id
    };

    // adding article to db
    $.post(ajax_object.ajax_url, article_data, function(response) {
      console.log("The article save button was clicked: " + response);
    });

    // adding blocks data to db
    $.post(ajax_object.ajax_url, blocks_data, function(response) {
      //TODO what should be done with the response
      // the page automatically reloads the webpage
    });
  });

  /* 
    This function will traverse through all the html in all the blocks
    and retrieve all the data about the block the user added.
  */
  function retrieveBlocks(){
    var blocks = [];
    // element is a form that represents a block
    // parseBlock is a function
    $(".snowball-main form").each(parseBlock);

    /*
      parseBlock will retrieve the data-target attributes that
      are contained in the input tags
    */
    function parseBlock(orderNumber, blockForm) {
      var type = $(blockForm).attr("data-name");
      var selector = "input[type='text'][data-target], input[type='range'][data-target], input[type='hidden'][data-target], input[type='radio'][data-target]:checked, input[type='checkbox'][data-target]:checked, textarea[data-target]";
      var inputs = $(blockForm).find(selector);

      var block = {
        blockType: type,
        orderNumber: orderNumber
      };
      // element is a tag with an attribute called data-target
      inputs.each(function(index, element) {
        var dataTarget = $(element).attr("data-target");
        var inputValue = $(element).val();
        block[dataTarget] = inputValue;
      });
      blocks.push(block);
    }
  
    return blocks;
  }


  // retrieves the html of the blocks in the preview of the blocks
  // and save the html to the article table
  // this function returns the html
  function retrieveRenderedPage(){
    var html = '';
    jQuery(".snowball-preview").each(function(index, element){
      html = html + "\n" + jQuery(element).contents().find("body").html();
    });

    return html;
  }
});