<?php
// DIC configuration

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use \Slim\Middleware\JwtAuthentication;

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

    //$normalizerGetSet = new GetSetMethodNormalizer();
    /*$normalizer->setCallbacks(array('createdAt' => function ($dateTime) {
        return $dateTime instanceof \DateTime
            ? $dateTime->getTimestamp()
            : null;
    }));*/

	$normalizers = array( $normalizer );
	return new Serializer($normalizers, $encoders);
};

// symfony serializer
$container['voetbal'] = function( $c ) {
    $voetbalService = new Voetbal\Service($c->get('em'));

    return $voetbalService;
};

// JWTAuthentication
$container['jwtauth'] = function( $c ) {
    $settings = $c->get('settings');
    return new JwtAuthentication([
        "secure" => true,
        "relaxed" => ["localhost"],
        "secret" => $settings['auth']['jwtsecret'],
        // "algorithm" => $settings['auth']['jwtalgorithm'], default
        "rules" => [
            new JwtAuthentication\RequestPathRule([
	            "path" => "/",
	            "passthrough" => ["/auth/register", "/auth/login"]
            ])	        ,
            new JwtAuthentication\RequestMethodRule([
                "passthrough" => ["OPTIONS"]
            ])
        ]
    ]);
};

// actions
$container['App\Action\Auth'] = function ($c) {
	$em = $c->get('em');
    $repos = new VOBettingRepository\Auth\User($em,$em->getClassMetaData(VOBetting\Auth\User::class));
	return new App\Action\Auth($repos,$c->get('serializer'),$c->get('settings'));
};
$container['App\Action\Auth\User'] = function ($c) {
	$em = $c->get('em');
    $repos = new VOBettingRepository\Auth\User($em,$em->getClassMetaData(VOBetting\Auth\User::class));
	return new App\Action\Auth\User($repos,$c->get('serializer'),$c->get('settings'));
};
