$(document).ready(function() {
//RSS SanYsidro-Otay-TKT http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401,250501&lane=all&action=rss&f=html
//RSS SanYsidro-Otay http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401&lane=all&action=rss&f=html
  $.ajax({
    type: 'POST',
    url: 'http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401&lane=all&action=rss&f=html',
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
      $('#div_ajax').append('<p>'+tiempo($(this).find('title').text() , $(this).text())+'</p>');
      });
    },
    error:function(){
      //Failed request
      $('#div_ajax').html('<p style="color:red; font-size: 2em;"><strong>Error!</strong></p>');
    }
  });

  function tiempo(garita, info){
      //tomo nombre de la garita
      var garita_info= garita.slice(0,garita.indexOf('-')) + "<br/>";

      //posicion y corto la informacion para comenzar a tomar el tiempo
      var passenger_vehicles= info.indexOf('Passenger Vehicles');
      var info_modificado=info.slice(passenger_vehicles);
      var pos_inicio;
      var pos_fin;

      for(i=0;i<4;i++){
        switch(i){
          case 0: garita_info = garita_info + "Standard ";
                  break;
          case 1: garita_info = garita_info + "Readylane ";
                  break;
          case 2: garita_info = garita_info + "Sentri ";
                  break;
          case 3: garita_info = garita_info + "Peatonal ";
                  break;
        }
	//tomo posicion del tiempo y lo agrego.
        pos_inicio=info_modificado.indexOf('PDT');
        pos_fin = info_modificado.indexOf('lane(s)');
        garita_info = garita_info + info_modificado.slice(pos_inicio+3, pos_fin-3)+"<br/>";
        info_modificado=info_modificado.slice(pos_fin+4);

      }
      garita_info=garita_info.replace(",",'');
      garita_info = garita_info +"<br/>"
      return garita_info

  }
});

