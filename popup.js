$(document).ready(function() {
//RSS SanYsidro-Otay http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401&lane=all&action=rss&f=html
//RSS Clima Tijuana http://weather.yahooapis.com/forecastrss?w=149361&u=c


//Request para el RSS del cbp, solamente para Tj (Otay, San Ysidro)
  $.ajax({
    type: 'POST',
    url: 'http://apps.cbp.gov/bwt/customize_rss.asp?portList=250601,250401&lane=all&action=rss&f=html',
    cache: false,  

    beforeSend:function(){
      //Loading image
      $('#estado').html('<div class="loading"><img src="images/loading.gif" alt="Cargando..." /></div>');
    },
    success:function(data){
      //Successful request, y limpio div's
      $('#div_ajax').empty();
      $('#estado').empty();

      //Tomo la fecha en que se actualizó la información de la garita mandando a la funcion tiempopublicado
      var fechaPub= tiempopublicado($(data).find('pubDate:eq(1)').text());

      //por cada item (garita, Otay o SY) que venga en el XML llamo la función tiempo mandandole que garita la información
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
      //comienzo variable, haciendo la estructura de la tabla, tomo nombre de la garita y creo el tbody
      var garita_info="<table class='table table-striped'><thead><tr><th colspan=2 class='titulo'>"+garita.slice(0,garita.indexOf('-'))+"</th></tr></thead><tbody>";

      //tomo posicion y corto la informacion para tener solo el texto de las lineas
      var passenger_vehicles= info.indexOf('Passenger Vehicles');
      var description = info.indexOf('</description>');
      var info_modificado=info.slice(passenger_vehicles,description);

      var pos_inicio;
      var pos_fin;
      var garita_sola;
      var horario;

      //malillosamente hago un for con un switch (las 4 tipo de lineas) haciendo el órden que corresponde
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

        //me fijo si la garita esta cerrada o pendiente de actualizar
        if(garita_sola.search('Lanes Closed') > -1){
              //si si esta cerrada, mando la información a la funcion color para que me regrese el texto del color correspondiente
              garita_info = garita_info + "<td>" + color('Lineas Cerradas')+"</td></tr>";
              info_modificado=info_modificado.slice(pos_fin-2);
        }
        else if(garita_sola.search('Update Pending') > -1){
              //si si esta pendiente, mando la información a la función color para que me regrese el texto del color correspondiente
              garita_info = garita_info + "<td>" + color('Pendiente de Actualizar')+"</td></tr>";
              info_modificado=info_modificado.slice(pos_fin-2);
        }
        //si no esta cerrada ó pendiente de actualizar, tomo tiempo de la garita
        else{
          // depende del horario cambia el indexOf a buscar, si es horario de verano es PDT, si es horario normal es PST
          horario=info_modificado.indexOf('PDT');
          if(horario > -1){
            pos_inicio=horario;
          }
          else{
            pos_inicio = info_modificado.indexOf('PST');
          }
          
          //busco la palabra lane(s)
          pos_fin = info_modificado.indexOf('lane(s)');
          //mando la información a la función color para que me regrese el texto dependiendo de la cantidad de tiempo que sea la espera
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

      //comparo si esta sin demora, cerradas o pendiente de actualizar
      if (info.search('no delay') > -1 ){
        return "<span class='verde'>Sin demora</span>"
      }

      if (info.search('Lineas Cerradas') > -1 ){
        return "<span class='rojo'>Lineas Cerradas</span>"
      }

      if (info.search('Pendiente de Actualizar') > -1 ){
        return "<span class='negro'>Pendiente de Actualizar</span>"
      }

      //si no, verifico cantidad de horas y minutos para seleccionar el color
      if(info.search('hrs') > -1){
       pos=info.search('hrs');
        cantidad=info.slice(0, pos-1);

        //si es más de 1 hr
        if(parseInt(cantidad)>1){
          return "<span class='rojo'>"+info+"</span>"
        }
        //si no
        else{
          //si tiene hora y minutos
          if(info.search('min') > -1){
            pos=info.search('hrs');
            var pos_extra= info.search('min');
            cantidad=info.slice(pos+3,pos_extra); 
            //si es menos de 1 hr con 30 min
            if(parseInt(cantidad)<30){
              return "<span class='amarillo'>"+info+"</span>"
              }
            else{
              //si es 1 hr con más de 30 min
              return "<span class='rojo'>"+info+"</span>"
              }
          }
          else{
            //si es una hora solamente
            return "<span class='amarillo'>"+info+"</span>"
          }
        }
      }

      //verifico cantidad de minutos (sin horas)
      if(info.search('min') > -1){
        pos = info.search('min');
        cantidad = info.slice(0,pos-1);
        if(parseInt(cantidad)<30){
          //si es menor de 30 min
          return "<span class='verde'>"+info+"</span>"
        }
        //si es mayor de 30 min
        return "<span class='amarillo'>"+info+"</span>"
      }
      
  }

  function tiempopublicado(t){
    //esta función hace el cambio de EST a horario del pacífico, la hora del publicación

    //Mon, 19 Nov 2012 17:11:25 EST
    //Mon, 19 Nov 2012 19:21:13 EST

    var posInicio = t.indexOf(':');
    var posFinal=t.indexOf(':',posInicio+1);
    //tomo hora y minutos
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
    return horas.toString()+":"+minutos;
    //return minutos;
  }

});

function clima(info){
  //Funcion que toma del XML sólamente la temperatura y el tipo de clima (junto con icono)
  var clima= info.slice(info.indexOf('A[')+1, info.indexOf('<BR />'));
  clima = clima.slice(0,clima.indexOf('<br />'))+clima.slice(clima.indexOf('</b><br />')+10);

  var posC= clima.lastIndexOf("C");
  clima = clima.slice(0,posC-1)+"°C";
  return clima;
}













