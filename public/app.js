$("#start").on('click', function(){
  $('#articles').empty();

$.getJSON('/articles', function(data) {
  console.log(data);
  for (var i = 0; i<data.length; i++){
    $('#articles').append('<p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+  '<a href="'+ data[i].link +'" target ="_blank">'+ data[i].link +'</a>' + '</p>');
    $('#articles').append();
  }
});



});


$("#delete").on('click', function(){
  
  $.get('/delete', function(data){

  })
  .done(function(data){
    
  })

});

$("#newScrape").on('click', function(){
  
  $.get('/scrape', function(data){

  })
  .done(function(data){
    console.log(data);
  })

});



$(document).on('click', 'p', function(){
  $('#notes').empty();
  var thisId = $(this).attr('data-id');
  console.log(" p data id " + $(this).attr('data-id') );
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log("note data: " + data);
      console.log("note data id: " + data._id)
      $('#notes').append('<h2>' + data.title + '</h2>');
      $('#notes').append('<input id="titleinput" name="title" >');
      $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

      if(data.note){
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
      }
    });
});

$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');
  console.log($(this).attr('data-id'));

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').empty();
    });


  $('#titleinput').val("");
  $('#bodyinput').val("");
});
