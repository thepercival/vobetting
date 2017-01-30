<?php

// Routes
/*
$app->get('/users', 'App\Action\Auth\User:fetch');
*/

// $app->group('', function () use ($app) {
	$app->get('/users', 'App\Action\Auth\User:fetch');
	$app->get('/users/{id}', 'App\Action\Auth\User:fetchOne');
	/*$app->put('/users/{id}', 'App\Action\Auth\User:edit');
	$app->delete('/users/{id}', 'App\Action\Auth\User:remove');*/

	/*$app->get('/competitionseasons', 'App\Action\CompetitionSeasonAction:fetch');
	$app->get('/competitionseasons/{id}', 'App\Action\CompetitionSeasonAction:fetchOne');
	$app->post('/competitionseasons', 'App\Action\CompetitionSeasonAction:add');
	$app->put('/competitionseasons/{id}', 'App\Action\CompetitionSeasonAction:edit');
	$app->delete('/competitionseasons/{id}', 'App\Action\CompetitionSeasonAction:remove');*/

//})

$app->group('/auth', function () use ($app) {
	$app->post('/register', 'App\Action\Auth:register');
	$app->post('/login', 'App\Action\Auth:login');
    /*$app->post('/auth/activate', 'App\Action\Auth:activate');
	$app->put('/auth/passwordreset', 'App\Action\Auth:passwordreset');
	$app->put('/auth/passwordchange', 'App\Action\Auth:passwordchange');*/

});

//$app->get('/:resourceType', 'App\Action\Default:fetch');
//$app->get('/:resourceType/{id}', 'App\Action\Default:fetchOne');

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

/*$app->get('/associations', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});*/

/*
 $app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});
 */