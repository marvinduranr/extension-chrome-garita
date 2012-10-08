$(document).ready(function() {
//http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401,250501&lane=all&action=rss&f=html
//http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401&lane=all&action=rss&f=html
  $.ajax({
    type: 'POST',
    url: 'http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401,250501&lane=all&action=rss&f=html',
    cache: false,  

    beforeSend:function(){
      //Loading image
      $('#estado').html('<div class="loading"><img src="images/loading.gif" alt="Cargando..." /></div>');
    },
    success:function(data){
      //Successful request
      $('#div_ajax').empty();
      $('#estado').empty();
      $(data).find('item').each(function(i){
      $('#div_ajax').append('<p>' + $(this).find('title').text() + '</p>');
      //$('#div_ajax').append('<p>' + $(this).find('description').text() + '</p>');
      $('#div_ajax').append('<p>'+tiempo($(this).find('description').text())+'</p>');
      });
    },
    error:function(){
      //Failed request
      $('#div_ajax').html('<p style="color:red; font-size: 2em;"><strong>Error!</strong></p>');
    }
  });

  function tiempo(texto){
      
        var indice=texto.indexOf('PDT');
        var garita = "Standard "+ texto.slice(indice + 3);
        var modificado = garita;
        var fin = garita.indexOf("lane(s)");
        garita=garita.slice(0,fin - 3);
        modificado = modificado.slice(fin);

        indice=modificado.indexOf('PDT');
        garita=garita+ "ReadyLine "+modificado.slice(indice+3);
        modificado=garita;
        fin=garita.indexOf("lane(s)");
        garita=garita.slice(0,fin-3);
        modificado=modificado.slice(fin);
      
        return garita

        
  }
});

