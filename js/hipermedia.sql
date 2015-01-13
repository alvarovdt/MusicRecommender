-- phpMyAdmin SQL Dump
-- version 4.0.10.7
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 13-01-2015 a las 01:02:55
-- Versión del servidor: 5.1.73
-- Versión de PHP: 5.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `hipermedia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cancion`
--

CREATE TABLE IF NOT EXISTS `cancion` (
  `idc` int(11) NOT NULL AUTO_INCREMENT,
  `spotify_url` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `artista` varchar(45) NOT NULL,
  `album` varchar(45) NOT NULL,
  `id_spotify_album` varchar(45) NOT NULL,
  `id_spotify_artista` varchar(45) NOT NULL,
  `reproducciones` varchar(45) NOT NULL,
  PRIMARY KEY (`idc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `playlist`
--

CREATE TABLE IF NOT EXISTS `playlist` (
  `idp` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`idp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `playlist_cancion`
--

CREATE TABLE IF NOT EXISTS `playlist_cancion` (
  `id_playlist` int(11) NOT NULL,
  `id_cancion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
