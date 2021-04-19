-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-04-2021 a las 09:33:41
-- Versión del servidor: 10.4.18-MariaDB
-- Versión de PHP: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `registrohorarioapi`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `interrupcion`
--

CREATE TABLE `interrupcion` (
  `Id` int(15) NOT NULL,
  `IDJornada` int(15) NOT NULL,
  `Motivo` varchar(100) NOT NULL,
  `EsRecuperable` tinyint(1) NOT NULL,
  `HoraInicio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `HoraFin` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jornada`
--

CREATE TABLE `jornada` (
  `Id` int(15) NOT NULL,
  `IDUsuario` int(15) NOT NULL,
  `HoraInicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `HoraFin` timestamp NULL DEFAULT NULL,
  `HoraInicioEditada` timestamp NULL DEFAULT NULL,
  `HoraFinEditada` timestamp NULL DEFAULT NULL,
  `MotivoEdicion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `jornada`
--

INSERT INTO `jornada` (`Id`, `IDUsuario`, `HoraInicio`, `HoraFin`, `HoraInicioEditada`, `HoraFinEditada`, `MotivoEdicion`) VALUES
(1, 1, '2021-04-19 07:26:00', '2021-04-19 07:26:26', '2021-04-15 07:30:00', NULL, 'asdsa'),
(2, 1, '2021-04-19 07:26:49', '2021-04-19 07:27:27', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil`
--

CREATE TABLE `perfil` (
  `Id` int(15) NOT NULL,
  `Denominacion` varchar(50) NOT NULL,
  `IDUsuario` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `perfil`
--

INSERT INTO `perfil` (`Id`, `Denominacion`, `IDUsuario`) VALUES
(2, 'Prueba', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `Id` int(15) NOT NULL,
  `Denominacion` varchar(50) NOT NULL,
  `IDPerfil` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`Id`, `Denominacion`, `IDPerfil`) VALUES
(1, 'Permiso 1', 2),
(2, 'Permiso 2', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Id` int(15) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Apellidos` varchar(80) NOT NULL,
  `idms` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Id`, `Nombre`, `Apellidos`, `idms`) VALUES
(1, 'Prueba', 'qqqq', 'qqqq'),
(2, 'Prueba2', 'dasdsa', 'dasdas');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `interrupcion`
--
ALTER TABLE `interrupcion`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `jornada_fk` (`IDJornada`);

--
-- Indices de la tabla `jornada`
--
ALTER TABLE `jornada`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `usuario_fk` (`IDUsuario`);

--
-- Indices de la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `usuarioperfil_fk` (`IDUsuario`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `perfil_fk` (`IDPerfil`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `interrupcion`
--
ALTER TABLE `interrupcion`
  ADD CONSTRAINT `jornada_fk` FOREIGN KEY (`IDJornada`) REFERENCES `jornada` (`Id`);

--
-- Filtros para la tabla `jornada`
--
ALTER TABLE `jornada`
  ADD CONSTRAINT `usuario_fk` FOREIGN KEY (`IDUsuario`) REFERENCES `usuario` (`Id`);

--
-- Filtros para la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD CONSTRAINT `usuarioperfil_fk` FOREIGN KEY (`IDUsuario`) REFERENCES `usuario` (`Id`);

--
-- Filtros para la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD CONSTRAINT `perfil_fk` FOREIGN KEY (`IDPerfil`) REFERENCES `perfil` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
