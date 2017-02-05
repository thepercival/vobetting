<?php

// Routes
$app->group('/voetbal', function () use ($app) {
	$app->get('/associations', 'Voetbal\Action\Association:fetch');
	$app->get('/associations/{id}', 'Voetbal\Action\Association:fetchOne');
	$app->post('/associations', 'Voetbal\Action\Association:add');
	$app->put('/associations/{id}', 'Voetbal\Action\Association:edit');
	$app->delete('/associations/{id}', 'Voetbal\Action\Association:remove');
});

$app->group('/auth', function () use ($app) {
	$app->post('/register', 'App\Action\Auth:register');
	$app->post('/login', 'App\Action\Auth:login');
    /*$app->post('/auth/activate', 'App\Action\Auth:activate');
	$app->put('/auth/passwordreset', 'App\Action\Auth:passwordreset');
	$app->put('/auth/passwordchange', 'App\Action\Auth:passwordchange');*/
	$app->get('/users', 'App\Action\Auth\User:fetch');
	$app->get('/users/{id}', 'App\Action\Auth\User:fetchOne');
});

/*
$app->get('/{resourceType}[/{id}]', function ($request, $response, $args) use ($app) {

	$id = array_key_exists("id",$args) ? $args["id"] : null;
	$resourceType = array_key_exists("resourceType",$args) ? $args["resourceType"] : null;
	$this->logger->info("default resource route get : " . $resourceType . ( $id ? '/' . $id : null ) );

	$repos = new \VOBettingRepository\Main( $app->getContainer()->get('em'), $resourceType );
	$arrRetVal = ( $id === null ) ? $repos->findAll() : $repos->findOneBy($id);

	$serializer = $app->getContainer()->get('serializer');

	return $response
		->withHeader('Content-Type', 'application/json;charset=utf-8')
		->write($serializer->serialize( $arrRetVal, 'json'));
	;
});
*/

