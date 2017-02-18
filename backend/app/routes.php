<?php

// Routes
/*$app->group('/voetbal', function () use ($app) {

    $app->get('/seasons', 'Voetbal\Action\Season:fetch');
    $app->get('/seasons/{id}', 'Voetbal\Action\Season:fetchOne');
    $app->post('/seasons', 'Voetbal\Action\Season:add');
    $app->put('/seasons/{id}', 'Voetbal\Action\Season:edit');
    $app->delete('/seasons/{id}', 'Voetbal\Action\Season:remove');

    $app->get('/competitions', 'Voetbal\Action\Competition:fetch');
    $app->get('/competitions/{id}', 'Voetbal\Action\Competition:fetchOne');
    $app->post('/competitions', 'Voetbal\Action\Competition:add');
    $app->put('/competitions/{id}', 'Voetbal\Action\Competition:edit');
    $app->delete('/competitions/{id}', 'Voetbal\Action\Competition:remove');
    
    $app->get('/competitionseasons', 'Voetbal\Action\Competitionseason:fetch');
    $app->get('/competitionseasons/{id}', 'Voetbal\Action\Competitionseason:fetchOne');
    $app->post('/competitionseasons', 'Voetbal\Action\Competitionseason:add');
    $app->put('/competitionseasons/{id}', 'Voetbal\Action\Competitionseason:edit');
    $app->delete('/competitionseasons/{id}', 'Voetbal\Action\Competitionseason:remove');
});*/

$app->any('/voetbal/{resourceType}[/{id}]', \Voetbal\Action\Handler::class );

/*$app->group('/voetbal/external', function () use ($app) {
    $app->get('/systems', 'Voetbal\Action\External\System:fetch');
    $app->get('/systems/{id}', 'Voetbal\Action\External\System:fetchOne');
    $app->post('/systems', 'Voetbal\Action\External\System:add');
    $app->put('/systems/{id}', 'Voetbal\Action\External\System:edit');
    $app->delete('/systems/{id}', 'Voetbal\Action\External\System:remove');

    $app->get('/{resourceType}', 'Voetbal\Action\External\Object:fetch');
    $app->get('/{resourceType}/{id}', 'Voetbal\Action\External\Object:fetchOne');
    $app->post('/{resourceType}', 'Voetbal\Action\External\Object:add');
    $app->delete('/{resourceType}/{id}', 'Voetbal\Action\External\Object:remove');
});*/

$app->group('/auth', function () use ($app) {
	$app->post('/register', 'App\Action\Auth:register');
	$app->post('/login', 'App\Action\Auth:login');
    /*$app->post('/auth/activate', 'App\Action\Auth:activate');
	$app->put('/auth/passwordreset', 'App\Action\Auth:passwordreset');
	$app->put('/auth/passwordchange', 'App\Action\Auth:passwordchange');*/
	$app->get('/users', 'App\Action\Auth\User:fetch');
	$app->get('/users/{id}', 'App\Action\Auth\User:fetchOne');
});

