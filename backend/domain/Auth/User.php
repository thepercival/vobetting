<?php
/**
 * Created by PhpStorm.
 * User: coen
 * Date: 28-1-17
 * Time: 20:44
 */

namespace VOBetting\Auth;

class User
{
	/**
	 * @var int
	 */
	private $id;

	/**
	 * @var string
	 */
	private $name;

	/**
	 * @var string
	 */
	private $password;

	/**
	 * @var string
	 */
	private $emailaddress;

	public function __construct( User\Name $name, User\Password $password, User\Emailaddress $emailaddress )
	{
		$this->name = $name;
		$this->password = $password;
		$this->emailaddress = $emailaddress;
	}

	/**
	 * Get id
	 *
	 * @return int
	 */
	public function getId()
	{
		return $this->id;
	}

	/**
	 * @return User\Name
	 */
	public function getName()
	{
		return $this->name;
	}

	/**
	 * @param User\Name $name
	 */
	public function setName( User\Name $name )
	{
		$this->name = $name;
	}

	/**
	 * @return User\Password
	 */
	public function getPassword()
	{
		return $this->password;
	}

	/**
	 * @param User\Password $password
	 */
	public function setPassword( User\Password $password )
	{
		$this->password = $password;
	}

	/**
	 * @return User\Emailaddress
	 */
	public function getEmailaddress()
	{
		return $this->emailaddress;
	}

	/**
	 * @param User\Emailaddress $emailaddress
	 */
	public function setEmailaddress( User\Emailaddress $emailaddress )
	{
		$this->emailaddress = $emailaddress;
	}
	
}