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
      var fechaPub= tiempopublicado($(data).find('pubDate:eq(1)').text());
      $(data).find('item').each(function(i){
        $('#div_ajax').append(tiempo($(this).find('title').text() , $(this).text()));
      });
      $('#div_ajax').append("<span class='tiempo'>Información actualizada a las "+fechaPub+"</span>");
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
      var forecast = clima(info);
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
      var description = info.indexOf('</description>');
      var info_modificado=info.slice(passenger_vehicles,description);
      var pos_inicio;
      var pos_fin;
      var garita_sola;
      var horario;

      for(i=0;i<4;i++){
        switch(i){
          case 0: garita_info = garita_info + "<tr><td>Standard</td> ";
                pos_inicio = info_modificado.indexOf('Standard Lanes:');
          pos_fin=info_modificado.indexOf('Readylane:');
                  break;
          case 1: garita_info = garita_info + "<tr><td>Readylane</td>";
                pos_inicio = info_modificado.indexOf('Readylane:');
          pos_fin=info_modificado.indexOf('Sentri Lanes:');
                  break;
          case 2: garita_info = garita_info + "<tr><td>Sentri</td>";
                pos_inicio = info_modificado.indexOf('Sentri Lanes:');
          pos_fin=info_modificado.indexOf('Pedestrian');
                  break;
          case 3: garita_info = garita_info + "<tr><td>Peatonal</td>";
                pos_inicio = info_modificado.indexOf('Standard Lanes:');
          pos_fin=info_modificado.indexOf('open');
                  break;
        }
    
        //tomo la garita que corresponde
        garita_sola= info_modificado.slice(pos_inicio,pos_fin);

        //me fijo si la garita standard esta cerrada
        if(garita_sola.search('Lanes Closed') > -1){
              garita_info = garita_info + "<td>" + color('Lineas Cerradas')+"</td></tr>";
              info_modificado=info_modificado.slice(pos_fin-2);
        }
        else if(garita_sola.search('Update Pending') > -1){
              garita_info = garita_info + "<td>" + color('Pendiente de Actualizar')+"</td></tr>";
              info_modificado=info_modificado.slice(pos_fin-2);
        }
        //si no esta cerrada, tomo tiempo de la garita
        else{
          // depende del horario cambia el indexOf a buscar, si es horario de verano es PDT, si es horario normal es PST
          horario=info_modificado.indexOf('PDT');
          if(horario > -1){
            pos_inicio=horario;
          }
          else{
            pos_inicio = info_modificado.indexOf('PST');
          }
          
          pos_fin = info_modificado.indexOf('lane(s)');
          garita_info = garita_info + "<td>" + color(info_modificado.slice(pos_inicio+3, pos_fin-3))+"</td></tr>";
          info_modificado=info_modificado.slice(pos_fin+4);
          garita_info=garita_info.replace(",",'');
        }

      }//ciclo for
      
      garita_info = garita_info +"</tbdoy></table>"
      return garita_info

  }

  function color(info){
      var pos;
      var cantidad;
      info = info.replace(",",'');
      if (info.search('no delay') > -1 ){
        return "<span class='verde'>Sin demora</span>"
      }

      if (info.search('Lineas Cerradas') > -1 ){
        return "<span class='rojo'>Lineas Cerradas</span>"
      }

      if (info.search('Pendiente de Actualizar') > -1 ){
        return "<span class='negro'>Pendiente de Actualizar</span>"
      }

      //verifico cantidad de horas y minutos
      if(info.search('hrs') > -1){
       pos=info.search('hrs');
        cantidad=info.slice(0, pos-1);
        if(parseInt(cantidad)>1){
          return "<span class='rojo'>"+info+"</span>"
        }
        else{
          if(info.search('min') > -1){
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
      if(info.search('min') > -1){
        pos = info.search('min');
        cantidad = info.slice(0,pos-1);
        if(parseInt(cantidad)<30){
          return "<span class='verde'>"+info+"</span>"
        }
        return "<span class='amarillo'>"+info+"</span>"
      }
      
  }

  function tiempopublicado(t){
    //Mon, 19 Nov 2012 17:11:25 EST
    //Mon, 19 Nov 2012 19:21:13 EST
    var posInicio = t.indexOf(':');
    var posFinal=t.indexOf(':',posInicio+1);
    
    t=t.slice(posInicio-2,posFinal);
    
    //16:32
    var horas = parseInt(t.slice(0,t.indexOf(':')));
    var minutos = t.slice(t.indexOf(':')+1);

    if(parseInt(minutos)<10){
      minutos="0"+minutos;
    }

    if (horas < 3){
     horas = 21 + horas;
    }
    else{
      horas = horas - 3;
    }
    return t+" HORA LOCAL: "+horas.toString()+":"+minutos;
    //return minutos;
  }

});

function clima(info){
  var clima= info.slice(info.indexOf('A[')+1, info.indexOf('<BR />'));
  clima = clima.slice(0,clima.indexOf('<br />'))+clima.slice(clima.indexOf('</b><br />')+10);

  var posC= clima.lastIndexOf("C");
  clima = clima.slice(0,posC-1)+"°C";
  return clima;
}













