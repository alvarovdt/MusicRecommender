var BBDD = {

	 consulta: function(method, query){
      url = "http://api.hipermedia.local/";
      var xhr = new XMLHttpRequest();
      xhr.open(method,url,false);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send(query);
      var response = xhr.responseText;
      var json_response = xhr.responseText;
      json = JSON.parse(json_response);
      return json;
  },

getPlaylists: function(){
    method = "PUT";
    query = "SELECT name from playlist";
    j = this.consulta(method,query);
    playlists = [];
    for (i = 0; i < j.response.length; i++){
      playlists[i] = j.response[i].name;
    }
    return playlists;
  },

crearPlaylist: function(nombre, id){
    method = "PUT";
    query = "SELECT name FROM playlist WHERE nombre = '" + nombre + "'";
    if (this.existsInDB(query)){
    	alert("La playlist ya existe! Prueba otro nombre")
    }
    else{
      query = "SELECT nombre FROM playlist";
      resultado = this.consulta(method,query);
      query = "INSERT INTO playlist (idp,nombre) VALUES ('" + id +"', " + nombre + ")";
      resultado = this.consulta(method,query);
      }
  },

addCancionAPlaylist: function(obj, playlist){
    consulta = "SELECT cancion.idc FROM cancion WHERE cancion.spotify_url = '" + obj.spotify_url + "'";
    consulta2 = "SELECT playlist.idp FROM playlist WHERE playlist.nombre = '" + playlist + "'";
    this.updateReproduced(item);
    req = this.consulta("PUT", consulta);
    req2 = this.consulta("PUT", consulta2);
    id_cancion = req.response[0].idc;
    id_playlist = req2.response[0].idp;

    consulta3 = "INSERT INTO playlist_cancion (id_playlist, id_cancion) VALUES ('"+ id_playlist +"','"+ id_cancion +"')";
    req3 = this.consulta("PUT",consulta3);
    
  },

  getPlaylists: function(){
    method = "PUT";
    query = "SELECT name from playlist";
    res = this.consulta(method,query);
    playlists = [];
    for (i = 0; i < res.response.length; i++){
      playlists[i] = res.response[i].name;
    }
    return playlists;
  },

  muestraCancionPlaylist: function(nombre){
    query = "SELECT idp FROM playlist WHERE nombre = '"+ nombre +"'";
    res = this.consulta("PUT",query);
    id_playlist = res.response[0].idp;
    query = "SELECT id_cancion from playlist_cancion WHERE id_playlist = " + id_playlist;
    res = this.request("PUT",query);
    urls = res.response;
    songs = [];
    for (i = 0; i < urls.length; i++){
      query = "SELECT * FROM cancion WHERE idc = " + ids[i].idc;
      res = this.consulta("PUT", query);
      songs[i] = res.response[0];
    }
    return songs;
  }

};
