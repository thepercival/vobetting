<?php
// DIC configuration

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

$container = $app->getContainer();

// view renderer
$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};

// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], $settings['level']));
    return $logger;
};

// Doctrine
$container['em'] = function ($c) {
    $settings = $c->get('settings')['doctrine'];
	class CustomYamlDriver extends Doctrine\ORM\Mapping\Driver\YamlDriver
	{
		protected function loadMappingFile($file)
		{
			return Symfony\Component\Yaml\Yaml::parse(file_get_contents($file), Symfony\Component\Yaml\Yaml::PARSE_CONSTANT);
		}
	}

	$config = Doctrine\ORM\Tools\Setup::createConfiguration(
		$settings['meta']['auto_generate_proxies'],
		$settings['meta']['proxy_dir'],
		$settings['meta']['cache']
	);
	$config->setMetadataDriverImpl( new CustomYamlDriver( $settings['meta']['entity_path'] ));

	return Doctrine\ORM\EntityManager::create($settings['connection'], $config);
};

// symfony serializer
$container['serializer'] = function( $c ) {
	$encoders = array( new JsonEncoder() );

	$normalizer = new ObjectNormalizer();
    $normalizer->setIgnoredAttributes(array('password'));
	$normalizer->setCircularReferenceHandler(function ($object) {
		return $object->getId();
	});
	$normalizers = array( $normalizer );
	return new Serializer($normalizers, $encoders);
};

// JWTAuthentication
$container['jwtauth'] = function( $c ) {
    $settings = $c->get('settings');
    return new \Slim\Middleware\JwtAuthentication([
        "secure" => true,
        "relaxed" => ["localhost"],
        "secret" => $settings['auth']['jwtsecret'],
        "algorithm" => $settings['auth']['jwtalgorithm'],
        "rules" => [
            new \Slim\Middleware\JwtAuthentication\RequestPathRule([
                "path" => "/users"
            ]),
            new \Slim\Middleware\JwtAuthentication\RequestMethodRule([
                "passthrough" => ["GET","OPTIONS","POST"] /* @TODO GET MOET HIER WEG */
            ])
        ]
    ]);
};

// actions
/*$container['App\Action\AuthAction'] = function ($c) {
	return new App\Action\AuthAction( $c->get('settings'), $c->get('em'), $c->get('jwtauth'), $c->get('serializer') );
};*/
$container['App\Action\Auth\User'] = function ($c) {
	$em = $c->get('em');
    $userRepository = new VOBettingRepository\Auth\User($em,$em->getClassMetaData(VOBetting\Auth\User::class));
	return new App\Action\Auth\User($userRepository,$c->get('serializer'),$c->get('settings'));
};
/*$container['App\Action\CompetitionSeasonAction'] = function ($c) {
	$competitionSeasonResource = new \App\Resource\CompetitionSeasonResource($c->get('em'));
    return new App\Action\CompetitionSeasonAction($competitionSeasonResource,$c->get('serializer'));
};*/
