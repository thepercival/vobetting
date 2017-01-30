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

/*$app->get('/:resourceType(/(:id)(/))', function($resourceType, $id = null) {
    $resource = ObjectRepository::get($resourceType);
    echo $resource->get($id);
});*/

$app->get('/associations', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

/*
 $app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});
 */