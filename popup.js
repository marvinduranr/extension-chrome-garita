$(document).ready(function() {
//RSS SanYsidro-Otay http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401&lane=all&action=rss&f=html
//RSS Clima Tijuana http://weather.yahooapis.com/forecastrss?w=149361&u=c
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
      $('#div_ajax').html('<p class="alert alert-error">Error al cargar las garitas!</p>');
    }
  });

    $.ajax({
    type: 'POST',
    url: 'http://weather.yahooapis.com/forecastrss?w=149361&u=c',
    cache: false,  

    beforeSend:function(){
      //Loading image
      $('#estado').html('<div class="loading"><img src="images/loading.gif" alt="Cargando..." /></div>');
    },
    success:function(data){
      //Successful request
      $('#div_clima').empty();
      $('#estado').empty();
      var info= $(data).find('description:eq(1)').text();
      var forecast = info.slice(info.indexOf('A[')+1, info.indexOf('<BR />'));
      forecast = forecast.slice(0,forecast.indexOf('<br />'))+forecast.slice(forecast.indexOf('/b><br />')+9)
      $('#div_clima').append(forecast);
    
    },
    error:function(){
      //Failed request
      $('#div_clima').html('<p class="alert alert-error">Error al cargar clima!</p>');
    }
  });

  function tiempo(garita, info){
      //tomo nombre de la garita

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
        garita_info = garita_info + "<td>" + color(info_modificado.slice(pos_inicio+3, pos_fin-3))+"</td></tr>";
        info_modificado=info_modificado.slice(pos_fin+4);
        garita_info=garita_info.replace(",",'');
      }
      
      garita_info = garita_info +"</tbdoy></table>"
      return garita_info

  }

  function color(info){
      var pos;
      var cantidad;
      if (info.search('no delay')!= -1 ){
        return "<span class='verde'>Sin demora</span>"
      }

      //verifico cantidad de horas y minutos
      if(info.search('hrs') != -1){
       pos=info.search('hrs');
        cantidad=info.slice(0, pos-1);
        if(parseInt(cantidad)>1){
          return "<span class='rojo'>"+info+"</span>"
        }
        else{
          if(info.search('min') != -1){
            pos=info.search('hrs');
            var pos_extra= info.search('min');
            cantidad=info.slice(pos+3,pos_extra); 
            if(parseInt(cantidad)<30){
              return "<span class='amarillo'>"+info+"</span>"
              }
            else{
              return "<span class='rojo'>"+info+"</span>"
              }
          }
          else{
            return "<span class='amarillo'>"+info+"</span>"
          }
        }
      }

      //verifico cantidad de minutos
      if(info.search('min') != -1){
        pos = info.search('min');
        cantidad = info.slice(0,pos-1);
        if(parseInt(cantidad)<30){
          return "<span class='verde'>"+info+"</span>"
        }
        return "<span class='amarillo'>"+info+"</span>"
      }
      
  }

});