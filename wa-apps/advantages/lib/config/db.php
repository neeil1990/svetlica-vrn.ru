<?php
return array(
    'advantages' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'title' => array('varchar', 255, 'null' => 0),
        'description' => array('text'),
        'img' => array('varchar', 255),
        'link' => array('varchar', 255),
        ':keys' => array(
            'PRIMARY' => 'id',
        ),
    ),
);
