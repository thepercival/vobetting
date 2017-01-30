<?php

$dotenv = new \Dotenv\Dotenv( __DIR__ . '/../' );
$dotenv->load();

return [
    'settings' => [
        'environment' => getenv('ENVIRONMENT'),
        'displayErrorDetails' => ( getenv('ENVIRONMENT') === "development" ),
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header
	    'determineRouteBeforeAppMiddleware' => true,

        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => __DIR__ . '/../logs/app.log',
            'level' => \Monolog\Logger::DEBUG,
        ],
        // Doctrine settings
        'doctrine' => [
            'meta' => [
                'entity_path' => [
	                __DIR__ . '/../db/yml-mapping'
                ],
                'auto_generate_proxies' => true,
                'proxy_dir' =>  __DIR__.'/../cache/proxies',
                'cache' => null,
            ],
            'connection' => [
                'driver'   => 'pdo_mysql',
                'host'     => getenv('DB_HOST'),
                'dbname'   => getenv('DB_NAME'),
                'user'     => getenv('DB_USERNAME'),
                'password' => getenv('DB_PASSWORD'),
            ],
            'serializer' => array(
	            'enabled' => true,
            ),
        ],
        'auth' => [
            'jwtsecret' => getenv('JWT_SECRET'),
            'jwtalgorithm' => getenv('JWT_ALGORITHM'),
            'activationsecret' => getenv('ACTIVATION_SECRET'),
        ],
        'www' => [
            'url' => getenv('WWW_URL')
        ],
        'email' => [
            'from' => "info@vobetting.nl",
            'fromname' => "VOBetting"
        ]
    ],
];
