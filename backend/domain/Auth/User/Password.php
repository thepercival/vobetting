<?php
/**
 * Created by PhpStorm.
 * User: coen
 * Date: 28-1-17
 * Time: 20:44
 */

namespace VOBetting\Auth\User;

class Password
{
	private $password;
	const MIN_LENGTH = 8;
	const MAX_LENGTH = 50;

	public function __construct( $password )
	{
		if ( strlen( $password ) < static::MIN_LENGTH or strlen( $password ) > static::MAX_LENGTH ){
			throw new \InvalidArgumentException( "het wachtwoord moet minimaal ".static::MIN_LENGTH." karakters bevatten en mag maximaal ".static::MAX_LENGTH." karakters bevatten", E_ERROR );
		}

		$this->password = $password;
	}

	public function __toString()
	{
		return $this->password;
	}
}