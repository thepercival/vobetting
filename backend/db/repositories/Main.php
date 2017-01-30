<?php
/**
 * Created by PhpStorm.
 * User: coen
 * Date: 29-1-17
 * Time: 9:52
 */

namespace VOBettingRepository;

use Doctrine\ORM\EntityRepository;

abstract class Main extends EntityRepository
{
	public function save( $object )
	{
		$this->_em->persist($object);
		$this->_em->flush();
		return $object;
	}
}