$(document).ready(function() {
//RSS SanYsidro-Otay-TKT http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401,250501&lane=all&action=rss&f=html
//RSS SanYsidro-Otay http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401&lane=all&action=rss&f=html
//RSS Clima Tijuana http://rss.weather.com/weather/rss/local/MXBC0005?cm_ven=LWO&cm_cat=rss&par=LWO_rss
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
      $('#div_ajax').append(tiempo($(this).find('title').text() , $(this).text()));
      });
    },
    error:function(){
      //Failed request
      $('#div_ajax').html('<p style="color:red; font-size: 2em;"><strong>Error!</strong></p>');
    }
  });

  function tiempo(garita, info){
      //tomo nombre de la garita
      //var garita_info= "<span class='titulo'>"+garita.slice(0,garita.indexOf('-')) + "</span><br/>";

      var garita_info="<table class='table table-striped'><thead><tr><th colspan=2 class='titulo'>"+garita.slice(0,garita.indexOf('-'))+"</th></tr></thead><tbody>";

      //posicion y corto la informacion para comenzar a tomar el tiempo
      var passenger_vehicles= info.indexOf('Passenger Vehicles');
      var info_modificado=info.slice(passenger_vehicles);
      var pos_inicio;
      var pos_fin;

      for(i=0;i<4;i++){
        switch(i){
          case 0: garita_info = garita_info + "<tr><td>Standard</td> ";
                  break;
          case 1: garita_info = garita_info + "<tr><td>Readylane</td>";
                  break;
          case 2: garita_info = garita_info + "<tr><td>Sentri</td>";
                  break;
          case 3: garita_info = garita_info + "<tr><td>Peatonal</td>";
                  break;
        }
	//tomo posicion del tiempo y lo agrego.
        pos_inicio=info_modificado.indexOf('PDT');
        pos_fin = info_modificado.indexOf('lane(s)');
        garita_info = garita_info + "<td>" +info_modificado.slice(pos_inicio+3, pos_fin-3)+"</td></tr>";
        info_modificado=info_modificado.slice(pos_fin+4);

      }
      garita_info=garita_info.replace(",",'');
      garita_info = garita_info +"</tbdoy></table>"
      return garita_info

  }


});

