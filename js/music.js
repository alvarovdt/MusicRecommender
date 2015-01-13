$(window).load(function(){
	
	var audioObject;
	var playlists = ["Lista de reproducción"];
	var tmpArtist;
	var search = function (query,t) {
		
		$.ajax({
			url: 'https://api.spotify.com/v1/search',
			data: {
				q: query,
				type: t,
				market: 'ES'
			},
			success: function (response) {
				console.log(response);
				fillLayout(response);
			}
		});
	};
	
	var playTrack = function(track){
		if(audioObject) audioObject.pause();
		audioObject = new Audio(track.preview_url);
        audioObject.play();
	};
	
	var getArtistsRelated = function(artist) {
		$.ajax({
			url: 'https://api.spotify.com/v1/artists/' + tmpArtist + '/related-artists',
			success: function (response) {
				console.log(response);
				fillRecommendationsLayout(response);
			}
		});
	};
	
	var getArtistsAlbum = function(artist){
		
		var xhr = new XMLHttpRequest();
		var url = "https://api.spotify.com/v1/artists/" + artist.id + "/albums?market=ES&album_type=album";
		xhr.open("GET", url, false);
		xhr.send();
			
		var json = JSON.parse(xhr.response);
		console.log(json);
		return json;
		
	};
	
	var getSongsAlbum = function(album) {
		
		var xhr = new XMLHttpRequest();
		var url = "https://api.spotify.com/v1/albums/" + album.id + "/tracks";
		xhr.open("GET", url, false);
		xhr.send();
			
		var json = JSON.parse(xhr.response);
		console.log(json);
		return json;
		
	};
	
	var getSongsAlbumHref = function(album) {
		
		var href = album.href;
		var url = href.split("spotify:album:");
		console.log(url[1]);
		
		
		var xhr = new XMLHttpRequest();
		var url = "https://api.spotify.com/v1/albums/" + url[1] + "/tracks";
		xhr.open("GET", url, false);
		xhr.send();
			
		var json = JSON.parse(xhr.response);
		console.log(json);
		return json;
		
	};
	
	var getTopTracksArtist = function(artist) {
		$.ajax({
			url: 'https://api.spotify.com/v1/artists/' + artist + '/top-tracks?country=ES',
			success: function (response) {
				console.log(response);
			}
		});
	};
	
	var fillLayout = function(data){
		var artists_layout = document.getElementById("artists");
		var albums_layout = document.getElementById("albums");
		var songs_layout = document.getElementById("songs");
		
		var artists = data.artists.items;
		var albums = data.albums.items;
		var songs = data.tracks.items;

		tmpArtist = artists[0].id;

		youtube.begin();
		console.log("Artista: ");
		console.log(artists[0].name);
		console.log(songs[0].name);
		youtube.search(artists[0].name,songs[0].name + " song ");
		
		var artist_default ="<h1><a href='#' dropdown-prop='title'>Artistas</a></h1>";
		var album_default ="<h1><a href='#' dropdown-prop='title'>Albums</a></h1>";
		var song_default ="<h1><a href='#' dropdown-prop='title'>Canciones</a></h1>";
		
		var code = artist_default;
		code += "<ul class='dropdown-list-items'>";
		for(var i=0; i<artists.length; i++){
			code += "<li class='artist' value="+i+">";
			var ref;
			if(artists[i].images.length > 0) {
				ref = artists[i].images[0].url;
			}else{
				ref = "./img/Not_available.jpg";
			}
			code += '<img src="' + ref + '">';
			code += "<h3>" + artists[i].name + "</h3>";
			code += "<p>"; 
			for(var j=0; j<artists[i].genres.length; j++){
				code += " ";
				code += artists[i].genres[j];
				code += ",";
			}
			code += "</p>";
			code += "</li>";
		}
		code += "</ul>";
		artists_layout.innerHTML = code;
		
		code = album_default;
		code += "<ul class='dropdown-list-items'>";
		for(var i=0; i<albums.length; i++){
			code += "<li class='album' value="+i+">";
			code += '<img src="' + albums[i].images[0].url + '">';
			code += "<h3>" + albums[i].name + "</h3>";
			code += "<p>" + albums[i].album_type + "</p>";
			code += "</li>";
		}
		code += "</ul>";
		albums_layout.innerHTML = code;
		
		code = song_default;
		code += "<ul class='dropdown-list-items'>";
		for(var i=0; i<songs.length; i++){
			code += "<li class='song' value="+i+">";
			code += '<img src="' + songs[i].album.images[0].url + '">';
			code += "<h3>" + songs[i].name + "</h3>";
			code += "<p>" + songs[i].album.name + "</p>";
			code += "<img id='icon' class='add' src='./img/add.png'>";
			code += "<img id='icon' class='spotify' src='./img/spotify.png'>";
			code += "<img id='icon' class='youtube_button' src='./img/youtube.png'>";
			code += "</li>";
		}
		code += "</ul>";
		songs_layout.innerHTML = code;
		
		resul();
		addPlayPreviewEvent(songs,false);
		addAddEvent(songs,false);
		addPlayEvent(songs,false);
		addInfoAlbumEvent(albums);
		addInfoArtistEvent(artists);
	};
	
	var fillLayoutArtist = function(data){
		console.log("hola");
		console.log(data);
		var artist_name = data.name;
		var albums = getArtistsAlbum(data).items;
		console.log(albums);
		
		var code = "<h1 id='titulo_album'>" + artist_name + "</h1>";
		code += "<ul>";
		//Para cada album poner el titulo y la caratula
		for(var i=0; i<albums.length; i++){
			var titulo = albums[i].name;
			var caratula = albums[i].images[0].url;
			
			code += "<li class='album' value="+i+">";
			code += "<img src='" + caratula + "'>";
			code += "<h3>" + titulo + "</h3>";
			code += "</li>";
		}
		code += "</ul>";
		
		document.getElementById("info").innerHTML = code;
		
		addInfoAlbumEvent(albums);
		
	};
	
	var fillLayoutAlbum = function(data){
		console.log(data);
		var album_name = data.name;
		var songs; 
		if(data.uri){
			songs = getSongsAlbum(data).items;
		}else{
			songs = getSongsAlbumHref(data).items;
		}
		
		console.log(songs);
		
		var code;
		
		//Crear un h1 con el nombre del album (y el del artista)
		code = "<h1 id='titulo_album'>" + album_name + "</h1>";
		//Crear un listado con las canciones del disco (cada una con opción de añadir a playlist, escuchar preview o buscar video de youtube)
		code += "<ul>";
			for(var i=0; i<songs.length; i++){
				code += "<li class='song' value="+i+">";
				code += "<h3>" + songs[i].name + "</h3>";
				code += "<img id='icon' class='add' src='./img/add.png'>";
				code += "<img id='icon' class='spotify' src='./img/spotify.png'>";
				code += "<img id='icon' class='youtube_button' src='./img/youtube.png'>";
				code += "</li>";
			}
		code += "</ul>";
		
		document.getElementById("info").innerHTML = code;
		
		addPlayPreviewEvent(songs,true);
		addPlayEvent(songs,true);
		addAddEvent(songs,true);
		
	};
	
	// Gestiona musica mas popular

	var fillInicioLayout = function(data, imgAlbums){
		var albums_popu= document.getElementById("info");
		console.log(data);
		var albums = data.albums;

		var code = "<h1><a href='#' dropdown-prop='title'>Albums más populares!</a></h1>";
		code += "<ul>";
		for(var i=0; i<10; i++){
			code += "<li class='album' value="+i+">";
			code += '<img src="' + imgAlbums[i] + '">';
			code += "<h3>" + albums[i].name + "</h3>";
			code += "<p>Popularidad: " + albums[i].popularity + "</p>";
			code += "</li>";
		}
		code += "</ul>";
		albums_popu.innerHTML = code;
		
		addInfoAlbumEvent(data.albums);
		
	};
	
	var fillLayoutPlaylists = function(){
		//Hacer listado de las playlists
		for(var i=0; i<playlists.length; i++){
			var nombre = playlists[i].name;
			
		}
	};
	
	var initialPlaylists = function(){
		//Crear las 2 listas: cola de reproducción y favoritos
	};
	
	var youtube = {
		begin: function(){
			//Pone una imagen por defecto
			var img = document.createElement("img");
			img.src = "./img/youtube_default.png";
			img.id = "youtubeImg";
			document.getElementById("youtube").appendChild(img);
		},
		next: function(){
			//Pasa a la siguiente de la playlist (si hay)
			
		},
		previous: function(){
			//Pasa a la anterior de la playlist (si hay)
		},
		request: function(url){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, false);
			xhr.send();
			
			var json = JSON.parse(xhr.response);
			this.load(json);
			//return json;
		},
		search: function(artist,song){
			var url = "http://gdata.youtube.com/feeds/api/videos?q="+ artist + " " + song +"&caption&v=2&alt=json";
			//url += artist + " " + song;
			//url += "&alt=json";

			this.request(url);
		},
		load: function(json){
			//Carga un video
			console.log(json.feed.entry[0]);
			//var url = json.feed.entry[0].media$group.media$player.url;
			var url = json.feed.entry[0].content.src;
			//url = "&format=5";
			//url = url.replace("watch?v=", "v/");
			document.getElementById("youtube").innerHTML = '<embed src="'+ url +'">'
		}
	};
	
	
	  	var fillRecommendationsLayout = function(data){
			var artists_recommended= document.getElementById("info");
			console.log(data);
			var artists = data.artists;

			var code = "<h1><a href='#' dropdown-prop='title'>Artistas recomendados</a></h1>";
			code += "<ul>";
			for(var i=0; i<10; i++){
				code += "<li class='artist' value="+i+">";
				code += '<img src="' + artists[i].images[0].url + '">';
				code += "<h3>" + artists[i].name + "</h3>";
				code += "<p>"; 
				for(var j=0; j<artists[i].genres.length; j++){
					code += " ";
					code += artists[i].genres[j];
					code += ",";
				}
				code += "</p>";
				code += "</li>";
			}
			code += "</ul>";
			artists_recommended.innerHTML = code;
			
			addInfoAlbumEvent(data.albums);
		}

	var addPlayPreviewEvent = function(songs,ini){
		console.log("hola");
		$('.spotify').click(function (e) {
			var pos = parseInt(e.currentTarget.parentNode.attributes[1].value);
			console.log(pos);
			var str = $('.song');
			var cancion = songs[pos];
			var album; 
			if(ini){
				album = document.getElementById("titulo_album").innerHTML;
			}
			playTrack(cancion);
		});
	};
	
	var addPlayEvent = function(songs,ini){
		var track;
		$('.youtube_button').click(function (e) {
			console.log("Hola otra vez");
			
			var pos = 0;
			var songname = e.originalEvent.path[1].textContent;
			for(var i=0;i<songs.length;i++){
				if(songname == songs[i].name){
					pos = i;
				}
			}
			var str = $('.song');
			console.log(str);
			var cancion;
			var album;
			if(ini){
				cancion = str[pos].childNodes[0].childNodes[0].data;
				console.log(cancion);
				album = document.getElementById("titulo_album").innerHTML;
				console.log(album);
				console.log(songs);
			}else{
				cancion = str[pos].childNodes[1].childNodes[0].data;
				album = str[0].childNodes[2].childNodes[0].data;
				console.log(album);
				console.log(songs);
			}
			
			
			var album_name;
			if(!songs[0].uri){
				for(var i=0; i<songs.length; i++){
					if(cancion == songs[i].name && album == songs[i].album.name){
						track = songs[i];
						//Buscar en youtube
						console.log(track.artists[i].name);
						console.log(track.name);
						//Youtube.search(track.artists[0].name,track.name);
					}
				}
			}else{
				for(var i=0; i<songs.length; i++){
					if(cancion == songs[i].name){
						track = songs[i];
						//Buscar en youtube
						//console.log(track.artists[i].name);
						console.log(track.name);
					}
				}
			}
				
		});
	};

	
	var addAddEvent = function(songs,ini){
		//Identificar cancion
		var track;
		$('.add').click(function (e) {
			
			var pos = parseInt(e.currentTarget.parentNode.attributes[1].value);
			console.log(pos);
			var str = $('.song');
			var cancion = songs[pos];
			var album_name; 
			if(ini){
				album_name = document.getElementById("titulo_album").innerHTML;
			}
			
			track = songs[pos];
			showPlaylistsDialog(track);
		
			
			
			/*
			console.log("Hola otra vez");
			var str = $('.song');
			console.log(str);
			var cancion;
			var album;
			if(ini){
				cancion = str[0].childNodes[0].childNodes[0].data;
				album = document.getElementById("titulo_album").innerHTML;
				console.log(album);
				console.log(songs);
			}else{
				cancion = str[0].childNodes[1].childNodes[0].data;
				album = str[0].childNodes[2].childNodes[0].data;
				
			}
			
			
			var album_name;
			if(!songs[0].uri){
				for(var i=0; i<songs.length; i++){
					if(cancion == songs[i].name && album == songs[i].album.name){
						track = songs[i];
						showPlaylistsDialog(track);
					}
				}
			}else{
				for(var i=0; i<songs.length; i++){
					if(cancion == songs[i].name){
						track = songs[i];
						showPlaylistsDialog(track);
					}
				}
			}*/
				
		});

	};
	
	var showPlaylists = function(){
		$('#dialog').dialog({
		            autoOpen: true,
		            width: 600,modal:true,
		            buttons: {
		                "Cancelar": function () {
		                    $(this).dialog("close");
		                }
		            }
		        });
	}
	var showPlaylistsDialog = function(track){
		//Insertar playlists
		
		var code = "<h3>Vas a agregar " + track.name + " :</h3>";
		code += "<ul>";
		for(var i=0; i<playlists.length;i++){
			code += "<li value="+i+">";
			code += "<p>" + playlists[i] + "</p>";
			code += "</li>";
		}
		code += "<ul>";
		
		document.getElementById("dialog").innerHTML = code;
		
		$('#dialog').dialog({
		            autoOpen: true,
		            width: 600,modal:true,
		            buttons: {
		                "Cancelar": function () {
		                    $(this).dialog("close");
		                }
		            }
		        });
	};
	
	var addEraseEvent = function(songs, playlist){
	};
	
	var addInfoAlbumEvent = function(albums){
		console.log(document.getElementsByClassName("album"));
		
		$('.album').click(function () {
			var str = $(this);
			console.log(str);
			var album = str[0].childNodes[1].childNodes[0].data;
			console.log(album);
			for(var i=0; i<albums.length; i++){
				console.log(album + " == " + albums[i].name + " ??");
				if(album == albums[i].name){
					console.log(albums[i].name);
					fillLayoutAlbum(albums[i]);
				}
			}	
		});
	};
	
	var addInfoArtistEvent = function(artists){
		console.log(artists);
		
		$('.artist').click(function () {
			var str = $(this);
			console.log(str);
			var artist = str[0].childNodes[1].childNodes[0].data;
			console.log(artist);
			
			for(var i=0; i<artists.length; i++){
				if(artist == artists[i].name){
					console.log(artists[i].name);
					fillLayoutArtist(artists[i]);
				}
			}	
		});
	};
	
	// GESTIÓN DE LA DROPDOWN LIST
	
	var resul = function(){
	
	var dropdown = document.querySelectorAll('.dropdown-list'),
		dropdownArray = Array.prototype.slice.call(dropdown, 0);

	dropdownArray.forEach(function(el) {
	  var button = el.querySelector('a[dropdown-prop="title"]'),
	  //var button = el,
		  menu   = el.querySelector('.dropdown-list-items'),
			//	icon   = button.querySelector('i.dropdown-icon'),
				
				toggleDropdown = function() {
					classie.toggleClass(menu, 'dropdown-list-open');
					//classie.toggleClass(icon, 'dropdown-icon-open');
				};
				button.addEventListener('click', toggleDropdown);
	});
	
	};
	
	

	
	/*
	youtube.begin();
	console.log("El nombre es: ");
	//console.log(this.data);
	console.log("La canción es: ");
//	console.log(data.track);
	youtube.search(data.name,data.track);*/
	
	document.getElementById('search-form').addEventListener('submit', function (e) {
		e.preventDefault();
		var type = "artist,album,track";
		search(document.getElementById('query').value,type);
		//getArtistsRelated("6XyY86QOPPrYVGvF9ch6wz");
		//getSongsAlbum("4Gfnly5CzMJQqkUFfoHaP3");
		//getTopTracksArtist("6XyY86QOPPrYVGvF9ch6wz");
	}, false);
	
	document.getElementById('inicio').addEventListener('click', function (e) {
		console.log("evento!");
		getMostPopular();
	}, false);
	
	document.getElementById('playlists').addEventListener('click', function (e) {
		console.log("evento!");
		showPlaylists();
	}, false);

	document.getElementById('recomendaciones').addEventListener('click', function (e) {
		getArtistsRelated();
	}, false);

	//Coge musica mas popular

	var getMostPopular = function(){
    	$.ajax({
			url: "http://ws.spotify.com/search/1/album.json?q=year:0-3000",
			success: function (response) {
				console.log(response);
				var imgAlbums = [];
				for(i = 0; i < 10; i++){
					var id = response.albums[i].href.substring(14, response.albums[i].href.length);
					imgAlbums[i] = getAlbumImg(id);
				}
				fillInicioLayout(response, imgAlbums);
			}
		});
  	};

  		getMostPopular();

  	var getAlbumImg = function(id){
  		//$.ajax({
			//url: "https://api.spotify.com/v1/albums/" + id,
			//success: function (response) {

				var xhr = new XMLHttpRequest();
    		  	xhr.open("GET", "https://api.spotify.com/v1/albums/" + id, false);
    		  	xhr.send();
    		  	var json_response = xhr.responseText;
    		  	response = JSON.parse(json_response);

				var imgAlbum = [];
				if(response.artists[0].images != 0){
					imgAlbum = response.images[0].url;
				}
				return imgAlbum;
			//}
		//});
  	}
	
});//]]>  