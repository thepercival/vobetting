<?php

// Routes
/*
$app->get('/users', 'App\Action\Auth\User:fetch');
*/

$app->group('', function () use ($app) {
	$app->get('/users', 'App\Action\Auth\User:fetch');
	$app->get('/users/{id}', 'App\Action\Auth\User:fetchOne');
	$app->post('/users', 'App\Action\Auth\User:add');
	$app->put('/users/{id}', 'App\Action\Auth\User:edit');
	$app->delete('/users/{id}', 'App\Action\Auth\User:remove');

	/*$app->get('/competitionseasons', 'App\Action\CompetitionSeasonAction:fetch');
	$app->get('/competitionseasons/{id}', 'App\Action\CompetitionSeasonAction:fetchOne');
	$app->post('/competitionseasons', 'App\Action\CompetitionSeasonAction:add');
	$app->put('/competitionseasons/{id}', 'App\Action\CompetitionSeasonAction:edit');
	$app->delete('/competitionseasons/{id}', 'App\Action\CompetitionSeasonAction:remove');*/

})/*->add(function ($request, $response, $next) {
	return $next($request, $response
		->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
		->withHeader('Access-Control-Allow-Credentials', 'true')
		->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Origin, Content-Type, Accept, Authorization')
		->withHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'));
})*/;

//$app->group('/auth', function () use ($app) {
	$app->post('/auth/login', 'App\Action\AuthAction:login');
    $app->post('/auth/activate', 'App\Action\AuthAction:activate');
	$app->post('/auth/passwordreset', 'App\Action\AuthAction:passwordreset');
	$app->post('/auth/passwordchange', 'App\Action\AuthAction:passwordchange');

//});

/*$app->get('/:resourceType(/(:id)(/))', function($resourceType, $id = null) {
    $resource = ResourceFactory::get($resourceType);
    echo $resource->get($id);
});*/

/*$app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});*/
